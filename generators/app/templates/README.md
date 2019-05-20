# <%= name %>

> <%= description %>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

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

## LICENSE

MIT

<!-- prettier-ignore-start -->
[build-badge]: https://img.shields.io/travis/<%= githubAccount %>/<%= name %>.svg?style=flat-square
[build]: https://travis-ci.org/<%= githubAccount %>/<%= name %>
[version-badge]: https://img.shields.io/npm/v/<%= name %>.svg?style=flat-square
[package]: https://www.npmjs.com/package/<%= name %>
[downloads-badge]: https://img.shields.io/npm/dm/<%= name %>.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/<%= name %>.svg?style=flat-square
[license]: https://github.com/<%= githubAccount %>/<%= name %>/blob/master/LICENSE
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/<%= githubAccount %>/<%= name %>/blob/master/other/CODE_OF_CONDUCT.md
<!-- prettier-ignore-end -->
