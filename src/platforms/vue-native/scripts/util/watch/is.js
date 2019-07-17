var fs = require('fs');
var path = require('path');

var is = {
  nil: function(item) {
    return (item === null) || (item === undefined);
  },
  array: function(item) {
    return Array.isArray(item);
  },
  buffer: function(item) {
    return Buffer.isBuffer(item);
  },
  regExp: function(item) {
    return Object.prototype.toString.call(item) == '[object RegExp]';
  },
  string: function(item) {
    return typeof item === 'string';
  },
  func: function(item) {
    return typeof item === 'function';
  },
  exists: function(name) {
    return fs.existsSync(name);
  },
  file: function(name) {
    return is.exists(name)
      ? fs.statSync(name).isFile() : false;
  },
  sameFile: function(a, b) {
    return path.resolve(a) == path.resolve(b);
  },
  directory: function(name) {
    return is.exists(name)
      ? fs.statSync(name).isDirectory() : false;
  },
  symbolicLink: function(name) {
    return is.exists(name)
      ? fs.lstatSync(name).isSymbolicLink() : false;
  }
};

module.exports = is;
