var fs   = require('fs');
var path = require('path');
var os = require('os');
var util = require('util');
var events = require('events');

var hasNativeRecursive = require('./has-native-recursive');
var is = require('./is');

var EVENT_UPDATE = 'update';
var EVENT_REMOVE = 'remove';

function makeArray(arr, offset) {
  return is.array(arr)
    ? arr : [].slice.call(arr, offset || 0);
}

function hasDup(arr) {
  return makeArray(arr).some(function(v, i, self) {
    return self.indexOf(v) !== i;
  });
}

function unique(arr) {
  return makeArray(arr).filter(function(v, i, self) {
    return self.indexOf(v) === i;
  });
}

function assign(obj/*, props */) {
  if (Object.assign) {
    return Object.assign.apply(Object, arguments);
  }
  return makeArray(arguments, 1)
    .reduce(function(mix, prop) {
      for (var name in prop) {
        if (prop.hasOwnProperty(name)) {
          mix[name] = prop[name];
        }
      }
      return mix;
    }, obj);
}

function guard(fn) {
  return function(arg, action) {
    if (is.func(fn)) {
      if (fn(arg)) action();
    }
    else if (is.regExp(fn)) {
      if (fn.test(arg)) action();
    }
    else {
      action();
    }
  }
}

function composeMessage(names) {
  return makeArray(names).map(function(n) {
    if (!is.exists(n)) return [EVENT_REMOVE, n];
    else return [EVENT_UPDATE, n];
  });
}

