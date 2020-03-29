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

    // Require the project directory as the first argument
    try {
      this.argument('projectDirectory', {
        type: String,
        required: false,
        default: '.',
        desc: 'Project directory',
      });
    } catch (err) {
      this.showProjectDirectoryErr();
      process.exit(1);
    }

    this.option('skipGithub', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Skip the creation of a new github repository.',
    });
  }

  async _askForGithubAccount(email, scopeName = null) {
    let username = scopeName;

    if (!username) {
      username = await githubUsername(email);
    }

    return this.prompt({
      name: 'githubAccount',
      message: 'GitHub username or organization',
      default: username,
    });
  }

  /**
   * Create new github repository.
   */
  _createGithubRepo() {
    try {
      this.spawnCommandSync('sh', [
        require.resolve('../../bin/create-repo.sh'),
        this.props.githubAccount,
        this.props.localName,
      ]);
    } catch (err) {
      this.log(
        'We were not able to create a new repo in Github for you. You need to create one yourself: https://github.com/new',
      );
    }
  }

  initializing() {
    // set destination directory
    this.cwd = this.destinationPath(this.options.projectDirectory);

    // initialize git repo
    this.initGitRepo(this.options.projectDirectory);

    // merge props and options
    this.props = extend(this.props, this.options);
  }

  async prompting() {
    // First, get the module name
    const moduleNameParts = await askForModuleName({
      default: this.getAppname(),
      filter: x => kebabCase(x).toLowerCase(),
    });

    const prompts = [
      {
        name: 'isPackage',
        message: 'Is this an npm package (as opposed to an application)?',
        default: true,
        type: 'confirm',
      },
      {
        name: 'devDep',
        message: 'Should people install this as one of their devDependencies?',
        default: false,
        type: 'confirm',
        when: ({ isPackage }) => isPackage,
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
        message: "Author's Name",
        default: this.user.git.name(),
        store: true,
      },
      {
        name: 'authorEmail',
        message: "Author's Email",
        default: this.user.git.email(),
        store: true,
      },
      {
        name: 'authorUrl',
        message: "Author's Homepage",
        default: 'https://codfish.io',
        store: true,
      },
      {
        name: 'createRepo',
        message: 'Create a repository for you in GitHub?',
        default: false,
        type: 'confirm',
        when: !this.props.skipGithub,
      },
    ];
    const answers = await this.prompt(prompts);

    // Then ask for github account
    const { githubAccount } = await this._askForGithubAccount(
      answers.authorEmail,
      moduleNameParts.scopeName,
    );

    // if no homepage was given, set it to github repo
    if (!answers.homepage && githubAccount) {
      answers.homepage = `https://github.com/${githubAccount}/${moduleNameParts.localName}`;
    }

    // Merging all of the following into `this.props` for easy access throughout the generator.
    // NOTE: We'll have access to these variables in templates as well.
    //
    // - `name` - Full module name. `@codfish/foo` or `cod-scripts`
    // - `localName` - Full module name or local name of a scoped module. `@codfish/foo` # => 'foo'
    // - `scopeName` - Scope of a scoped module name. `@codfish/foo` # => "codfish"
    // - `isPackage` - If this is a package and NOT an application.
    // - `description` - Module description.
    // - `homepage` - Homepage for this module.
    // - `githubAccount` - Git username or org.
    // - `authorName` - Git user's full name.
    // - `authorEmail` - Git user's email.
    // - `authorUrl` - Git user's website url.
    extend(this.props, answers, moduleNameParts, { githubAccount });
  }

  default() {
    if (!this.props.skipGithub && this.props.createRepo) {
      this._createGithubRepo();
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

    // prevent npm publishing for non-packages (i.e. applications).
    // semantic-release will still run to help cut new github releases.
    if (!this.props.isPackage) {
      pkg.private = true;
    }

    this.fs.writeJSON(this.destinationPath(this.cwd, 'package.json'), pkg);
    this.copyTpl(this.templatePath('**'), this.cwd, this.props);
  }

  end() {
    this.on('end', () => this.showCompletionMessage());
    this.deleteRcFile();

    const repo = `git@github.com:${this.props.githubAccount}/${this.props.localName}.git`;

    // last minute code formatting before commit
    this.spawnCommandSync('npm', ['run', 'format'], { cwd: this.cwd });

    // add the repo url as the `origin` remote
    this.spawnCommandSync('git', ['remote', 'add', 'origin', repo], { cwd: this.cwd });

    // add and make initial commit
    // --no-verify is required because latest version of lint-staged requires
    // a commit before running. http://bit.ly/2viAmQM
    this.spawnCommandSync('git', ['add', '.'], { cwd: this.cwd });
    this.spawnCommandSync('git', ['commit', '--no-verify', '-m', 'feat: initial commit'], {
      cwd: this.cwd,
    });
  }
};
