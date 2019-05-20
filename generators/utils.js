const inquirer = require('inquirer');
const askName = require('inquirer-npm-name');
const path = require('path');
const extend = require('lodash/merge');

/**
 * Break up module name into full name, scope name & local name.
 *
 * If you pass in `@codfish/foobar` you should expect back:
 *
 *     {
 *       name: '@codfish/foobar',
 *       scopeName: 'codfish',
 *       localName: 'foobar',
 *     }
 *
 * If you pass in `eslint-config-codfish` you should expect back:
 *
 *     {
 *       name: 'eslint-config-codfish',
 *       localName: 'eslint-config-codfish',
 *     }
 *
 * @param {string} name - Module name, i.e. `eslint-config-codfish` or `@codfish/foobar`.
 * @return {object} - Module name parts, including `name`, `localName` and possibly `scopeName`.
 */
const getModuleNameParts = name => {
  const moduleName = {
    name,
    localName: name,
  };

  // if module name is scoped, like @codfish/foo, parse it
  if (moduleName.name.startsWith('@')) {
    const nameParts = moduleName.name.slice(1).split('/');

    return Object.assign(moduleName, {
      scopeName: nameParts[0],
      localName: nameParts[1],
    });
  }

  return moduleName;
};

/**
 * Prompt the user for the module name.
 *
 * @see {@link https://github.com/SBoudrias/inquirer-npm-name}
 * @see {@link https://github.com/SBoudrias/Inquirer.js#question}
 *
 * @param {object|string} - An Inquirer prompt configuration or just a string to serve as name.
 * @return {object} - Module name parts, including `name`, `localName` and possibly `scopeName`.
 */
const askForModuleName = async prompt => {
  const answer = await askName(
    extend(
      {
        name: 'name',
        default: path.basename(process.cwd()),
      },
      prompt,
    ),
    inquirer,
  );

  return getModuleNameParts(answer.name);
};

module.exports = { askForModuleName };
