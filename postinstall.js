console.log('test');

const package = require('./package.json')

if (package.version.includes('canary')) {
  console.warn('You are using an canary version. Please, use stable version')
}