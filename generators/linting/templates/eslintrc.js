module.exports = {
  extends: ['codfish'<% if (docker) { %>, 'codfish/docker'<% } %>],
  <% if (node) { %>rules: {
    'no-console': 'off',
  },
  env: {
    node: true,
  },
  <% } %>root: true,
};
