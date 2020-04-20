const extend = require('lodash/merge');
const BaseGenerator = require('../BaseGenerator');

module.exports = class extends BaseGenerator {
  constructor(args, options) {
    super(args, options);

    this.argument('projectDirectory', {
      type: String,
      required: false,
      default: options.projectDirectory || '.',
      desc: 'Project directory',
    });
  }

  initializing() {
    this.props = extend({}, this.props, this.options);

    // If this sub generator was called directly from cli, update destination root
    if (!this.props.composed) {
      this.cwd = this.destinationRoot(this.options.projectDirectory);
    }
  }

  writing() {
    this.copyTpl(this.templatePath('**'), this.destinationPath(), this.props);

    this.fs.move(this.destinationPath('gitignore'), this.destinationPath('.gitignore'));
  }
};
