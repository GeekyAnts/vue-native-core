const babel = require('babel-core');
const constants = require('./constants');

const names = 'Infinity,undefined,NaN,isFinite,isNaN,console,' +
  'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
  'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
  'require,' + // for webpack
  'arguments'; // parsed as identifier but is a special keyword...

const hash = Object.create(null);
names.split(',').forEach(function (name) {
  hash[name] = true;
});

function addvm (code) {
  const r = babel.transform(code, {
    plugins: [function ({ types: t }) {
      return {
        visitor: {
          Identifier: function (path) {
            if (path.parent.type === 'ObjectProperty' && path.parent.key === path.node) return;
            if (t.isDeclaration(path.parent.type) && path.parent.id === path.node) return;
            if (t.isFunction(path.parent.type) && path.parent.params.indexOf(path.node) > -1) return;
            if (path.parent.type === 'Property' && path.parent.key === path.node && !path.parent.computed) return;
            if (path.parent.type === 'MemberExpression' && path.parent.property === path.node && !path.parent.computed) return;
            if (path.parent.type === 'ArrayPattern') return;
            if (path.parent.type === 'ImportSpecifier') return;
            if (path.scope.hasBinding(path.node.name)) return;
            if (hash[path.node.name]) return;
            if (path.node.name.indexOf(constants.HELPER_HEADER) === 0) return;
            path.node.name = `vm['${path.node.name}']`;
          }
        }
      };
    }]
  });
  return r.code;
}

module.exports = addvm;
