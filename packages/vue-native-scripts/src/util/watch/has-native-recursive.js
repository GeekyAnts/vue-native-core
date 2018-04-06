var fs = require('fs');
var os = require('os');
var path = require('path');
var is = require('./is');

var IS_SUPPORT;
var TEMP_DIR = os.tmpdir && os.tmpdir()
  || process.env.TMPDIR
  || process.env.TEMP
  || process.cwd();

function TempStack() {
  this.stack = [];
}

TempStack.prototype = {
  create: function(type, base) {
    var name = path.join(base,
      'node-watch-' + Math.random().toString(16).substr(2)
    );
    this.stack.push({ name: name, type: type });
    return name;
  },
  write: function(/* file */) {
    for (var i = 0; i < arguments.length; ++i) {
      fs.writeFileSync(arguments[i], ' ');
    }
  },
  mkdir: function(/* dirs */) {
    for (var i = 0; i < arguments.length; ++i) {
      fs.mkdirSync(arguments[i]);
    }
  },
  cleanup: function(fn) {
    try {
      var temp;
      while (temp = this.stack.pop()) {
        var type = temp.type;
        var name = temp.name;
        if (type == 'file' && is.file(name)) {
          fs.unlinkSync(name);
        }
        else if (type == 'dir' && is.directory(name)) {
          fs.rmdirSync(name);
        }
      }
    }
    finally {
      if (is.func(fn)) fn();
    }
  }
};

var pending = false;

module.exports = function hasNativeRecursive(fn) {
  if (!is.func(fn)) {
    return false;
  }
  if (IS_SUPPORT !== undefined) {
    return fn(IS_SUPPORT);
  }

  if (!pending) {
    pending = true;
  }
  // check again later
  else {
    return setTimeout(function() {
      hasNativeRecursive(fn);
    }, 300);
  }

  var stack = new TempStack();
  var parent = stack.create('dir', TEMP_DIR);
  var child = stack.create('dir', parent);
  var file = stack.create('file', child);

  stack.mkdir(parent, child);

  var options = { recursive: true };
  var watcher = fs.watch(parent, options);
  var timer = setTimeout(function() {
    watcher.close();
    stack.cleanup(function() {
      fn(IS_SUPPORT = false);
    });
  }, 200);

  watcher.on('change', function(evt, name) {
    if (path.basename(file) == path.basename(name)) {
      watcher.close();
      clearTimeout(timer);
      stack.cleanup(function() {
        fn(IS_SUPPORT = true);
      });
    }
  });
  stack.write(file);
}
