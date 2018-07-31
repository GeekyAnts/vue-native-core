var semver = require('semver');

var upstreamTransformer = null;

var reactNativeVersionString = require('react-native/package.json').version;
var reactNativeMinorVersion = semver(reactNativeVersionString).minor;
var reactVueTemplateParser = require('./compiler');
const traverse = require('babel-traverse');
const { SourceMapConsumer } = require('source-map');

if (reactNativeMinorVersion >= 56) {
  upstreamTransformer = require('metro/src/reactNativeTransformer');
} else if (reactNativeMinorVersion >= 52) {
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

function sourceMapAstInPlace(tsMap, babelAst) {
  const tsConsumer = new SourceMapConsumer(tsMap);
  traverse.default.cheap(babelAst, node => {
    if (node.loc) {
      const originalStart = tsConsumer.originalPositionFor(node.loc.start);
      if (originalStart.line) {
        node.loc.start.line = originalStart.line;
        node.loc.start.column = originalStart.column;
      }
      const originalEnd = tsConsumer.originalPositionFor(node.loc.end);
      if (originalEnd.line) {
        node.loc.end.line = originalEnd.line;
        node.loc.end.column = originalEnd.column;
      }
    }
  });
}

function transform({ src, filename, options }) {
  if (typeof src === 'object') {
    // handle RN >= 0.46
    ({ src, filename, options } = src);
  }
  const outputFile = reactVueTemplateParser(src);

  if (!outputFile.output) {
    return upstreamTransformer.transform({
      src: outputFile,
      filename,
      options
    });
  } else {
    // Source Map support
    const babelCompileResult = upstreamTransformer.transform({
      src: outputFile.output,
      filename,
      options
    });
    if (outputFile.mappings) {
      sourceMapAstInPlace(outputFile.mappings, babelCompileResult.ast);
    }
    return babelCompileResult;
  }
}

module.exports = transform;
