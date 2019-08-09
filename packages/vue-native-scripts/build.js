'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var compiler = require('vue-native-template-compiler');
var cssParse = _interopDefault(require('css-parse'));
var jsBeautify = require('js-beautify');
var sourceMap = require('source-map');
var sourceMap__default = _interopDefault(sourceMap);
var hash$1 = _interopDefault(require('hash-sum'));
var path = _interopDefault(require('path'));
var lineNumber = _interopDefault(require('line-number'));
var parse5 = _interopDefault(require('parse5'));
var babelCore = require('babel-core');
var semver = _interopDefault(require('semver'));
var traverse$1 = _interopDefault(require('babel-traverse'));
var package_json = require('react-native/package.json');

var HELPER_HEADER = '__react__vue__';
var SCRIPT_OPTIONS = HELPER_HEADER + "options";
var TEMPLATE_RENDER = HELPER_HEADER + "render";
var REACT_NATIVE = HELPER_HEADER + "ReactNative";  
var BUILD_COMPONENT = HELPER_HEADER + "buildNativeComponent";
var COMPONENT_BUILDED = HELPER_HEADER + "ComponentBuilded";
var VUE = HELPER_HEADER + "Vue";
var REACT = HELPER_HEADER + "React";  
var COMPONENT = HELPER_HEADER + "Component";
var PROP_TYPE = HELPER_HEADER + "PropType";
var OBSERVER = HELPER_HEADER + "observer";
var CSS = HELPER_HEADER + "css";

var constants = {
  HELPER_HEADER: HELPER_HEADER,
  SCRIPT_OPTIONS: SCRIPT_OPTIONS,
  TEMPLATE_RENDER: TEMPLATE_RENDER,
  REACT_NATIVE: REACT_NATIVE,
  BUILD_COMPONENT: BUILD_COMPONENT,
  COMPONENT_BUILDED: COMPONENT_BUILDED,
  VUE: VUE,
  REACT: REACT,
  COMPONENT: COMPONENT,
  PROP_TYPE: PROP_TYPE,
  OBSERVER: OBSERVER,
  CSS: CSS
};

var names = 'Infinity,undefined,NaN,isFinite,isNaN,console,' +
  'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
  'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
  'require,' + // for webpack
  'arguments'; // parsed as identifier but is a special keyword...

var hash = Object.create(null);
names.split(',').forEach(function (name) {
  hash[name] = true;
});

function addvm (code) {
  var r = babelCore.transform(code, {
    plugins: [function (ref) {
      var t = ref.types;

      return {
        visitor: {
          Identifier: function (path) {
            if (path.parent.type === 'ObjectProperty' && path.parent.key === path.node) { return; }
            if (t.isDeclaration(path.parent.type) && path.parent.id === path.node) { return; }
            if (t.isFunction(path.parent.type) && path.parent.params.indexOf(path.node) > -1) { return; }
            if (path.parent.type === 'Property' && path.parent.key === path.node && !path.parent.computed) { return; }
            if (path.parent.type === 'MemberExpression' && path.parent.property === path.node && !path.parent.computed) { return; }
            if (path.parent.type === 'ArrayPattern') { return; }
            if (path.parent.type === 'ImportSpecifier') { return; }
            if (path.scope.hasBinding(path.node.name)) { return; }
            if (hash[path.node.name]) { return; }
            if (path.node.name.indexOf(constants.HELPER_HEADER) === 0) { return; }
            path.node.name = "vm['" + (path.node.name) + "']";
          }
        }
      };
    }]
  });
  return r.code;
}

var TRANSFORM_TRANSLATE_REGEX = /translate\(([-+]?[\d]*\.?[\d]+)(px)?,[\s]+([-+]?[\d]*\.?[\d]+)(px)?\)/;
var TRANSFORM_TRANSLATE_X_REGEX = /translateX\(([-+]?[\d]*\.?[\d]+)(px)?\)/;
var TRANSFORM_TRANSLATE_Y_REGEX = /translateY\(([-+]?[\d]*\.?[\d]+)(px)?\)/;
var TRANSFORM_ROTATE_REGEX = /rotate\(([-+]?[\d]*\.?[\d]+)deg\)/;
var TRANSFORM_ROTATE_X_REGEX = /rotateX\(([-+]?[\d]*\.?[\d]+)deg\)/;
var TRANSFORM_ROTATE_Y_REGEX = /rotateY\(([-+]?[\d]*\.?[\d]+)deg\)/;
var TRANSFORM_ROTATE_Z_REGEX = /rotateZ\(([-+]?[\d]*\.?[\d]+)deg\)/;
var TRANSFORM_SCALE_REGEX = /scale\(([-+]?[\d]*\.?[\d]+)\)/;
var TRANSFORM_SCALE_X_REGEX = /scaleX\(([-+]?[\d]*\.?[\d]+)\)/;
var TRANSFORM_SCALE_Y_REGEX = /scaleY\(([-+]?[\d]*\.?[\d]+)\)/;
var TRANSFORM_SKEW_X_REGEX = /skewX\(([-+]?[\d]*\.?[\d]+)deg\)/;
var TRANSFORM_SKEW_Y_REGEX = /skewY\(([-+]?[\d]*\.?[\d]+)deg\)/;

