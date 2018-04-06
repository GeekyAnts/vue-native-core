const fs = require('fs');
const compiler = require('vue-native-template-compiler');
const cssParse = require('css-parse');
const beautify = require('js-beautify').js_beautify;
const constants = require('../util/constants');
const addvm = require('../util/addvm');
const parseCss = require('../util/parseCss');

// the watch reference node-watch, there may be some changes in the future
const watch = require('../util/watch');

const walk = require('../util/walk');

const FILTER = /\.vue$/;

const DEFAULT_OUTPUT = {
  template: {
    import: `import { Component as ${constants.COMPONENT} } from 'react'`,
    render: `const ${constants.TEMPLATE_RENDER} = () => null`
  },
  script: `const ${constants.SCRIPT_OPTIONS} = {}`
};

walk('./', {
  filter:  FILTER
}, function (name) {
  action(name);
});

watch('./', {
  recursive: true,
  filter:  FILTER
}, function (evt, name) {
  if (evt === 'update') {
    action(name);
  } else if (evt === 'remove') {
    remove(name);
  }
});

function action (name) {
  fs.readFile(name, function (err, resource) {
    if (err) {
      throw err;
    } else {
      const code = resource.toString();
      const cparsed = compiler.parseComponent(code, { pad: 'line' });

      // console.log(cparsed);
      
      let output = '';

      // add react-vue import
      output += `import ${constants.VUE}, { observer as ${constants.OBSERVER} } from 'react-vue'`;
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
      output += `import { buildNativeComponent as ${constants.BUILD_COMPONENT} } from 'react-vue-helper'`;
      output += '\n';

      // parse template
      const template = cparsed.template;
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
      }
      
      // add vue options
      output += scriptParsed;
      output += '\n\n';

      // add render funtion
      output += addvm(templateParsed.render);
      output += '\n\n';

      // parse css
      const styles = cparsed.styles;
      let cssParsed = {};
      styles.forEach(function(v) {
        const cssAst = cssParse(v.content);
        cssParsed = Object.assign({}, cssParsed, parseCss(cssAst));
      });

      // add css obj
      output += `const ${constants.CSS} = ${JSON.stringify(cssParsed)}`;
      output += '\n\n';

      // add builder
      output += `const ${constants.COMPONENT_BUILDED} = ${constants.BUILD_COMPONENT}(${constants.TEMPLATE_RENDER}, ${constants.SCRIPT_OPTIONS}, {Component: ${
        constants.COMPONENT
      }, PropTypes: ${
        constants.PROP_TYPE
      }, Vue: ${
        constants.VUE
      }, ReactNative: ${
        constants.REACT_NATIVE
      }, css: ${
        constants.CSS
      }})`;
      output += '\n\n';

      // export default
      output += `export default ${constants.OBSERVER}(${constants.COMPONENT_BUILDED})`;

      // beautiful
      output = beautify(output, { 'indent_size': 2 });

      fs.writeFile(name.replace(FILTER, '.js'), output, function (err) {
        if (err) {
          throw err;
        }
      });
    }
  });
}

function remove (name) {
  fs.unlink(name.replace(FILTER, '.js'), function (err) {
    if (err) {
      throw err;
    }
  });
}

function parseTemplate (code) {
  const obj = compiler.nativeCompiler(code);
  return {
    import: obj.importCode,
    render: `const ${constants.TEMPLATE_RENDER} = ${obj.renderCode}`
  };
}

function parseScript (code) {
  const s = `const ${constants.SCRIPT_OPTIONS} = `;
  code = code
    .replace(/[\s;]*module.exports[\s]*=/, `\n${s}`)
    .replace(/[\s;]*export[\s]+default[\s]*\{/, `\n${s} {`);
  return code;
}
