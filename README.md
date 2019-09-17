# generator-codfish

> Yeoman generators to scaffold out personal projects & open source modules.

Ultimate goal is to get up and running as quickly as possible. This is a generator I will use to
scaffold out new projects and npm modules. It goes further than just setting up code. It will also:

- Create a new Github repo for you ([more details below](#Github))
- Sets up auto-linting on commit, as well as CI/CD
- Init's git and makes an initial commit. All you need to do is `git push origin master`.

<!-- START doctoc -->
<!-- END doctoc-->

## Installation

First, install [Yeoman](http://yeoman.io) and generator-codfish using [npm](https://www.npmjs.com/)
(we assume you have pre-installed [node.js](https://nodejs.org/)).

```sh
npm install -g yo generator-codfish
```

## Usage

Generate your new project: `yo codfish[:<sub>] [<project-directory>] [<options>]`

- **project-directory** - Directory to generate into. The current directory will be used by default.
- **sub** - Optional sub generator.
- **options** - Optional flags to pass to the generator to change functionality. See below for more
  details.

**For Example:**

```sh
# Scaffold a new project into a directory named `new-module`.
yo codfish new-module

# Scaffold a new project into the current directory.
yo codfish .

# By default the generator automatically tries to create a github repository for you.
# This will skip that.
yo codfish new-module --skip-github

# To add my linting configuration & tooling to an existing project
# you can run the linting sub generator directly. When starting a project with
# the other generators, this will automatically be included.
cd /path/to/project-directory
yo codfish:linting .
```

## CLI Options

- `skip-install` (Boolean, default: `false`) - Skip installation of npm dependencies.
- `skip-github` (Boolean, default: `false`) - Skip the auto creation of a new github repository.

## Sub generators

Remember you can see the options of each sub generators by running `yo codfish:sub --help`.

- `codfish:linting` - Linting config & tooling for JS, Markdown, CSS, JSON, Git commits, etc.
- `codfish:github` - Adds node `.gitignore`, GitHub Actions workflows & GitHub templates.

## Advanced Examples

Running sub-generators, passing options, etc.

```sh
# generate a project
yo codfish my-custom-dir

# add linting to an existing project
yo codfish:linting .
yo codfish:linting . --docker # with docker support
yo codfish:linting . --node # for a node application

# add github actions to an existing project
yo codfish:github .
```

## Getting To Know Yeoman

- Yeoman has a heart of gold.
- Yeoman is a person with feelings and opinions, but is very easy to work with.
- Yeoman can be too opinionated at times but is easily convinced not to be.
- Feel free to [learn more about Yeoman](http://yeoman.io/).

[npm-image]: https://badge.fury.io/js/generator-codfish.svg
[npm-url]: https://npmjs.org/package/generator-codfish
[daviddm-image]: https://david-dm.org/codfish/generator-codfish.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/codfish/generator-codfish
