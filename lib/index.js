module.exports = () => {
return `const md5File = require('md5-file');
const path = require('path');

// Ignore CSS styles imported on load
const ignoreStyles = require('ignore-styles');
const register = ignoreStyles.default;

// When running locally these will load from a standard import
// When running on the server, we want to load via their hashed version in the build folder
const extensions = ['.gif', '.jpeg', '.jpg', '.png', '.svg'];

// Override the default style ignorer, also modifying all image requests
register(ignoreStyles.DEFAULT_EXTENSIONS, (mod, filename) => {
  if (!extensions.find(f => filename.endsWith(f))) {
    // If we find a style
    return ignoreStyles.noOp();
  } else {
    const hash = md5File.sync(filename).slice(0, 8);
    const bn = path.basename(filename).replace(/(\\.\\w{3})$/, \`.\${hash}$1\`);
    
    mod.exports = \`/static/media/\${bn}\`;
  }
});

// require babel to transpile JSX
// allow imports and code splitting through plugins
require('babel-register')({
  ignore: /\\/(build|node_modules)\\//,
  presets: ['env', 'react-app'],
  plugins: [
    'syntax-dynamic-import',
    'dynamic-import-node',
    'react-loadable/babel'
  ]
});

// import the server
require('./server');`;
};