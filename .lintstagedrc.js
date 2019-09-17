module.exports = {
  '*.{json,css,scss,html}': ['prettier --write', 'git add'],
  '*.md': ['prettier --write', 'markdownlint -i **/templates/*.md', 'git add'],
  '*.js': ['eslint --fix', 'git add'],
};
