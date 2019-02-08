// const fs = require('fs');
const compiler = require('vue-native-template-compiler');
const cssParse = require('css-parse');
const beautify = require('js-beautify').js_beautify;
const constants = require('../util/constants');
const addvm = require('../util/addvm');
const parseCss = require('../util/parseCss');
var sourceMap = require('source-map');
var hash = require('hash-sum');
var path = require('path');
var lineNumber = require('line-number');
const parse5 = require('parse5');
const filePath = 'test.js';
var splitRE = /\r?\n/g;

// the watch reference node-watch, there may be some changes in the future
// const watch = require('../util/watch');

// const walk = require('../util/walk');

// const FILTER = /\.vue$/;

const DEFAULT_OUTPUT = {
  template: {
    import: `import { Component as ${constants.COMPONENT} } from 'react'`,
    render: `const ${constants.TEMPLATE_RENDER} = () => null`
  },
  script: `const ${constants.SCRIPT_OPTIONS} = {}`
};

// walk('./', {
//   filter:  FILTER
// }, function (name) {
//   compileVueToRn(name);
// });

// watch('./', {
//   recursive: true,
//   filter:  FILTER
// }, function (evt, name) {
//   if (evt === 'update') {
//     compileVueToRn(name);
//   } else if (evt === 'remove') {
//     remove(name);
//   }
// });

function compileVueToRn(resource) {
  const code = resource.toString();
  const cparsed = compiler.parseComponent(code, { pad: 'line' });

  // console.log(cparsed);

  let output = '';
  let mappings = '';

  // add react-vue import
  output += `import ${constants.VUE}, { observer as ${
    constants.OBSERVER
    } } from 'vue-native-core'`;
  output += '\n';

  // // add react import
  // output += `import ${constants.REACT} from 'react'`
  // output += '\n';

  // add react-native import
  output += `import ${constants.REACT_NATIVE} from 'react-native'`;
  output += '\n';

  // add prop-type import
  output += `import ${constants.PROP_TYPE} from 'prop-types'`;
  output += '\n';

  // add component builder import
  output += `import { buildNativeComponent as ${
    constants.BUILD_COMPONENT
    } } from 'vue-native-helper'`;
  output += '\n';

  // parse template
  const template = cparsed.template;

  //Consider the start of template for debugging
  //
  let templateStartIndex = code.indexOf("<");
  let tempStringBeforeStart = code.substring(0, templateStartIndex);
  let templateLineNumber = tempStringBeforeStart.split(splitRE).length - 1;

  // Get tags and location of tags from template
  //
  let nodes = [];
  const templateFragments = parse5.parseFragment(cparsed.template.content, { sourceCodeLocationInfo: true });
  if (templateFragments.childNodes) {
    traverse(templateFragments, nodes);
  }


  let templateParsed = DEFAULT_OUTPUT.template;
  if (template) {
    const templateContent = template.content.replace(/\/\/\n/g, '').trim();
    if (templateContent) {
      templateParsed = parseTemplate(templateContent);
    }
  }

  // add render dep import
  output += templateParsed.import;
  output += '\n';

  // parse script
  const script = cparsed.script;
  let scriptParsed = DEFAULT_OUTPUT.script;
  if (script) {
    const scriptContent = script.content.replace(/\/\/\n/g, '').trim();
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
  let beautifiedRender = beautify(addvm(templateParsed.render, { indent_size: 2 }));
  output += beautifiedRender;
  output += '\n\n';

  // Get last line of render code
  //
  let renderEndLine = beautifiedRender.split(splitRE).length - 1;

  // Search Elements and postion based on render function
  //
  var reactVueElementRegex = /__react__vue__createElement/;
  let foundLines = lineNumber(beautifiedRender, reactVueElementRegex);
  if (mappings) {
    foundLines.forEach((line, index) => {
      let renderJsLine = endLines + line.number;
      if (foundLines[index + 1]) {
        for (let i = line.number; i < foundLines[index + 1].number; i++) {
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
        for (let i = line.number; i < renderEndLine; i++) {
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
  const styles = cparsed.styles;
  let cssParsed = {};
  styles.forEach(function (v) {
    const cssAst = cssParse(v.content);
    cssParsed = Object.assign({}, cssParsed, parseCss(cssAst));
  });

  // add css obj
  output += `const ${constants.CSS} = ${JSON.stringify(cssParsed)}`;
  output += '\n\n';

  // add builder
  output += `const ${constants.COMPONENT_BUILDED} = ${
    constants.BUILD_COMPONENT
    }(${constants.TEMPLATE_RENDER}, ${constants.SCRIPT_OPTIONS}, {Component: ${
    constants.COMPONENT
    }, PropTypes: ${constants.PROP_TYPE}, Vue: ${constants.VUE}, ReactNative: ${
    constants.REACT_NATIVE
    }, css: ${constants.CSS}})`;
  output += '\n\n';

  // export default
  output += `export default ${constants.OBSERVER}(${
    constants.COMPONENT_BUILDED
    })`;

  // beautiful
  // output = beautify(output, { indent_size: 2 });
  return { output, mappings: mappings ? mappings.toJSON() : null };

  // fs.writeFile(name.replace(FILTER, '.js'), output, function(err) {
  //   if (err) {
  //     throw err;
  //   }
  // });
}

// function remove(name) {
//   fs.unlink(name.replace(FILTER, '.js'), function(err) {
//     if (err) {
//       throw err;
//     }
//   });
// }

function parseTemplate(code) {
  const obj = compiler.nativeCompiler(code);
  return {
    import: obj.importCode,
    render: `const ${constants.TEMPLATE_RENDER} = ${obj.renderCode}`
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
  const s = `const ${constants.SCRIPT_OPTIONS} = `;
  code = code
    .replace(/[\s;]*module.exports[\s]*=/, `\n${s}`)
    .replace(/[\s;]*export[\s]+default[\s]*\{/, `\n${s} {`);
  return code;
}

function traverse(ast, nodes = []) {
  if (ast.tagName) {
    nodes.push(ast.sourceCodeLocation);
  }
  if (ast.childNodes) {
    ast.childNodes.forEach((child) => {
      traverse(child, nodes);
    });
  }
}

module.exports = compileVueToRn;
