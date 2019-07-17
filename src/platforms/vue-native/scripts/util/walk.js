const fs = require('fs');
const path = require('path');

function _walk (dir, options, cb) {
  if (fs.existsSync(dir)) {
    if (fs.statSync(dir).isDirectory()) {
      fs.readdir(dir, function(err, all) {
        if (err) {
          // don't throw permission errors.
          if (!/^(EPERM|EACCES)$/.test(err.code)) {
            throw err;
          } else {
            console.warn('Warning: Cannot access %s.', dir);
          }
        } else if (Array.isArray(all)) {
          all.forEach(function(f) {
            var sdir = path.join(dir, f);
            if (fs.existsSync(sdir) && f !== 'node_modules') {
              if (fs.statSync(sdir).isDirectory()) {
                _walk(sdir, options, cb);
              } else if (options.filter.test(sdir)){
                cb(sdir);
              }
            }
          });
        }
      });
    } else if (options.filter.test(dir)){
      cb(dir);
    }
  }
}

module.exports = function walk (dir, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {
      filter: /./
    };
  }
  return _walk(dir, options, cb);
};
