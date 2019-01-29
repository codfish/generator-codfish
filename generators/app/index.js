const Generator = require('yeoman-generator');
const extend = require('lodash/merge');
const path = require('path');
const askName = require('inquirer-npm-name');
const githubUsername = require('github-username');
const validatePackageName = require('validate-npm-package-name');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    // Accept the destination directory as an argument, otherwise will scaffold
    // into the cwd.
    this.argument('dest', { type: String, required: false });

    this.option('dest', {
      type: Boolean,
      required: false,
      desc: 'Destination directory.',
    });

    this.option('name', {
      type: String,
      required: false,
      desc: 'Project name',
    });

    this.option('docker', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Application uses Docker.',
    });

    this.option('githubAccount', {
      type: String,
      required: false,
      desc: 'GitHub username or organization',
    });

    this.option('repositoryName', {
      type: String,
      required: false,
      desc: 'Name of the GitHub repository',
    });

    this.option('projectRoot', {
      type: String,
      required: false,
      default: 'src',
      desc: 'Relative path to the project code root',
    });

    this.option('readme', {
      type: String,
      required: false,
      desc: 'Content to insert in the README.md file',
    });
  }

  /**
   * Validate that a provided npm package name is unique & available.
   *
   * @param {string} name - npm package name.
   */
  _validateName() {
    const validity = validatePackageName(this.props.name);

    if (validity.validForNewPackages) return;

    this.emit(
      'error',
      new Error(validity.errors[0] || 'The name option is not a valid npm package name.'),
    );
  }

  async _askForModuleName() {
    if (this.props.name) return this.props.name;

    // prompt and validate module name
    const moduleName = await askName(
      {
        name: 'name',
        default: path.basename(process.cwd()),
      },
      this,
    );

    return moduleName.name;
  }

  /**
   * Parse module name string to check for scope.
   *
   * @param {string} name - Provided npm module name.
   * @return {object} - Plain object containing {name, repositoryName, [localName], [scopeName]}
   */
  _getModuleNameParts(name) {
    const moduleName = {
      name,
      repositoryName: this.props.repositoryName || name,
    };

    // if name has a scope, break it out into parts
    if (moduleName.name.startsWith('@')) {
      const nameParts = moduleName.name.slice(1).split('/');

      Object.assign(moduleName, {
        scopeName: nameParts[0],
        localName: nameParts[1],
      });
    }

    return moduleName;
  }

  async _askForGithubAccount() {
    if (this.props.githubAccount) return this.props.githubAccount;

    let defaultUsername;
    if (this.props.scopeName) {
      defaultUsername = this.props.scopeName;
    } else {
      defaultUsername = await githubUsername(this.props.authorEmail);
    }

    const answer = await this.prompt({
      name: 'githubAccount',
      message: 'GitHub username or organization',
      default: defaultUsername,
    });

    return answer.githubAccount;
  }

  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Set default props and merge with provided options
    this.props = extend({
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage,
      repositoryName: this.options.repositoryName,
    }, this.options);

    // if user provided name option, check that it's valid
    if (this.props.name) this._validateName(this.props.name);
  }

  async prompting() {
    // get modele name & parse it for scope and return it's parts. Extend props
    // with module name parts.
    const name = await this._askForModuleName();
    const moduleNameParts = await this._getModuleNameParts(name);
    this.props = extend(this.props, moduleNameParts);

    // ask for github account
    const githubAccount = await this._askForGithubAccount();
    this.props = extend(this.props, { githubAccount });

    const answers = await this.prompt([
      {
        name: 'description',
        message: 'Description',
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
        when: !this.props.authorUrl,
        store: true,
      },
      {
        name: 'keywords',
        message: 'Package keywords (comma to split)',
        when: !this.pkg.keywords,
        filter(words) {
          return words.split(/\s*,\s*/g);
        },
      },
    ]);

    this.props = extend(this.props, answers);
  }

  writing() {
    // Re-read the content at this point because a composed generator might modify it.
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend(
      {
        name: this.props.name,
        version: '0.0.0-semantically-released',
        description: this.props.description,
        homepage: this.props.homepage,
        author: {
          name: this.props.authorName,
          email: this.props.authorEmail,
          url: this.props.authorUrl,
        },
        files: [this.options.projectRoot],
        main: path.join(this.options.projectRoot, 'index.js').replace(/\\/g, '/'),
        keywords: [],
        devDependencies: {},
        engines: {
          npm: '>= 4.0.0',
        },
      },
      currentPkg,
    );

    // Combine the keywords
    if (this.props.keywords && this.props.keywords.length) {
      pkg.keywords = [...new Set(this.props.keywords.concat(pkg.keywords))];
    }

    // Let's extend package.json so we're not overwriting user previous fields
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }
};
