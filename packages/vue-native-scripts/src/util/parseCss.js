const parseTransform = require('./parseTransform');

const camelizeRE = /-(\w)/g;

function camelize(str) {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
}

module.exports = function (ast) {
  const obj = {};
  if (ast.type === 'stylesheet') {
    ast.stylesheet.rules.forEach(function (rule) {
      const declarationObj = {};
      rule.declarations.forEach(function (declaration) {
        if (declaration.type === 'declaration') {
          let value = declaration.value;
          if (/px$/.test(value)) {
            value = parseFloat(value.replace(/px$/, ''));
          } else if (isNaN(value) === false){
            value = parseFloat(value);
          }
          if (declaration.property === 'transform') {
            value = parseTransform(value);
          }
          declarationObj[camelize(declaration.property)] = value;
        }
      });
      rule.selectors.forEach(function (selector) {
        if (selector.indexOf('.') === 0) {
          obj[selector.replace(/^\./, '')] = declarationObj;
        }
      });
    });
  }
  return obj;
};