function parseTransform(value) {
  var arr = [];
  if (TRANSFORM_ROTATE_REGEX.test(value)) {
    arr.push({
      rotate: ((value.match(TRANSFORM_ROTATE_REGEX)[1]) + "deg")
    });
  }
  if (TRANSFORM_ROTATE_X_REGEX.test(value)) {
    arr.push({
      rotateX: ((value.match(TRANSFORM_ROTATE_X_REGEX)[1]) + "deg")
    });
  }
  if (TRANSFORM_ROTATE_Y_REGEX.test(value)) {
    arr.push({
      rotateY: ((value.match(TRANSFORM_ROTATE_Y_REGEX)[1]) + "deg")
    });
  }
  if (TRANSFORM_ROTATE_Z_REGEX.test(value)) {
    arr.push({
      rotateZ: ((value.match(TRANSFORM_ROTATE_Z_REGEX)[1]) + "deg")
    });
  }
  if (TRANSFORM_SKEW_X_REGEX.test(value)) {
    arr.push({
      skewX: ((value.match(TRANSFORM_SKEW_X_REGEX)[1]) + "deg")
    });
  }
  if (TRANSFORM_SKEW_Y_REGEX.test(value)) {
    arr.push({
      skewY: ((value.match(TRANSFORM_SKEW_Y_REGEX)[1]) + "deg")
    });
  }
  if (TRANSFORM_SCALE_REGEX.test(value)) {
    var r = value.match(TRANSFORM_SCALE_REGEX)[1];
    if (isNaN(r) === false) {
      r = parseFloat(r);
    }
    arr.push({
      scale: r
    });
  }
  if (TRANSFORM_SCALE_X_REGEX.test(value)) {
    var r$1 = value.match(TRANSFORM_SCALE_X_REGEX)[1];
    if (isNaN(r$1) === false) {
      r$1 = parseFloat(r$1);
    }
    arr.push({
      scaleX: r$1
    });
  }
  if (TRANSFORM_SCALE_Y_REGEX.test(value)) {
    var r$2 = value.match(TRANSFORM_SCALE_Y_REGEX)[1];
    if (isNaN(r$2) === false) {
      r$2 = parseFloat(r$2);
    }
    arr.push({
      scaleY: r$2
    });
  }
  if (TRANSFORM_TRANSLATE_REGEX.test(value)) {
    var rs = value.match(TRANSFORM_TRANSLATE_REGEX);
    var rx = rs[1];
    var ry = rs[2];
    if (isNaN(rx) === false) {
      rx = parseFloat(rx);
    }
    if (isNaN(ry) === false) {
      ry = parseFloat(ry);
    }
    arr.push({
      translateX: rx
    });
    arr.push({
      translateY: ry
    });
  }
  if (TRANSFORM_TRANSLATE_X_REGEX.test(value)) {
    var r$3 = value.match(TRANSFORM_TRANSLATE_X_REGEX)[1];
    if (isNaN(r$3) === false) {
      r$3 = parseFloat(r$3);
    }
    arr.push({
      translateX: r$3
    });
  }
  if (TRANSFORM_TRANSLATE_Y_REGEX.test(value)) {
    var r$4 = value.match(TRANSFORM_TRANSLATE_Y_REGEX)[1];
    if (isNaN(r$4) === false) {
      r$4 = parseFloat(r$4);
    }
    arr.push({
      translateY: r$4
    });
  }
  return arr;
}

var camelizeRE = /-(\w)/g;

function camelize(str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
}

function parseDeclarations(declarations) {
  var declarationObj = {};

  // Comments and @media blocks don't have declarations at the top level.
  if (declarations) {
    declarations.forEach(function (declaration) {
      if (declaration.type === 'declaration') {
        var value = declaration.value;
        if (/px$/.test(value)) {
          value = parseFloat(value.replace(/px$/, ''));
        } else if (declaration.property !== 'font-weight' &&  isNaN(value) === false){
          value = parseFloat(value);
        }
        if (declaration.property === 'transform') {
          value = parseTransform(value);
        }
        declarationObj[camelize(declaration.property)] = value;
      }
    });
  }

  return declarationObj;
}

function parseCss(ast) {
  var obj = {};
  if (ast.type === 'stylesheet') {
    ast.stylesheet.rules.forEach(function (rule) {
      var declarationObj = parseDeclarations(rule.declarations);
      if (rule.selectors) {
        rule.selectors.forEach(function (selector) {
          if (selector.indexOf('.') === 0) {
            obj[selector.replace(/^\./, '')] = declarationObj;
          }
        });
      }
    });
  }
  return obj;
}

// const fs = require('fs');

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
  var beautifiedRender = jsBeautify.js_beautify(addvm(templateParsed.render));
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
  var hashedFilename = path.basename(filePath) + '?' + hash$1(filePath + content);
  var map = new sourceMap__default.SourceMapGenerator();
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

// const reactNativeVersionString = require('react-native/package.json').version;
var reactNativeMinorVersion = semver(package_json.version).minor;

var upstreamTransformer = null;
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
  return sourceMap.SourceMapConsumer.with(
    tsMap,
    null,
    function (consumer) {
      traverse$1.cheap(babelAst, function (node) {
        if (node.loc) {
          var originalStart = consumer.originalPositionFor(node.loc.start);
          if (originalStart.line) {
            node.loc.start.line = originalStart.line;
            node.loc.start.column = originalStart.column;
          }
          var originalEnd = consumer.originalPositionFor(node.loc.end);
          if (originalEnd.line) {
            node.loc.end.line = originalEnd.line;
            node.loc.end.column = originalEnd.column;
          }
        }
      });
    }
  );
}

function transform(ref) {
  var assign;

  var src = ref.src;
  var filename = ref.filename;
  var options = ref.options;
  if (typeof src === 'object') {
    // handle RN >= 0.46
    ((assign = src, src = assign.src, filename = assign.filename, options = assign.options));
  }
  var outputFile = compileVueToRn(src);

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
