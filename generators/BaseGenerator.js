const fs = require('fs');
const chalk = require('chalk');
const Generator = require('yeoman-generator');
const kebabCase = require('lodash/kebabCase');

/**
 * Base generator that should be extended from by all of our sub generators. This
 * is meant to share functionality across generators while keeping things a
 * little more DRY and code will be cleaner in the application generators.
 */
module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    // allows us to catch and prevent deaths on child process errors
    const spawn = this.spawnCommandSync;
    this.spawnCommandSync = (command, params, opts = {}) => {
      const childProcess = spawn(command, params, opts);

      if (childProcess.status !== 0 && opts.dieOnError) {
        this.die(opts.message);
      }
    };
  }

  /**
   * Proxy to Yeoman's `this.fs.copy`, with some default copy options.
   *
   * @param {string} from - Copy from file path.
   * @param {string} to - Copy to file path.
   */
  copy(from, to) {
    this.fs.copy(from, to, { globOptions: { dot: true } });
  }

  /**
   * Proxy to Yeoman's `this.fs.copyTpl`, with some default copy options.
   *
   * @param {string} from - Copy from file path.
   * @param {string} to - Copy to file path.
   * @param {object} [context] - Data to pass to template. Defaults to generator instance `props`.
   */
  copyTpl(from, to, context = null) {
    this.fs.copyTpl(from, to, context || this.props, {}, { globOptions: { dot: true } });
  }

  /**
   * Rename file. Proxy to Yeoman's `this.fs.move`.
   *
   * @param {string} from - Move from file path.
   * @param {string} to - Move to file path.
   */
  mv(from, to) {
    this.fs.move(this.destinationPath(from), this.destinationPath(to));
  }

  /**
   * Determine the name of the application/module being generated.
   */
  getAppname() {
    return this.props.projectDirectory === '.'
      ? this.determineAppname()
      : kebabCase(this.options.projectDirectory);
  }

  /**
   * Initialize a git repository in the provided directory. If it's a git repo already, turn off
   * the new flag to help us in future methods.
   *
   * @param {string} directory - Directory to initialize the repo in.
   */
  gitInit(directory) {
    if (fs.existsSync(this.destinationPath(directory, '.git'))) {
      return;
    }

    // otherwise initialize a git repo. need to make sure directory exists first
    const dir = this.destinationPath(directory);
    this.spawnCommandSync('mkdir', ['-p', dir], {
      dieOnError: true,
      message: `Error: could not create directory ${dir}`,
    });

    this.spawnCommandSync('git', ['init', '--quiet'], {
      cwd: dir,
      dieOnError: true,
      message: 'Encountered an issue initiating this as a git repository',
    });
  }

  /**
   * Create new github repository.
   */
  createGitHubRepo() {
    try {
      this.spawnCommandSync('sh', [
        require.resolve('./../bin/create-repo.sh'),
        this.props.githubAccount,
        this.props.localName,
      ]);
    } catch (err) {
      console.error(err);
      this.log(
        'We were not able to create a new repo in Github for you. You need to create one yourself: https://github.com/new',
      );
    }
  }

  /**
   * Kills the generator. Catches errors in child processes and fails gracefully.
   * Get's called from our monkey-patched version of Yeoman's spawnCommandSync method.
   *
   * @param {string} message - Error message to display.
   */
  die(message) {
    this.log();
    this.log(chalk.red(message));
    this.log();
    this.log(chalk.red('Woops, something went wrong =('));
    this.log();
    this.log(chalk.red(`If this is a bug end please open up an issue:`));
    this.log(`  https://github.com/codfish/generator-codfish/issues`);
    this.log();
    this.log(chalk.red('Otherwise please resolve any issues and re-run the generator'));
    this.log();
    this.env.error();
  }

  /**
   * Delete the `.yo-rc.json` file.
   *
   * From Yeoman Docs:
   *
   * "Most importantly, Yeoman searches the directory tree for a .yo-rc.json file.
   * If found, it considers the location of the file as the root of the project.
   * Behind the scenes, Yeoman will change the current directory to the .yo-rc.json
   * file location and run the requested generator there."
   *
   * NOTE: I'm not in favor of this feature, and find it causes more issues than it does solve
   * problems. I prefer knowing explicitly where I'm generating. So deleting it prevents this
   * functionality.
   *
   * @see {@link https://yeoman.io/authoring/#finding-the-project-root}
   */
  deleteRcFile() {
    this.spawnCommandSync('rm', [this.destinationPath('.yo-rc.json'), '.yo-rc.json']);
  }
};
