module.exports = {
  '*.{json,css,scss,html}': ['prettier --write', 'git add'],
  '*.md': ['prettier --write', 'markdownlint', 'git add'],
  '*.js': ['prettier --write', 'eslint --fix', 'git add'],
};