function getMessages(cache) {
  var dup = hasDup(cache.map(function(c) {
    return c.replace(/^[~#]+|[~#]+$/, '');
  }));

  // saving file from an editor maybe?
  if (dup) {
    var filtered = cache.filter(function(m) {
      return is.exists(m)
    });
    return composeMessage(unique(filtered));
  }
  else {
    return composeMessage(cache);
  }
}

function debounce(fn, delay) {
  var timer, cache = [];
  var info = fn.info;
  function handle() {
    getMessages(cache).forEach(function(msg) {
      if (info.options.encoding == 'buffer') {
        msg[1] = new Buffer(msg[1]);
      }
      fn.apply(null, msg);
    });
    timer = null;
    cache = [];
  }
  return function(evt, name) {
    if (is.buffer(name)) {
      name = name.toString()
    }
    if (is.nil(name)) {
      name = '';
    }
    cache.push(
      path.join(info.fpath, name)
    );
    if (!timer) {
      timer = setTimeout(handle, delay || 200);
    }
  }
}

function getSubDirectories(dir, fn) {
  if (is.directory(dir)) {
    fs.readdir(dir, function(err, all) {
      if (err) {
        // don't throw permission errors.
        if (!/^(EPERM|EACCES)$/.test(err.code)) throw err;
        else console.warn('Warning: Cannot access %s.', dir);
      }
      else if (is.array(all)) {
        all.forEach(function(f) {
          var sdir = path.join(dir, f);
          if (is.directory(sdir)) fn(sdir);
        });
      }
    });
  }
}

var deprecationWarning = util.deprecate(
  function() {},
  '(node-watch) First param in callback function\
  is replaced with event name since 0.5.0, use\
  `(evt, filename) => {}` if you want to get the filename'
);

function Watcher() {
  events.EventEmitter.call(this);
  this.watchers = {};
}

util.inherits(Watcher, events.EventEmitter);

Watcher.prototype.expose = function() {
  var self = this;
  var methods = [
    'on', 'emit', 'close', 'isClosed', 'listeners', 'once',
    'setMaxListeners', 'getMaxListeners'
  ];
  return methods.reduce(function(expose, name) {
    expose[name] = function() {
      return self[name].apply(self, arguments);
    }
    return expose;
  }, {});
}

Watcher.prototype.isClosed = function() {
  return !Object.keys(this.watchers).length
}

Watcher.prototype.close = function(fullPath) {
  var self = this;
  if (fullPath) {
    var watcher = this.watchers[fullPath];
    if (watcher && watcher.close) {
      watcher.close();
      delete self.watchers[fullPath];
    }
    getSubDirectories(fullPath, function(fpath) {
      self.close(fpath);
    });
  } else {
    var self = this;
    Object.keys(self.watchers).forEach(function(fpath) {
      var watcher = self.watchers[fpath];
      if (watcher && watcher.close) {
        watcher.close();
      }
    });
    this.watchers = {};
  }
};

Watcher.prototype.add = function(watcher, info) {
  var self = this;
  info = info || {};
  var fullPath = path.resolve(info.fpath);
  this.watchers[fullPath] = watcher;

  var callback = function(evt, name) {
    if (info.options.recursive) {
      hasNativeRecursive(function(has) {
        if (!has) {
          var fullPath = path.resolve(name);
          // remove watcher on removal
          if (evt == EVENT_REMOVE) {
            self.close(fullPath);
          }
          // watch new created directory
          else if (is.directory(name) && !self.watchers[fullPath]) {
            var filterGuard = guard(info.options.filter);
            filterGuard(name, function() {
              self.watchDirectory(name, info.options);
            });
          }
        }
      });
    }

    // watch single file
    if (info.compareName) {
      if (info.compareName(name)) {
        self.emit('change', evt, name);
      }
    }
    // watch directory
    else {
      var filterGuard = guard(info.options.filter);
      filterGuard(name, function() {
        if (self.flag) self.flag = '';
        else self.emit('change', evt, name);
      });
    }
  };

  callback.info = info;

  watcher.on('error', function(err) {
    if (os.platform() == 'win32' && err.code == 'EPERM') {
      watcher.emit('change', EVENT_REMOVE, info.fpath && '');
      self.flag = 'windows-error';
      self.close(fullPath);
    } else {
     self.emit('error', err);
    }
  });

  watcher.on('change', debounce(callback));
}

Watcher.prototype.watchFile = function(file, options, fn) {
  var parent = path.join(file, '../');
  var opts = assign({}, options, {
    recursive: false,
    filter: null
  });

  var watcher = fs.watch(parent, opts);
  this.add(watcher, {
    type: 'file',
    fpath: parent,
    options: opts,
    compareName: function(n) {
      return is.sameFile(n, file);
    }
  });

  if (is.func(fn)) {
    if (fn.length == 1) deprecationWarning();
    this.on('change', fn);
  }
}

Watcher.prototype.watchDirectory = function(dir, options, fn) {
  var self = this;
  hasNativeRecursive(function(has) {
    options.recursive = !!options.recursive;
    var opts = assign({}, options);
    if (!has) {
      opts = assign(opts, { recursive: false });
    }
    var watcher = fs.watch(dir, opts);

    self.add(watcher, {
      type: 'dir',
      fpath: dir,
      options: options
    });

    if (is.func(fn)) {
      if (fn.length == 1) deprecationWarning();
      self.on('change', fn);
    }

    if (options.recursive && !has) {
      getSubDirectories(dir, function(d) {
        var filterGuard = guard(options.filter);
        filterGuard(d, function() {
          self.watchDirectory(d, options);
        });
      });
    }
  });
}

function composeWatcher(watchers) {
  var watcher = new Watcher();
  watchers.forEach(function(w) {
    w.on('change', function(evt, name) {
      watcher.emit('change', evt, name);
    });
    w.on('error', function(err) {
      watcher.emit('error', err);
    });
  });
  watcher.close = function() {
    watchers.forEach(function(w) {
      w.close();
    });
  }
  return watcher.expose();
}

function watch(fpath, options, fn) {
  var watcher = new Watcher();

  if (is.buffer(fpath)) {
    fpath = fpath.toString();
  }

  if (is.array(fpath)) {
    return composeWatcher(unique(fpath).map(function(f) {
      return watch(f, options, fn);
    }));
  };

  if (!is.exists(fpath)) {
    watcher.emit('error',
      new Error(fpath + ' does not exist.')
    );
  }

  if (is.string(options)) {
    options = {
      encoding: options
    }
  }

  if (is.func(options)) {
    fn = options;
    options = {};
  }

  if (arguments.length < 2) {
    options = {};
  }

  if (is.file(fpath)) {
    watcher.watchFile(fpath, options, fn);
  }

  else if (is.directory(fpath)) {
    watcher.watchDirectory(fpath, options, fn);
  }

  return watcher.expose();
}

module.exports = watch;
