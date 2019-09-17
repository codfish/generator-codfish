const extend = require('lodash/merge');
const githubUsername = require('github-username');
const kebabCase = require('lodash/kebabCase');
const BaseGenerator = require('../BaseGenerator');
const { askForModuleName } = require('../utils');

module.exports = class extends BaseGenerator {
  constructor(args, options) {
    super(args, options);

    try {
      this.argument('projectDirectory', {
        type: String,
        required: typeof options.projectDirectory === 'undefined',
        desc: 'Project directory',
      });
    } catch (err) {
      this.showProjectDirectoryErr('github');
      process.exit(1);
    }
  }

  initializing() {
    this.props = extend({}, this.props, this.options);
    this.cwd = this.destinationPath(this.props.projectDirectory);
  }

  async prompting() {
    // If this generator was called directly we need to promt users.
    // Otherwise it was composed with a larger generator, so we should return early.
    if (this.props.composed) return;

    const { localName } = await askForModuleName({
      default: this.getAppname(),
      filter: x => kebabCase(x).toLowerCase(),
    });

    const username = await githubUsername(this.user.git.email());

    const { githubAccount } = await this.prompt({
      name: 'githubAccount',
      message: 'GitHub username or organization',
      default: username,
    });

    const isPackage = await this.askPackageVsApplication();

    this.props = extend(this.props, { localName, githubAccount, isPackage });
  }

  writing() {
    this.copyTpl(this.templatePath('**'), this.cwd, this.props);

    this.mv(
      this.destinationPath(this.cwd, 'gitignore'),
      this.destinationPath(this.cwd, '.gitignore'),
    );
  }
};
