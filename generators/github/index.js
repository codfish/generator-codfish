const extend = require('lodash/merge');
const githubUsername = require('github-username');
const kebabCase = require('lodash/kebabCase');
const BaseGenerator = require('../BaseGenerator');
const { askForModuleName } = require('../utils');

module.exports = class extends BaseGenerator {
  constructor(args, options) {
    super(args, options);

    this.argument('projectDirectory', {
      type: String,
      required: typeof options.projectDirectory === 'undefined',
      desc: 'Project directory',
    });
  }

  initializing() {
    this.props = extend({}, this.props, this.options);
    this.cwd = this.destinationPath(this.props.projectDirectory);
  }

  async prompting() {
    const username = this.props.githubAccount || (await githubUsername(this.user.git.email()));

    const prompts = [
      {
        name: 'pushToDocker',
        message: 'Pushing to Docker Hub?',
        default: false,
        type: 'confirm',
      },
      {
        name: 'dockerId',
        message: 'Docker username or organization',
        default: username,
        when: ({ pushToDocker }) => pushToDocker,
      },
    ];

    const { pushToDocker, dockerId } = await this.prompt(prompts);
    extend(this.props, { pushToDocker, dockerId });

    // If this generator was called directly we need to promt users.
    // Otherwise it was composed with a larger generator, so we should return early.
    if (this.props.composed) return;

    const pkg = this.fs.readJSON(this.destinationPath(this.cwd, 'package.json'));

    const { localName } = pkg.name
      ? { localName: pkg.name }
      : await askForModuleName({
          default: this.getAppname(),
          filter: x => kebabCase(x).toLowerCase(),
        });

    extend(this.props, { localName });
  }

  writing() {
    this.copyTpl(this.templatePath('**'), this.cwd, this.props);

    this.mv(
      this.destinationPath(this.cwd, 'gitignore'),
      this.destinationPath(this.cwd, '.gitignore'),
    );
  }
};
