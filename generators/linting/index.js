const extend = require('lodash/merge');
const BaseGenerator = require('../BaseGenerator');

const dependencies = [
  '@commitlint/cli@7',
  '@commitlint/config-conventional@7',
  'husky@1',
  'lint-staged@8',
  'markdownlint-cli@0',
  'eslint-config-codfish@2',
  'prettier@1',
  'eslint@5',
];

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

    this.option('docker', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Application uses Docker.',
    });

    this.option('node', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Node application.',
    });
  }

  initializing() {
    this.props = extend(this.props, this.options);
  }

  writing() {
    const pkgJson = {
      scripts: {
        fix: 'npm run format && npm run lint -- --fix',
        format: 'prettier --write "**/*.{json,css,scss,md,html}"',
        lint: 'eslint .',
        'lint:md': 'markdownlint -i node_modules -i dist .',
        validate: 'npm run lint && npm run lint:md && npm run test',
      },
    };

    // extend package.json with linting scripts
    this.fs.extendJSON(
      this.destinationPath(this.options.projectDirectory, 'package.json'),
      pkgJson,
    );

    // copy template files
    this.copyTpl(
      this.templatePath('eslintrc.js'),
      this.destinationPath(this.options.projectDirectory, '.eslintrc.js'),
    );
    this.copy(
      this.templatePath('eslintignore'),
      this.destinationPath(this.options.projectDirectory, '.eslintignore'),
    );
    this.copy(
      this.templatePath('prettierrc.js'),
      this.destinationPath(this.options.projectDirectory, '.prettierrc.js'),
    );
    this.copy(
      this.templatePath('prettierignore'),
      this.destinationPath(this.options.projectDirectory, '.prettierignore'),
    );
    this.copy(
      this.templatePath('.commitlintrc.js'),
      this.destinationPath(this.options.projectDirectory, '.commitlintrc.js'),
    );
    this.copy(
      this.templatePath('.lintstagedrc.js'),
      this.destinationPath(this.options.projectDirectory, '.lintstagedrc.js'),
    );
    this.copy(
      this.templatePath('.huskyrc.js'),
      this.destinationPath(this.options.projectDirectory, '.huskyrc.js'),
    );
    this.copy(
      this.templatePath('.markdownlint.json'),
      this.destinationPath(this.options.projectDirectory, '.markdownlint.json'),
    );
  }

  install() {
    this.npmInstall(
      dependencies,
      { saveDev: true },
      { cwd: this.destinationPath(this.options.projectDirectory) },
    );
  }
};
