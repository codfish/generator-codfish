# generator-codfish

> Yeoman generators to scaffold out personal projects & open source modules.

[![version][version-badge]][package] [![downloads][downloads-badge]][npmcharts]
[![GitHub Workflow Status][actions-badge]][actions-badge] [![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs] [![Semantic Release][semantic-release-badge]][semantic-release]
[![Commitizen friendly][commitizen-badge]][commitizen]

Ultimate goal is to get up and running as quickly as possible. This is a generator I will use to
scaffold out new projects and npm modules. It goes further than just setting up code. It will also:

- Sets up auto-linting on commit with [`cod-scripts`](https://github.com/codfish/cod-scripts).
- Sets up some basic GitHub Actions workflows with automated versioning & deployments with
  [semantic-release](https://github.com/semantic-release/semantic-release).
- Optionally creates a new GitHub repo for you.
- Init's git and makes an initial commit. All you need to do is `git push origin master`.

<!-- START doctoc -->
<!-- END doctoc-->

## Installation

**Recommended:** Don't install globally, just run with `npx`.

```sh
npx -p yo -p generator-codfish -c 'yo codfish'
```

Or go old school:

```sh
npm install -g yo generator-codfish
```

With generators you're typically always looking to use the latest & greatest when generating so I
prefer `npx` so you don't need to keep your global installation up to date.

## Usage

```sh
yo codfish
```

### Advanced Usage

```sh
yo codfish[:<sub>] [<project-directory>] [<options>]
```

- **project-directory** - Directory to generate into. Will make the directory for you if it doesn't
  exist. The current directory will be used by default.
- **sub** - Optional sub generator.
- **options** - Optional flags to pass to the generator to change functionality. See below for more
  details.

**Examples:**

**Note**: If you're using `npx` you can wrap the following examples with
`npx -p yo -p generator-codfish -c '<example>'`.

```sh
# Scaffold a new project into the current directory.
yo codfish

# Scaffold a new project/module into a directory named `new-module`.
yo codfish new-module

# By default the generator automatically tries to create a github repository for you.
# This will skip that.
yo codfish new-module --skip-github

# To add my linting configuration & tooling to an existing project you can
# run the linting sub generator directly. When starting a new project
# with the other generators, this will automatically be included.
yo codfish:linting

# To add GitHub templates & GitHub Actions workflows to an existing project
yo codfish:github
```

### Options

- `skip-install` (Boolean, default: `false`) - Skip installation of npm dependencies.
- `skip-github` (Boolean, default: `false`) - Skip the auto creation of a new github repository.

## Sub generators

Remember you can see the options of each sub generators by running `yo codfish:sub --help`.

- `yo codfish:linting` - Linting config & tooling for JS, Markdown, CSS, JSON, Git commits, etc.
- `yo codfish:github` - Adds node `.gitignore`, GitHub Actions workflows & GitHub templates.

These are all run automatically as part of the main generator when running `yo codfish`.

## Getting To Know Yeoman

- Yeoman has a heart of gold.
- Yeoman is a person with feelings and opinions, but is very easy to work with.
- Yeoman can be too opinionated at times but is easily convinced not to be.
- Feel free to [learn more about Yeoman](http://yeoman.io/).

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[semantic-release]: https://github.com/semantic-release/semantic-release
[semantic-release-badge]:
  https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[prs]: http://makeapullrequest.com
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[commitizen]: http://commitizen.github.io/cz-cli/
[commitizen-badge]:
  https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/generator-codfish
[version-badge]: https://img.shields.io/npm/v/generator-codfish.svg?style=flat-square
[package]: https://www.npmjs.com/package/generator-codfish
[downloads-badge]: https://img.shields.io/npm/dm/generator-codfish.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/generator-codfish.svg?style=flat-square
[license]: https://github.com/codfish/generator-codfish/blob/master/LICENSE
[actions]: https://github.com/codfish/generator-codfish/actions
[actions-badge]:
  https://img.shields.io/github/workflow/status/codfish/generator-codfish/Release/master?style=flat-square
