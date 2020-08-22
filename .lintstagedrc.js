const { CLIEngine } = require('eslint');

const cli = new CLIEngine({});

module.exports = {
  '*.{js,ts}': (files) =>
    `eslint ${files
      .filter((file) => !cli.isPathIgnored(file))
      .join(' ')} --fix`,
  '*.{js,ts,json}': 'prettier --write',
  '*.wxss': 'stylelint --fix',
  '*.wxml': 'prettier --parser html --write',
  '*.wxs': 'prettier --parser babel-flow --write'
};
