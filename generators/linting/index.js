const extend = require('lodash/merge');
const BaseGenerator = require('../BaseGenerator');

const devDependencies = [
  '@commitlint/cli@8',
  '@commitlint/config-conventional@8',
  'markdownlint-cli@0',
  'cod-scripts',
];

const dependencies = ['@babel/runtime'];

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
      this.showProjectDirectoryErr('linting');
      process.exit(1);
    }
  }

  initializing() {
    this.props = extend(this.props, this.options);
  }

  writing() {
    const pkgJson = {
      scripts: {
        build: 'cod-scripts build',
        'build:watch': 'npm run build -- --watch',
        format: 'cod-scripts format',
        lint: 'cod-scripts lint',
        'lint:md': 'markdownlint -i node_modules -i dist .',
        test: 'cod-scripts test',
        validate: 'cod-scripts validate',
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

    // copy template files
    this.copy(
      this.templatePath('.commitlintrc.js'),
      this.destinationPath(this.options.projectDirectory, '.commitlintrc.js'),
    );
    this.copy(
      this.templatePath('.markdownlint.json'),
      this.destinationPath(this.options.projectDirectory, '.markdownlint.json'),
    );
  }

  install() {
    this.npmInstall(dependencies, {}, { cwd: this.destinationPath(this.options.projectDirectory) });
    this.npmInstall(
      devDependencies,
      { saveDev: true },
      { cwd: this.destinationPath(this.options.projectDirectory) },
    );
  }
};
