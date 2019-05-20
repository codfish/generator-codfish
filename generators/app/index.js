const extend = require('lodash/merge');
const kebabCase = require('lodash/kebabCase');
const githubUsername = require('github-username');
const BaseGenerator = require('../BaseGenerator');
const { askForModuleName } = require('./utils');

const dependencies = [];
const devDependencies = ['@babel/cli@7', '@babel/core@7', '@babel/preset-env@7', 'jest@^24'];

module.exports = class extends BaseGenerator {
  constructor(args, options) {
    super(args, options);

    // Require the project directory as the first argument
    try {
      this.argument('projectDirectory', {
        type: String,
        required: typeof options.projectDirectory === 'undefined',
        desc: 'Project directory',
      });
    } catch (err) {
      this.showProjectDirectoryErr();
      process.exit(1);
    }
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
    this.props = extend({}, this.props, this.options, { new: true });
    this.cwd = this.destinationPath(this.props.projectDirectory);

    // initialize git repo
    this.initGitRepo(this.options.projectDirectory);
  }

  async prompting() {
    const prompts = [
      {
        name: 'devDep',
        message: 'Should people install this as one of their devDependencies?',
        default: true,
        type: 'confirm',
      },
      {
        name: 'description',
        message: 'Project description?',
        when: !this.props.description,
      },
      {
        name: 'homepage',
        message: 'Project homepage url',
        when: !this.props.homepage,
      },
      {
        name: 'authorName',
        message: "Author's Name",
        when: !this.props.authorName,
        default: this.user.git.name(),
        store: true,
      },
      {
        name: 'authorEmail',
        message: "Author's Email",
        when: !this.props.authorEmail,
        default: this.user.git.email(),
        store: true,
      },
      {
        name: 'authorUrl',
        message: "Author's Homepage",
        default: 'https://codfish.io',
        when: !this.props.authorUrl,
        store: true,
      },
      {
        name: 'semantic',
        message: 'Do you want to setup semantic release?',
        default: true,
        type: 'confirm',
      },
    ];

    // First, get module name
    const defaultModuleName =
      this.props.projectDirectory === '.'
        ? this.determineAppname()
        : kebabCase(this.options.projectDirectory);
    const moduleNameParts = await askForModuleName({
      default: defaultModuleName,
      filter: x => kebabCase(x).toLowerCase(),
    });
    const answers = await this.prompt(prompts);
    const githubAccount = await this._askForGithubAccount(
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
    // - `name` - Full module name.
    // - `localName` - Full module name or local name of a scoped module. `@codfish/foo` # => 'foo'
    // - `scopeName` - Scope of a scoped module name. `@codfish/foo` # => "codfish"
    // - `description` - Module description.
    // - `homepage` - Homepage for this module.
    // - `githubAccount` - Git username or org.
    // - `authorName` - Git user's full name.
    // - `authorEmail` - Git user's email.
    // - `authorUrl` - Git user's website url.
    extend(this.props, answers, moduleNameParts, githubAccount);
  }

  default() {
    this._createGithubRepo();

    this.composeWith(require.resolve('../linting'), {
      projectDirectory: this.props.projectDirectory,
    });

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
        npm: '>= 4.0.0',
      },
      repository: {
        type: 'git',
        url: `https://github.com/${this.props.githubAccount}/${this.props.localName}.git`,
      },
    };

    this.fs.writeJSON(this.destinationPath(this.cwd, 'package.json'), pkg);

    this.copyTpl(this.templatePath('**'), this.cwd, this.props);

    this.mv(
      this.destinationPath(this.cwd, 'gitignore'),
      this.destinationPath(this.cwd, '.gitignore'),
    );
  }

  end() {
    this.on('end', () => this.showCompletionMessage());
    this.on('end', this.deleteRcFile);

    const repo = `git@github.com:${this.props.githubAccount}/${this.props.localName}.git`;
    const cwd = this.props.projectDirectory;

    // add the repo url as the `origin` remote
    this.spawnCommandSync('git', ['remote', 'add', 'origin', repo], { cwd });

    // add and make initial commit
    this.spawnCommandSync('git', ['add', '.'], { cwd });
    this.spawnCommandSync('git', ['commit', '-m', 'feat: initial commit'], { cwd });

    // semantic releast initializing
    if (this.props.semantic) {
      this.log(`\n\nSetting up semantic-relase...\n`);
      this.spawnCommandSync('npx', ['semantic-release-cli', 'setup'], { cwd });

      // cleanup after semantic-release-cli
      this.spawnCommandSync('git', ['reset', '--hard', 'HEAD'], { cwd });
    }
  }
};
