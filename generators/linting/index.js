const extend = require('lodash/merge');
const BaseGenerator = require('../BaseGenerator');

const devDependencies = ['cod-scripts'];

const dependencies = ['@babel/runtime'];

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
    this.props = extend(this.props, this.options);
    this.cwd = this.destinationPath(this.props.projectDirectory);
  }

  writing() {
    const pkgJson = {
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
          'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
        },
      },
    };

    // extend package.json with linting scripts
    this.fs.extendJSON(
      this.destinationPath(this.options.projectDirectory, 'package.json'),
      pkgJson,
    );
  }

  install() {
    this.npmInstall(dependencies, {}, { cwd: this.cwd });
    this.npmInstall(devDependencies, { saveDev: true }, { cwd: this.cwd });
  }
};
