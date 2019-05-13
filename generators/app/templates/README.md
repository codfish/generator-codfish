# <%= name %>

> <%= description %>

<hr />

[![Build Status][build-badge]][build] [![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package] [![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star] [![Tweet][twitter-badge]][twitter]

## The problem

// TODO

## This solution

// TODO

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and should be installed
as one of your project's <% if (devDep) { %>`devDependencies`<% } %><% if (!devDep) {
%>`dependencies`<% } %>:

```sh
npm install --save<% if (devDep) { %>-dev<% } %> <%= name %>
```

## Usage

// TODO

## Inspiration

// TODO

## Other Solutions

I'm not aware of any, if you are please [make a pull request][prs] and add it here!

## LICENSE

MIT

[build-badge]: https://img.shields.io/travis/<%= githubAccount %>/<%= name %>.svg?style=flat-square
[build]: https://travis-ci.org/<%= githubAccount %>/<%= name %>
[coverage-badge]: https://img.shields.io/codecov/c/github/<%= githubAccount %>/<%= name %>.svg?style=flat-square
[coverage]: https://codecov.io/github/<%= githubAccount %>/<%= name %>
[version-badge]: https://img.shields.io/npm/v/<%= name %>.svg?style=flat-square
[package]: https://www.npmjs.com/package/<%= name %>
[downloads-badge]: https://img.shields.io/npm/dm/<%= name %>.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/<%= name %>.svg?style=flat-square
[license]: https://github.com/<%= githubAccount %>/<%= name %>/blob/master/LICENSE
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/<%= githubAccount %>/<%= name %>/blob/master/other/CODE_OF_CONDUCT.md
