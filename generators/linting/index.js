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
    const pkg = {
      scripts: {
        build: 'cod-scripts build',
        'build:watch': 'npm run build -- --watch',
        format: 'cod-scripts format',
        lint: 'cod-scripts lint',
        'lint:commit': 'cod-scripts commitlint',
        test: 'cod-scripts test',
      },
      eslintConfig: {
        extends: ['./node_modules/cod-scripts/eslint.js'],
      },
      husky: {
        hooks: {
          'pre-commit': 'cod-scripts pre-commit',
          'commit-msg': 'cod-scripts commitlint -E HUSKY_GIT_PARAMS',
        },
      },
    };

    // extend package.json with linting scripts
    this.fs.extendJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    this.npmInstall(['cod-scripts'], { saveDev: true }, { cwd: this.cwd });
    this.npmInstall(['@babel/runtime'], {}, { cwd: this.cwd });
  }
};
