'use strict';

// const fs = require('fs');
var compiler = require('vue-native-template-compiler');
var cssParse = require('css-parse');
var beautify = require('js-beautify').js_beautify;
var constants = require('./util/constants');
var addvm = require('./util/addvm');
var parseCss = require('./util/parseCss');
var sourceMap = require('source-map');
var hash = require('hash-sum');
var path = require('path');
var lineNumber = require('line-number');
var parse5 = require('parse5');
var filePath = 'test.js';
var splitRE = /\r?\n/g;

var DEFAULT_OUTPUT = {
  template: {
    import: ("import { Component as " + (constants.COMPONENT) + " } from 'react'"),
    render: ("const " + (constants.TEMPLATE_RENDER) + " = () => null")
  },
  script: ("const " + (constants.SCRIPT_OPTIONS) + " = {}")
};

function compileVueToRn(resource) {
  var code = resource.toString();
  var cparsed = compiler.parseComponent(code, { pad: 'line' });

  var output = '';
  var mappings = '';

  // add react-vue import
  output += "import " + (constants.VUE) + ", { observer as " + (constants.OBSERVER) + " } from 'vue-native-core'";
  output += '\n';

  // // add react import
  // output += `import ${constants.REACT} from 'react'`
  // output += '\n';

  // add react-native import
  output += "import " + (constants.REACT_NATIVE) + " from 'react-native'";
  output += '\n';

  // add prop-type import
  output += "import " + (constants.PROP_TYPE) + " from 'prop-types'";
  output += '\n';

  // add component builder import
  output += "import { buildNativeComponent as " + (constants.BUILD_COMPONENT) + " } from 'vue-native-helper'";
  output += '\n';

  // parse template
  var template = cparsed.template;

  //Consider the start of template for debugging
  //
  var templateStartIndex = code.indexOf("<");
  var tempStringBeforeStart = code.substring(0, templateStartIndex);
  var templateLineNumber = tempStringBeforeStart.split(splitRE).length - 1;

  // Get tags and location of tags from template
  //
  var nodes = [];
  var templateFragments = parse5.parseFragment(cparsed.template.content, { sourceCodeLocationInfo: true });
  if (templateFragments.childNodes) {
    traverse(templateFragments, nodes);
  }


  var templateParsed = DEFAULT_OUTPUT.template;
  if (template) {
    var templateContent = template.content.replace(/\/\/\n/g, '').trim();
    if (templateContent) {
      templateParsed = parseTemplate(templateContent);
    }
  }

  // add render dep import
  output += templateParsed.import;
  output += '\n';

  // parse script
  var script = cparsed.script;
  var scriptParsed = DEFAULT_OUTPUT.script;
  if (script) {
    var scriptContent = script.content.replace(/\/\/\n/g, '').trim();
    scriptParsed = parseScript(scriptContent);
    mappings = generateSourceMap(code);
  }

  if (mappings) {
    // Start of the script content
    //
    var beforeLines = output.split(splitRE).length;
    // Start of the script content of the original code
    //
    var scriptLine = code.slice(0, cparsed.script.start).split(splitRE).length + 1;
    var exportDefaultIndex = code.indexOf('export default');
    var tempString = code.substring(0, exportDefaultIndex);
    var exportDefaultLineNumber = tempString.split('\n').length;
  }

  // add vue options
  output += scriptParsed;
  output += '\n\n';

  var endLines = output.split(splitRE).length - 1;
  for (; scriptLine < endLines; scriptLine++) {
    //Skip export default line
    if (scriptLine !== exportDefaultLineNumber) {
      mappings.addMapping({
        source: mappings._hashedFilename,
        generated: {
          line: beforeLines,
          column: 0
        },
        original: {
          line: scriptLine,
          column: 0
        }
      });
    }
    beforeLines++;
  }

  // add render funtion
  var beautifiedRender = beautify(addvm(templateParsed.render, { indent_size: 2 }));
  output += beautifiedRender;
  output += '\n\n';

  // Get last line of render code
  //
  var renderEndLine = beautifiedRender.split(splitRE).length - 1;

  // Search Elements and postion based on render function
  //
  var reactVueElementRegex = /__react__vue__createElement/;
  var foundLines = lineNumber(beautifiedRender, reactVueElementRegex);
  if (mappings) {
    foundLines.forEach(function (line, index) {
      var renderJsLine = endLines + line.number;
      if (foundLines[index + 1]) {
        for (var i = line.number; i < foundLines[index + 1].number; i++) {
          // Add Mapping
          if (nodes[index]) {
            mappings.addMapping({
              source: mappings._hashedFilename,
              generated: {
                line: renderJsLine++,
                column: 0
              },
              original: {
                line: nodes[index].startTag.startLine + templateLineNumber,
                column: 0
              }
            });
          }
        }
      } else if (nodes[index] && nodes[index].startTag) {
        // Last Line
        for (var i$1 = line.number; i$1 < renderEndLine; i$1++) {
          // Add Mapping
          mappings.addMapping({
            source: mappings._hashedFilename,
            generated: {
              line: renderJsLine++,
              column: 0
            },
            original: {
              line: nodes[index].startTag.startLine + templateLineNumber,
              column: 0
            }
          });
        }
      }
    });
  }

  // parse css
  var styles = cparsed.styles;
  var cssParsed = {};
  styles.forEach(function (v) {
    var cssAst = cssParse(v.content);
    cssParsed = Object.assign({}, cssParsed, parseCss(cssAst));
  });

  // add css obj
  output += "const " + (constants.CSS) + " = " + (JSON.stringify(cssParsed));
  output += '\n\n';

  // add builder
  output += "const " + (constants.COMPONENT_BUILDED) + " = " + (constants.BUILD_COMPONENT) + "(" + (constants.TEMPLATE_RENDER) + ", " + (constants.SCRIPT_OPTIONS) + ", {Component: " + (constants.COMPONENT) + ", PropTypes: " + (constants.PROP_TYPE) + ", Vue: " + (constants.VUE) + ", ReactNative: " + (constants.REACT_NATIVE) + ", css: " + (constants.CSS) + "})";
  output += '\n\n';

  // export default
  output += "export default " + (constants.OBSERVER) + "(" + (constants.COMPONENT_BUILDED) + ")";

  // beautiful
  // output = beautify(output, { indent_size: 2 });
  return { output: output, mappings: mappings ? mappings.toJSON() : null };
}

