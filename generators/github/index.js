const extend = require('lodash/merge');
const BaseGenerator = require('../BaseGenerator');

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

  writing() {
    this.copyTpl(this.templatePath('**'), this.cwd, this.props);

    this.mv(
      this.destinationPath(this.cwd, 'gitignore'),
      this.destinationPath(this.cwd, '.gitignore'),
    );
  }
};
