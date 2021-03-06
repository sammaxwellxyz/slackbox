require('babel-register');
if (process.env.NODE_ENV !== 'production') require('dotenv').load();

const glob = require('glob');
const { resolve } = require('path');

process.argv.slice(2).forEach(arg => {
  glob(arg, (err, files) => {
    if (err) throw err;
    files.forEach(file => require(resolve(process.cwd(), file)));
  });
});