// function remove(name) {
//   fs.unlink(name.replace(FILTER, '.js'), function(err) {
//     if (err) {
//       throw err;
//     }
//   });
// }

function parseTemplate(code) {
  var obj = compiler.nativeCompiler(code);
  return {
    import: obj.importCode,
    render: ("const " + (constants.TEMPLATE_RENDER) + " = " + (obj.renderCode))
  };
}

function generateSourceMap(content) {
  // hot-reload source map busting
  var hashedFilename = path.basename(filePath) + '?' + hash(filePath + content);
  var map = new sourceMap.SourceMapGenerator();
  map.setSourceContent(hashedFilename, content);
  map._hashedFilename = hashedFilename;
  return map;
}

function parseScript(code) {
  var s = "const " + (constants.SCRIPT_OPTIONS) + " = ";
  code = code
    .replace(/[\s;]*module.exports[\s]*=/, ("\n" + s))
    .replace(/[\s;]*export[\s]+default[\s]*\{/, ("\n" + s + " {"));
  return code;
}

function traverse(ast, nodes) {
  if ( nodes === void 0 ) nodes = [];

  if (ast.tagName) {
    nodes.push(ast.sourceCodeLocation);
  }
  if (ast.childNodes) {
    ast.childNodes.forEach(function (child) {
      traverse(child, nodes);
    });
  }
}

var semver = require('semver');

var upstreamTransformer = null;

var reactNativeVersionString = require('react-native/package.json').version;
var reactNativeMinorVersion = semver(reactNativeVersionString).minor;
var reactVueTemplateParser = require('./compiler');
var traverse$1 = require('babel-traverse');
var ref = require('source-map');
var SourceMapConsumer = ref.SourceMapConsumer;

if (reactNativeMinorVersion >= 59) {
  upstreamTransformer = require("metro-react-native-babel-transformer");
} else if (reactNativeMinorVersion >= 56) {
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
    transform: function transform(ref) {
      var src = ref.src;
      var filename = ref.filename;
      var options = ref.options;

      return oldUpstreamTransformer.transform(src, filename, options);
    }
  };
}

function sourceMapAstInPlace(tsMap, babelAst) {
  var tsConsumer = new SourceMapConsumer(tsMap);
  traverse$1.default.cheap(babelAst, function (node) {
    if (node.loc) {
      var originalStart = tsConsumer.originalPositionFor(node.loc.start);
      if (originalStart.line) {
        node.loc.start.line = originalStart.line;
        node.loc.start.column = originalStart.column;
      }
      var originalEnd = tsConsumer.originalPositionFor(node.loc.end);
      if (originalEnd.line) {
        node.loc.end.line = originalEnd.line;
        node.loc.end.column = originalEnd.column;
      }
    }
  });
}

function transform(ref) {
  var src = ref.src;
  var filename = ref.filename;
  var options = ref.options;

  if (typeof src === 'object') {
    // handle RN >= 0.46
    var assign;
    ((assign = src, src = assign.src, filename = assign.filename, options = assign.options));
  }
  var outputFile = reactVueTemplateParser(src);

  if (!outputFile.output) {
    return upstreamTransformer.transform({
      src: outputFile,
      filename: filename,
      options: options
    });
  } else {
    // Source Map support
    var babelCompileResult = upstreamTransformer.transform({
      src: outputFile.output,
      filename: filename,
      options: options
    });
    if (outputFile.mappings) {
      sourceMapAstInPlace(outputFile.mappings, babelCompileResult.ast);
    }
    return babelCompileResult;
  }
}

var index = {
  compileVueToRn: compileVueToRn,
  transform: transform,
};

module.exports = index;
