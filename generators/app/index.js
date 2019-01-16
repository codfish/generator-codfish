const Generator = require('yeoman-generator');
const chalk = require('chalk');

module.exports = class extends Generator {
  initializing() {
    this.log(`Welcome to the sensational ${chalk.red('generator-codfish')} generator!`);
  }
};
