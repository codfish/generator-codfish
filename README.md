# generator-codfish

> Yeoman generators to scaffold out personal projects & open source modules.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-codfish using [npm](https://www.npmjs.com/)
(we assume you have pre-installed [node.js](https://nodejs.org/)).

```sh
npm install -g yo generator-codfish
```

## Usage

Generate your new project: `yo codfish[:<sub>] <project-directory> [<options>]`

- **project-directory** - Required directory to generate into. `.` can be used for the current
  directory.
- **sub** - Optional sub generator.
- **options** - Optional flags to pass to the generator to change functionality. See below for more
  details.

**For Example:**

```sh
# scaffold a new project into a directory named `new-module`
yo codfish new-module

# scaffold a new project into the current directory
yo codfish .

# To add my linting configuration & tooling to an existing project
# you can run the linting sub generator directly. When starting a project with
# the other generators, this will automatically be included.
cd /path/to/project-directory
yo codfish:linting .
```

## CLI Options

- `run-docker` (Boolean, default: `false`) - Run `docker-compose up -d` to start the application
  after generation is complete.
- `skip-install` (Boolean, default: `false`) - Skip installation of npm dependencies.

## Sub generators

Remember you can see the options of each sub generators by running `yo codfish:sub --help`.

- `codfish:linting` - Linting config & tooling for JS, Markdown, CSS, JSON, Git commits, etc.

## Advanced Examples

Running sub-generators, passing options, etc.

```sh
# generate a project
yo codfish my-custom-dir

# add linting to an existing project
yo codfish:linting .
yo codfish:linting . --docker # with docker support
yo codfish:linting . --node # for a node application
```

## Getting To Know Yeoman

- Yeoman has a heart of gold.
- Yeoman is a person with feelings and opinions, but is very easy to work with.
- Yeoman can be too opinionated at times but is easily convinced not to be.
- Feel free to [learn more about Yeoman](http://yeoman.io/).

[npm-image]: https://badge.fury.io/js/generator-codfish.svg
[npm-url]: https://npmjs.org/package/generator-codfish
[travis-image]: https://travis-ci.org/codfish/generator-codfish.svg?branch=master
[travis-url]: https://travis-ci.org/codfish/generator-codfish
[daviddm-image]: https://david-dm.org/codfish/generator-codfish.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/codfish/generator-codfish
