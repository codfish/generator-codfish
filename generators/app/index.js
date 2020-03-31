const chalk = require('chalk');
const extend = require('lodash/merge');
const kebabCase = require('lodash/kebabCase');
const githubUsername = require('github-username');
const BaseGenerator = require('../BaseGenerator');
const { askForModuleName } = require('../utils');

const dependencies = [];
const devDependencies = [];

module.exports = class extends BaseGenerator {
  constructor(args, options) {
    super(args, options);

    this.argument('projectDirectory', {
      type: String,
      required: false,
      default: '.',
      desc: 'The directory you want to generate into.',
    });

    this.option('skipGithub', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Skip the creation of a new github repository.',
    });
  }

  initializing() {
    this.props = extend(this.props, this.options);
    this.cwd = this.destinationPath(this.options.projectDirectory);
    this.gitInit(this.options.projectDirectory);
  }

  async prompting() {
    const moduleNameParts = await askForModuleName({
      default: this.getAppname(),
      filter: x => kebabCase(x).toLowerCase(),
    });

    const prompts = [
      {
        name: 'devDep',
        message: 'Should people install this as one of their devDependencies?',
        default: false,
        type: 'confirm',
      },
      {
        name: 'description',
        message: 'Project description?',
      },
      {
        name: 'homepage',
        message: 'Project homepage url',
      },
      {
        name: 'authorName',
        message: "What's your name?",
        default: this.user.git.name(),
        store: true,
      },
      {
        name: 'authorEmail',
        message: "What's your email?",
        default: this.user.git.email(),
        store: true,
      },
      {
        name: 'authorUrl',
        message: "What's the URL of your website?",
        default: 'https://codfish.io',
        store: true,
      },
      {
        name: 'githubAccount',
        message: 'What is your GitHub username or organization?',
        default: async ({ authorEmail }) => {
          return moduleNameParts.scopeName || githubUsername(authorEmail);
        },
      },
      {
        name: 'createRepo',
        message: 'Should we try to create a repository for you in GitHub?',
        default: false,
        type: 'confirm',
        when: !this.options.skipGithub,
      },
    ];
    const answers = await this.prompt(prompts);

    // if no homepage was given, set it to github repo
    if (!answers.homepage && answers.githubAccount) {
      answers.homepage = `https://github.com/${answers.githubAccount}/${moduleNameParts.localName}`;
    }

    // Merging all of the following into `this.props` for easy access throughout the generator.
    // NOTE: We'll have access to these variables in templates as well.
    //
    // - `name` - Full module name. `@codfish/foo` or `cod-scripts`
    // - `localName` - Full module name or local name of a scoped module. `@codfish/foo` # => 'foo'
    // - `scopeName` - Scope of a scoped module name. `@codfish/foo` # => "codfish"
    // - `description` - Module description.
    // - `homepage` - Homepage for this module.
    // - `githubAccount` - Git username or org.
    // - `authorName` - Git user's full name.
    // - `authorEmail` - Git user's email.
    // - `authorUrl` - Git user's website url.
    // - `createRepo` - Whether the user wanted us to create a GitHub repo for them.
    extend(this.props, answers, moduleNameParts);
  }

  default() {
    if (!this.props.skipGithub && this.props.createRepo) {
      this.createGitHubRepo();
    }

    this.composeWith(require.resolve('../linting'), this.props, { composed: true });
    this.composeWith(require.resolve('../github'), extend({}, this.props, { composed: true }));
    this.composeWith(require.resolve('generator-license'), {
      name: this.props.authorName,
      email: this.props.authorEmail,
      website: this.props.authorUrl,
      license: 'MIT',
      output: `${this.cwd}/LICENSE`,
    });
  }

  install() {
    this.npmInstall(dependencies, { save: true }, { cwd: this.cwd });
    this.npmInstall(devDependencies, { saveDev: true }, { cwd: this.cwd });
  }

  writing() {
    const pkg = {
      name: this.props.name,
      version: '0.0.0-semantically-released',
      description: this.props.description,
      homepage: this.props.homepage,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl,
      },
      files: ['dist'],
      main: 'dist/index.js',
      keywords: [],
      license: 'MIT',
      devDependencies: {},
      engines: {
        node: '>=10',
        npm: '>=6',
        yarn: '>=1',
      },
      repository: {
        type: 'git',
        url: `https://github.com/${this.props.githubAccount}/${this.props.localName}.git`,
      },
    };

    this.fs.extendJSON(this.destinationPath(this.cwd, 'package.json'), pkg);
    this.copyTpl(this.templatePath('**'), this.cwd, this.props);
  }

  end() {
    this.deleteRcFile();

    const repo = `${this.props.githubAccount}/${this.props.localName}`;
    const secretsUrl = `https://github.com/${repo}/settings/secrets`;
    const remoteUrl = `git@github.com:${repo}.git`;

    // last minute code formatting before commit
    this.spawnCommandSync('npm', ['run', 'format'], { cwd: this.cwd });

    // add the repo url as the `origin` remote
    this.spawnCommandSync('git', ['remote', 'add', 'origin', remoteUrl], { cwd: this.cwd });

    // add and make initial commit
    // --no-verify is required because latest version of lint-staged requires
    // a commit before running. http://bit.ly/2viAmQM
    this.spawnCommandSync('git', ['add', '.'], { cwd: this.cwd });
    this.spawnCommandSync('git', ['commit', '--no-verify', '-m', 'feat: initial commit'], {
      cwd: this.cwd,
    });

    this.log();
    this.log(
      chalk.cyan(
        `Success! The project was generated in ${chalk.green(`${this.props.projectDirectory}`)}.`,
      ),
    );
    this.log();
    this.log(
      chalk.cyan(
        `In order to deploy your package to npm, you need to add an NPM_TOKEN secret in GitHub: ${chalk.green(
          secretsUrl,
        )}`,
      ),
    );
    this.log();
    this.log(
      chalk.cyan(
        `We've initialized a git repo ${chalk.green(repo)} and made an initial commit for you.`,
      ),
    );
  }
};
