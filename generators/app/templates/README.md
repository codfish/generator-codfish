# <%= name %>

> <%= description %>

## The problem

// TODO

## This solution

// TODO

<% if (isPackage) { %>
## Installation

This module is distributed via [npm](https://www.npmjs.com) which is bundled with
[node](https://nodejs.org/en/) and should be installed as one of your project's
<% if (devDep) { %>`devDependencies`<% } else { %>`dependencies`<% } %>:

```sh
npm install --save<% if (devDep) { %>-dev<% } %> <%= name %>
```
<% } else { %>
## Setup

// TODO
<% } %>

## Usage

// TODO

## Inspiration

// TODO

## LICENSE

MIT
