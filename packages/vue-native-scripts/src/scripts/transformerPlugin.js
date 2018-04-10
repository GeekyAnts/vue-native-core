var semver = require('semver');

var upstreamTransformer = null;

var reactNativeVersionString = require('react-native/package.json').version;
var reactNativeMinorVersion = semver(reactNativeVersionString).minor;
var reactVueTemplateParser = require('./compiler');

if (reactNativeMinorVersion >= 52) {
  upstreamTransformer = require('metro/src/transformer');
} else if (reactNativeMinorVersion >= 47) {
  upstreamTransformer = require('metro-bundler/src/transformer');
} else if (reactNativeMinorVersion === 46) {
  upstreamTransformer = require('metro-bundler/build/transformer');
} else {
  // handle RN <= 0.45
  var oldUpstreamTransformer = require('react-native/packager/transformer');
  upstreamTransformer = {
    transform({ src, filename, options }) {
      return oldUpstreamTransformer.transform(src, filename, options);
    }
  };
}

function transform(src, filename, options) {
  if (typeof src === 'object') {
    // handle RN >= 0.46
    ({ src, filename, options } = src);
  }
  const outputFile = reactVueTemplateParser(src);

  return upstreamTransformer.transform({
    src: outputFile,
    filename,
    options
  });
}

module.exports = transform;
