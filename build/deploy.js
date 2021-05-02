/* eslint-disable no-console, import/no-extraneous-dependencies */
const process = require('process');
const ghpages = require('gh-pages');

ghpages.publish('dist', (err) => {
  if (err) {
    console.error('Deploy Error!!!');
    process.exit(1);
  } else {
    console.log('Deployed!!!');
    process.exit(0);
  }
});
