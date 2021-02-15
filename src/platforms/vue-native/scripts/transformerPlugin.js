import semver from 'semver'
import traverse from 'babel-traverse'
import { SourceMapConsumer } from 'source-map'

import { compileVueToRn as reactVueTemplateParser } from './compiler'
import { version as reactNativeVersionString } from 'react-native/package.json'

// const reactNativeVersionString = require('react-native/package.json').version;
const reactNativeMinorVersion = semver(reactNativeVersionString).minor

let upstreamTransformer = null
if (reactNativeMinorVersion >= 59) {
  upstreamTransformer = require('metro-react-native-babel-transformer')
} else if (reactNativeMinorVersion >= 56) {
  upstreamTransformer = require('metro/src/reactNativeTransformer')
} else if (reactNativeMinorVersion >= 52) {
  upstreamTransformer = require('metro/src/transformer')
} else if (reactNativeMinorVersion >= 47) {
  upstreamTransformer = require('metro-bundler/src/transformer')
} else if (reactNativeMinorVersion === 46) {
  upstreamTransformer = require('metro-bundler/build/transformer')
} else {
  // handle RN <= 0.45
  var oldUpstreamTransformer = require('react-native/packager/transformer')
  upstreamTransformer = {
    transform({ src, filename, options }) {
      return oldUpstreamTransformer.transform(src, filename, options)
    },
  }
}

function sourceMapAstInPlace(sourceMap, babelAst) {
  const consumer = new SourceMapConsumer(sourceMap)

  traverse.cheap(babelAst, node => {
    if (node.loc) {
      const originalStart = consumer.originalPositionFor(node.loc.start)
      // Removed the column mapping with original position as we have only mapped lines during generation
      if (originalStart.line) {
        node.loc.start.line = originalStart.line
        // node.loc.start.column = originalStart.column
      }
      const originalEnd = consumer.originalPositionFor(node.loc.end)
      if (originalEnd.line) {
        node.loc.end.line = originalEnd.line
        // node.loc.end.column = originalEnd.column
      }
    }
  })
}

export function transform({ src, filename, options }) {
  if (typeof src === 'object') {
    // handle RN >= 0.46
    ;({ src, filename, options } = src)
  }
  const outputFile = reactVueTemplateParser(src)

  if (!outputFile.output) {
    return upstreamTransformer.transform({
      src: outputFile,
      filename,
      options,
    })
  } else {
    // Source Map support
    const babelCompileResult = upstreamTransformer.transform({
      src: outputFile.output,
      filename,
      options,
    })
    if (outputFile.mappings) {
      sourceMapAstInPlace(outputFile.mappings, babelCompileResult.ast)
    }
    return babelCompileResult
  }
}
