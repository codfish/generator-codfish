const path = require('path');
const helpers = require('yeoman-test');

describe('generator-codfish:app', () => {
  beforeAll(() =>
    helpers.run(path.join(__dirname, '../generators/app')).withPrompts({ someAnswer: true }),
  );

  it('creates files', () => {});
});
