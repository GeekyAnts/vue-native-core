/*!
 * Vue.js v2.2.6
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Convert a value to a string that is actually rendered.
 */
function _toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Always return false.
 */
var no = function () { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      return JSON.stringify(a) === JSON.stringify(b)
    } catch (e) {
      // possible circular reference
      return a === b
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */


/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

var warn = noop;
var tip = noop;
var formatComponentName;

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.error("[Vue warn]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

function handleError (err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/*  */
/* globals MutationObserver */

var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    } )); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools


/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

Dep.target = null;

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target ).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */


/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */


/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */

/*  */



/**
 * Get the default value of a prop.
 */

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, option.value) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(option.value, value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

var model = {
  bind: function bind$$1 (el, binding) {
    if (el.tagName.toLowerCase() === 'select') {
      setSelected(el, binding, this);
    }
  },
  update: function update (el, binding) {
    if (el.tagName.toLowerCase() === 'select') {
      if (binding.value !== binding.oldValue) {
        setSelected(el, binding, this);
      }
    }
  }
};

var index = {
  model: model
};

/*  */

function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  return ret
}

var CREATE_ELEMENT = 'createElement';
var COMPONENT = 'Component';
var HELPER_HEADER = '__react__vue__';

var COMMON = {
  'createElement': {
    name: ("" + HELPER_HEADER + CREATE_ELEMENT),
    alias: CREATE_ELEMENT
  },
  'component': {
    name: ("" + HELPER_HEADER + COMPONENT),
    alias: COMPONENT
  },
  'renderSlot': {
    name: (HELPER_HEADER + "renderSlot"),
    value: (HELPER_HEADER + "slotSet"),
    defaultSlot: (HELPER_HEADER + "defaultSlot"),
    slotTag: (HELPER_HEADER + "slotTag"),
    alias: 'renderSlot'
  },
  'template': {
    name: (HELPER_HEADER + "template"),
    type: (HELPER_HEADER + "template"),
    alias: 'template'
  },
  'renderList': {
    name: (HELPER_HEADER + "renderList"),
    alias: 'renderList'
  },
  'toNumber': {
    name: (HELPER_HEADER + "toNumber"),
    alias: 'toNumber'
  },
  'checkKeyCodes': {
    name: (HELPER_HEADER + "checkKeyCodes"),
    alias: 'checkKeyCodes'
  },
  'looseEqual': {
    name: (HELPER_HEADER + "looseEqual"),
    alias: 'looseEqual'
  },
  'looseIndexOf': {
    name: (HELPER_HEADER + "looseIndexOf"),
    alias: 'looseIndexOf'
  },
  'toString': {
    name: (HELPER_HEADER + "toString"),
    alias: '_toString'
  },
  'event': {
    name: (HELPER_HEADER + "event"),
    alias: 'event'
  },
  'directive': {
    name: (HELPER_HEADER + "directive"),
    alias: 'directive',
    component: (HELPER_HEADER + "directiveComponent"),
    tag: (HELPER_HEADER + "directiveTag"),
    context: (HELPER_HEADER + "directiveContext")
  },
  'dynamicComponent': {
    name: (HELPER_HEADER + "dynamicComponent"),
    alias: 'dynamicComponent'
  },
  'setRef': {
    name: (HELPER_HEADER + "setRef")
  }
};

var WEB = {
  'bindClass': {
    name: (HELPER_HEADER + "bindClass"),
    alias: "bindWebClass"
  },
  'bindStyle': {
    name: (HELPER_HEADER + "bindStyle"),
    alias: "bindWebStyle"
  },
  'transition': {
    name: (HELPER_HEADER + "transition"),
    alias: "transitionWeb",
    component: (HELPER_HEADER + "transitionComponent"),
    collection: (HELPER_HEADER + "transitionCollection")
  },
  'transitionGroup': {
    name: (HELPER_HEADER + "transitionGroup"),
    alias: "transitionGroupWeb",
    component: (HELPER_HEADER + "transitionGroupComponent"),
    collection: (HELPER_HEADER + "transitionGroupCollection")
  }
};

function renderSlot (names, children) {
  var hitSlot = {};
  var defaultSlot = [];
  if (children === undefined) {
    return function () {}
  }
  if (!Array.isArray(children)) {
    children = [children];
  }
  children.forEach(function (v) {
    if (v.type === COMMON.template.type) {
      if (v['data-slot'] === undefined) {
        defaultSlot.push(v.render);
      }
      return
    }
    if (v.props['data-slot'] === undefined) {
      defaultSlot.push(v);
    }
  });
  names.forEach(function (v) {
    children.forEach(function (_v, _i) {
      if (_v.type === COMMON.template.type) {
        if (v === _v['data-slot']) {
          hitSlot[v] = _v.render;
        }
        return
      }
      if (v === _v.props['data-slot']) {
        hitSlot[v] = _v;
      }
      return
    });
  });
  function render (name, props) {
    var target;
    if (name === undefined) {
      target = defaultSlot.length === 0 ? undefined : defaultSlot;
    } else {
      target = hitSlot[name];
    }
    if (typeof target === 'function') {
      return target(props)
    } else if (Array.isArray(target)) {
      return target.map(function (v) {
        if (typeof v === 'function') {
          return v(props)
        } else {
          return v
        }
      })
    } else {
      return target
    }
  }
  return render
}

function bindWebClass (classBinding) {
  var type = Object.prototype.toString.call(classBinding);
  if (type === '[object Object]') {
    return Object.keys(classBinding).filter(function (k) {
      return !!classBinding[k]
    }).join(' ')
  } else if (type === '[object Array]') {
    return classBinding.map(function (v) {
      return bindWebClass(v)
    }).join(' ')
  }
  return classBinding
}

var prefixes = ['Webkit', 'Moz', 'ms'];

var testEl;
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div');
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper;
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
});

function bindWebStyle (styleBinding, staticStyle) {
  styleBinding = styleBinding || {};
  staticStyle = staticStyle || {};
  var type = Object.prototype.toString.call(styleBinding);
  if (type === '[object Object]') {
    var normalizedStyle = {};
    styleBinding = Object.assign({}, styleBinding, staticStyle);
    for (var key in styleBinding) {
      normalizedStyle[normalize(key)] = styleBinding[key];
    }
    return normalizedStyle
  } else if (type === '[object Array]') {
    return styleBinding.map(function (v) {
      return bindWebStyle(v, staticStyle)
    }).reduce(function (acc, val) { return Object.assign(acc, val); }, {})
  }
}

/*  */

/**
 * Runtime helper for checking keyCodes.
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias
) {
  var keyCodes = builtInAlias;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}

function template (props) {
  return props.children
}

function event (fn) {
  if (Array.isArray(fn)) {
    return function () {
      var arguments$1 = arguments;
      var this$1 = this;

      return fn.map(function (v) { return v.apply(this$1, arguments$1); })
    }
  } else {
    return fn
  }
}

function triggerDirective (newData, oldData, vm, ref) {
  var directive;
  if (newData) {
    directive = vm.$options.directives[newData.name];
  } else if (oldData) {
    directive = vm.$options.directives[oldData.name];
  }
  if (!directive) {
    return
  }
  var binding;
  if (newData && oldData) { // update
    binding = {
      name: newData.name,
      value: newData.value,
      oldValue: oldData.value,
      expression: newData.expression,
      arg: newData.arg,
      modifiers: newData.modifiers
    };
    var args = [ref, binding];
    if (typeof directive === 'function') {
      directive.apply(vm, args);
    } else if (typeof directive.update === 'function') {
      directive.update.apply(vm, args);
    }
  } else if (newData && !oldData) { // bind
    binding = {
      name: newData.name,
      value: newData.value,
      expression: newData.expression,
      arg: newData.arg,
      modifiers: newData.modifiers
    };
    var args$1 = [ref, binding];
    if (typeof directive === 'function') {
      directive.apply(vm, args$1);
    } else if (typeof directive.bind === 'function') {
      directive.bind.apply(vm, args$1);
    }
  } else if (!newData && oldData) { // unbind
    binding = {
      name: oldData.name,
      value: oldData.value,
      expression: oldData.expression,
      arg: oldData.arg,
      modifiers: oldData.modifiers
    };
    var args$2 = [ref, binding];
    if (typeof directive.unbind === 'function') {
      directive.unbind.apply(vm, args$2);
    }
  }
}

function directive (Component, createElement) {
  return (function (Component) {
    function DirectiveForm (props) {
      Component.call(this, props);
      this.state = {
        formProps: {}
      };
      this.ref = null;
    }

    if ( Component ) DirectiveForm.__proto__ = Component;
    DirectiveForm.prototype = Object.create( Component && Component.prototype );
    DirectiveForm.prototype.constructor = DirectiveForm;
    DirectiveForm.prototype.directive = function directive (newProps, oldProps) {
      var this$1 = this;

      var context;
      var newDirectives = [];
      var oldDirectives = [];
      if (oldProps) {
        context = oldProps[COMMON.directive.context];
        oldDirectives = oldProps[COMMON.directive.name];
      }
      if (newProps) {
        context = newProps[COMMON.directive.context];
        newDirectives = newProps[COMMON.directive.name];
      }
      var newDirectivesClone = newDirectives.slice();
      var oldDirectivesClone = oldDirectives.slice();
      if (Array.isArray(newDirectives) && Array.isArray(oldDirectives)) {
        newDirectives.forEach(function (newDirective, newIndex) {
          oldDirectives.forEach(function (oldDirective, oldIndex) {
            if (newDirective.name === oldDirective.name) {
              newDirectivesClone.splice(newIndex, 1, undefined);
              oldDirectivesClone.splice(oldIndex, 1, undefined);
              triggerDirective(newDirective, oldDirective, context.vm, this$1.ref); // update
            }
          });
        });
        newDirectivesClone.forEach(function (v) { // bind
          v && triggerDirective(v, null, context.vm, this$1.ref);
        });
        oldDirectivesClone.forEach(function (v) { // unbind
          v && triggerDirective(null, v, context.vm, this$1.ref);
        });
      }
    };
    DirectiveForm.prototype.handle = function handle (props) {
      var this$1 = this;

      var obj = {};
      for (var key in props) {
        if (key !== COMMON.directive.name &&
          key !== COMMON.directive.tag &&
          key !== COMMON.directive.context) {
          obj[key] = props[key];
        }
      }
      var refFn = obj.ref || function () {};
      obj.ref = function (ref) {
        this$1.ref = ref;
        return refFn(ref)
      };
      var onChangeFn = obj.onChange || function () {};
      obj.onChange = function (event) {
        this$1.setState({
          formProps: Object.assign({}, this$1.state.formProps, {
            value: event.target.value
          })
        });
        return onChangeFn(event)
      };
      this.setState({
        formProps: obj
      });
    };
    DirectiveForm.prototype.componentWillMount = function componentWillMount () {
      this.handle(this.props);
    };
    DirectiveForm.prototype.componentDidMount = function componentDidMount () {
      this.directive(this.props);
    };
    DirectiveForm.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
      this.handle(nextProps);
      this.directive(nextProps, this.props);
    };
    DirectiveForm.prototype.componentWillUnmount = function componentWillUnmount () {
      this.directive(null, this.props);
    };
    DirectiveForm.prototype.shouldComponentUpdate = function shouldComponentUpdate (nextProps, nextState) {
      return nextState.formProps.value !== this.state.formProps.value
    };
    DirectiveForm.prototype.render = function render () {
      return createElement(this.props[COMMON.directive.tag], this.state.formProps, this.props.children)
    };

    return DirectiveForm;
  }(Component))
}

function mergeCssModule (computed, cssModules) {
  var _computed = Object.create(computed || null);
  Object.keys(cssModules).forEach(function (key) {
    var module = cssModules[key];
    _computed[key] = function () { return module };
  });
  return _computed
}

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}





function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

function filterCollection (collection) {
  var result = [];
  collection.forEach(function (v) {
    if (v.type === 'if') {
      var _result = v.conditions.filter(function (_v) { return _v.exp; }).map(function (_v) {
        return {
          type: 'if',
          index: _v.index,
          element: _v.element,
          exp: _v.exp
        }
      });
      if (_result.length) {
        result.push(_result[0]);
      }
    } else {
      result.push(v);
    }
  });
  if (result.length > 1) {
    console.warn("<transition> can only be used on a single element. Use <transition-group> for lists.");
  }
  return result
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

// only used in dev mode
function checkDuration (val, name) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + "."
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.'
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

function addTransitionClass$$1 (ref, className) {
  addClass(ref, className);
}

function removeTransitionClass$$1 (ref, className) {
  removeClass(ref, className);
}

function enter (ref) {
  var el = ref.el;
  var cb = ref.cb;

  var ref$1 = this.transitionResolved;
  var css = ref$1.css;
  var type = ref$1.type;
  var enterClass = ref$1.enterClass;
  var enterToClass = ref$1.enterToClass;
  var enterActiveClass = ref$1.enterActiveClass;
  var appearClass = ref$1.appearClass;
  var appearToClass = ref$1.appearToClass;
  var appearActiveClass = ref$1.appearActiveClass;
  var onBeforeEnter = ref$1.onBeforeEnter;
  var onEnter = ref$1.onEnter;
  var onAfterEnter = ref$1.onAfterEnter;
  var onEnterCancelled = ref$1.onEnterCancelled;
  var onBeforeAppear = ref$1.onBeforeAppear;
  var appear = ref$1.appear;
  var onAppear = ref$1.onAppear;
  var onAfterAppear = ref$1.onAfterAppear;
  var onAppearCancelled = ref$1.onAppearCancelled;
  var duration = ref$1.duration;

  var isAppear = this.isAppear;

  if (isUndef(el)) {
    return
  }

  if (isAppear && !appear && appear !== '') {
    return
  }

  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (onBeforeAppear || onBeforeEnter)
    : onBeforeEnter;
  var enterHook = isAppear
    ? (onAppear || onEnter)
    : onEnter;
  var afterEnterHook = isAppear
    ? (onAfterAppear || onAfterEnter)
    : onAfterEnter;
  var enterCancelledHook = isAppear
    ? (onAppearCancelled || onEnterCancelled)
    : onEnterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter');
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var _cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass$$1(el, activeClass);
      removeTransitionClass$$1(el, toClass);
    }
    cb && cb();
    if (_cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass$$1(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  beforeEnterHook && beforeEnterHook(el);

  if (expectsCSS) {
    addTransitionClass$$1(el, startClass);
    addTransitionClass$$1(el, activeClass);

    nextFrame(function () {
      removeTransitionClass$$1(el, startClass);
      addTransitionClass$$1(el, toClass);
      if (!_cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(_cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type || getTransitionInfo(el).type, _cb);
        }
      }
    });
  }

  nextFrame(function () { return enterHook && enterHook(el, _cb); });

  if (!expectsCSS && !userWantsControl) {
    _cb();
  }
}

function leave (ref) {
  var el = ref.el;
  var cb = ref.cb;

  var ref$1 = this.transitionResolved;
  var css = ref$1.css;
  var type = ref$1.type;
  var leaveClass = ref$1.leaveClass;
  var leaveToClass = ref$1.leaveToClass;
  var leaveActiveClass = ref$1.leaveActiveClass;
  var onBeforeLeave = ref$1.onBeforeLeave;
  var onLeave = ref$1.onLeave;
  var onAfterLeave = ref$1.onAfterLeave;
  var onLeaveCancelled = ref$1.onLeaveCancelled;
  var duration = ref$1.duration;

  if (isUndef(el)) {
    return
  }

  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(onLeave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitLeaveDuration != null) {
    checkDuration(explicitLeaveDuration, 'leave');
  }

  var _cb = el._leaveCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass$$1(el, leaveActiveClass);
      removeTransitionClass$$1(el, leaveToClass);
    }
    cb && cb();
    if (_cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass$$1(el, leaveClass);
      }
      onLeaveCancelled && onLeaveCancelled(el);
    } else {
      onAfterLeave && onAfterLeave(el);
    }
    el._leaveCb = null;
  });

  onBeforeLeave && onBeforeLeave(el);
  if (expectsCSS) {
    addTransitionClass$$1(el, leaveClass);
    addTransitionClass$$1(el, leaveActiveClass);

    nextFrame(function () {
      removeTransitionClass$$1(el, leaveClass);
      addTransitionClass$$1(el, leaveToClass);
      if (!_cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitLeaveDuration)) {
          setTimeout(_cb, explicitLeaveDuration);
        } else {
          whenTransitionEnds(el, type || getTransitionInfo(el).type, _cb);
        }
      }
    });
  }
  onLeave && onLeave(el, _cb);
  if (!expectsCSS && !userWantsControl) {
    _cb();
  }
}

function transitionWeb (Component, createElement) {
  return (function (Component) {
    function Transition (props) {
      Component.call(this, props);
      this._refs = {};
      this.transitionResolved = {};
      this._shouldComponentUpdateResult = false;
      this.isAppear = false;
      this.state = {
        transObj: {},
        animated: true,
        tagKey: null
      };
    }

    if ( Component ) Transition.__proto__ = Component;
    Transition.prototype = Object.create( Component && Component.prototype );
    Transition.prototype.constructor = Transition;

    Transition.prototype.setRef = function setRef (ref, key) {
      if (!ref) {
        return
      }
      this._refs[key] = ref.ref || ref;
    };

    Transition.prototype.resolveData = function resolveData (props, type) {
      var this$1 = this;

      var target = filterCollection(props[WEB.transition.collection])[0];
      if (target) {
        var element = target.element;
        var _props = {};
        for (var key in element.props) {
          _props[key] = element.props[key];
        }

        var key$1 = target.index;
        if (element.key != null) {
          key$1 = element.key + key$1;
        }
        if (target.type === 'component') {
          var targetExp = target.exp;
          var thisTarget = this.state.transObj[this.state.tagKey];
          var thisExp = thisTarget && thisTarget.exp;
          if (targetExp !== thisExp) {
            key$1 = this.state.tagKey === 0 ? 1 : 0;
          }
        }
        _props.key = _props.key || key$1;

        var setRef = function (ref) {
          this$1.setRef(ref, _props.key);
          element.ref && element.ref(ref);
        };
        if (target.type === 'component') {
          _props[COMMON.setRef.name] = setRef;
        } else {
          _props.ref = setRef;
        }

        var transObj = Object.assign({}, this.state.transObj);
        transObj[_props.key] = Object.assign({}, target, {
          props: _props
        });
        return {
          transObj: transObj,
          animated: true,
          tagKey: _props.key
        }
      } else if (type === 'update') {
        return this.triggerTransitionExp()
      }
    };

    Transition.prototype.triggerTransitionExp = function triggerTransitionExp () {
      var tagKey = this.state.tagKey;
      var transition = this.state.transObj[tagKey];
      // someone want to hide and his prev state is show
      if (transition) {
        var transObj = {};
        transObj[tagKey] = Object.assign({}, transition, {
          exp: !transition.exp
        });
        return {
          animated: true,
          transObj: transObj,
          tagKey: tagKey
        }
      }
    };

    Transition.prototype.componentWillMount = function componentWillMount () {
      this.transitionResolved = resolveTransition(this.props);
      this.isAppear = true;
      var state = this.resolveData(this.props);
      state && this.setState(state);
    };

    Transition.prototype.componentDidMount = function componentDidMount () {
      this.resolveEnterTransition({
        el: this._refs[this.state.tagKey]
      });
    };

    Transition.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
      var this$1 = this;

      this.transitionResolved = resolveTransition(nextProps);
      this.isAppear = false;
      var nextState = this.resolveData(nextProps, 'update');
      this._shouldComponentUpdateResult = nextState
        ? this._shouldComponentUpdate(nextProps, nextState)
        : true;
      if (this._shouldComponentUpdateResult) {
        Object.keys(this._refs).forEach(function (k) {
          var el = this$1._refs[k];
          if (isDef(el._leaveCb)) {
            el._leaveCb.cancelled = true;
            el._leaveCb();
          }
          if (isDef(el._enterCb)) {
            el._enterCb.cancelled = true;
            el._enterCb();
          }
        });
        nextState && this.setState(nextState);
      }
    };

    Transition.prototype._shouldComponentUpdate = function _shouldComponentUpdate (nextProps, nextState) {
      if (Object.keys(nextState.transObj).length !==
          Object.keys(this.state.transObj).length) {
        return true
      }
      if (nextState.tagKey === this.state.tagKey) {
        var nextTransition = nextState.transObj[nextState.tagKey];
        var transition = this.state.transObj[this.state.tagKey];
        if (nextTransition && transition) {
          return transition.exp !== nextTransition.exp
        }
      }
      return true
    };

    Transition.prototype.shouldComponentUpdate = function shouldComponentUpdate () {
      return this._shouldComponentUpdateResult
    };

    Transition.prototype.resolveEnterTransition = function resolveEnterTransition (option) {
      enter.call(this, option);
    };

    Transition.prototype.resolveLeaveTransition = function resolveLeaveTransition (option) {
      leave.call(this, option);
    };

    Transition.prototype.componentDidUpdate = function componentDidUpdate (prevProps, prevState) {
      var this$1 = this;

      if (this.state.animated === false) {
        return
      }
      if (this.state.tagKey === prevState.tagKey) { // same element
        var ref = this._refs[this.state.tagKey];
        var transition = this.state.transObj[this.state.tagKey];
        if (ref && transition) {
          if (transition.type === 'show') {
            if (transition.exp === false) {
              this.resolveLeaveTransition({
                el: ref,
                cb: function () {
                  ref.style.display = 'none';
                }
              });
            } else if (transition.exp === true) {
              ref.style.display = '';
              this.resolveEnterTransition({
                el: ref
              });
            }
          } else if (transition.type === 'if') {
            if (transition.exp === false) {
              var transObj = Object.assign({}, this.state.transObj);
              delete transObj[prevState.tagKey];
              this.resolveLeaveTransition({
                el: ref,
                cb: function () {
                  this$1.setState({
                    transObj: transObj,
                    animated: false
                  });
                }
              });
            } else if (transition.exp === true) {
              this.resolveEnterTransition({
                el: ref
              });
            }
          }
        }
      } else {
        var enterRef = this._refs[this.state.tagKey];
        var leaveRef = this._refs[prevState.tagKey];
        var transObj$1 = Object.assign({}, this.state.transObj);
        delete transObj$1[prevState.tagKey];
        this.resolveEnterTransition({
          el: enterRef
        });
        this.resolveLeaveTransition({
          el: leaveRef,
          cb: function () {
            this$1.setState({
              transObj: transObj$1,
              animated: false
            });
          }
        });
      }
    };

    Transition.prototype.render = function render () {
      var transObj = this.state.transObj;
      var tag = this.props.tag || 'span';
      return createElement(tag, null, Object.keys(transObj).map(function (k) {
        var type = transObj[k].element.type;
        var props = transObj[k].props;
        var children = props.children;
        return createElement(type, props, children)
      }))
    };

    return Transition;
  }(Component))
}

// unfinished

function transitionGroupWeb (Component, createElement) {
  return (function (Component) {
    function TransitionGroup () {
      Component.apply(this, arguments);
    }

    if ( Component ) TransitionGroup.__proto__ = Component;
    TransitionGroup.prototype = Object.create( Component && Component.prototype );
    TransitionGroup.prototype.constructor = TransitionGroup;

    TransitionGroup.prototype.render = function render () {
      var tag = this.props.tag || 'span';
      return createElement(tag, null)
    };

    return TransitionGroup;
  }(Component))
}

function mergeCssModule$1 (computed, cssModules) {
  var _computed = Object.create(computed || null);
  Object.keys(cssModules).forEach(function (key) {
    var module = cssModules[key];
    _computed[key] = function () { return module };
  });
  return _computed
}

function pascalCaseTag (tag) {
  return tag.split('-').map(function (v) { return v.replace(/^[a-z]/, function (s) { return s.toUpperCase(); }); }).join('')
}

function pascalCaseComponentTag (components) {
  var pascalCaseComponent = {};
  for (var tag in components) {
    pascalCaseComponent[pascalCaseTag(tag)] = components[tag];
  }
  return pascalCaseComponent
}

function triggerDirective$1 (newDirectiveData, oldDirectiveData, vm) {
  for (var key in Object.assign({}, oldDirectiveData, newDirectiveData)) {
    var newData = newDirectiveData[key];
    var oldData = oldDirectiveData[key];
    var directive = vm.$options.directives[newData.name];
    if (!directive) {
      continue
    }
    var ref = (void 0), binding = (void 0);
    if (newData && oldData) { // update
      ref = newData.directive.ref;
      binding = {
        name: newData.name,
        value: newData.value,
        oldValue: oldData.value,
        expression: newData.expression,
        arg: newData.arg,
        modifiers: newData.modifiers
      };
      var args = [ref, binding, newData.directive.reactElement, oldData.directive.reactElement];
      if (typeof directive === 'function') {
        directive.apply(vm, args);
      } else if (typeof directive.update === 'function') {
        directive.update.apply(vm, args);
      }
    } else if (newData && !oldData) { // bind
      ref = newData.directive.ref;
      binding = {
        name: newData.name,
        value: newData.value,
        expression: newData.expression,
        arg: newData.arg,
        modifiers: newData.modifiers
      };
      var args$1 = [ref, binding, newData.directive.reactElement];
      if (typeof directive === 'function') {
        directive.apply(vm, args$1);
      } else if (typeof directive.bind === 'function') {
        directive.bind.apply(vm, args$1);
      }
    } else if (!newData && oldData) { // unbind
      ref = oldData.directive.ref;
      binding = {
        name: oldData.name,
        value: oldData.value,
        expression: oldData.expression,
        arg: oldData.arg,
        modifiers: oldData.modifiers
      };
      var args$2 = [ref, binding, oldData.directive.reactElement];
      if (typeof directive.unbind === 'function') {
        directive.unbind.apply(vm, args$2);
      }
    }
  }
}

function buildComponent (render, options, config) {
  var Component = config.Component;
  var PropTypes = config.PropTypes;
  var Vue = config.Vue;
  var cssModules = config.cssModules;
  if (cssModules) {
    options.computed = mergeCssModule$1(options.computed, cssModules);
  }
  var ReactVueComponent = (function (Component) {
    function ReactVueComponent (props) {
      Component.call(this, props);
      this.eventOnceUid = [];
      this.newDirectiveData = {};
      this.oldDirectiveData = {};
      this.vm = {};
      this.beforeMount = [];
      this.mounted = [];
      this.beforeUpdate = [];
      this.updated = [];
      this.beforeDestroy = [];
    }

    if ( Component ) ReactVueComponent.__proto__ = Component;
    ReactVueComponent.prototype = Object.create( Component && Component.prototype );
    ReactVueComponent.prototype.constructor = ReactVueComponent;

    /**
     * children can access parent instance by 'this.context.owner'
     */
    ReactVueComponent.prototype.getChildContext = function getChildContext () {
      return {
        owner: this
      }
    };

    /**
     * for event modifiers v-on:xxx.once
     */
    ReactVueComponent.prototype.setEventOnce = function setEventOnce (fn) {
      var this$1 = this;

      var name = fn.name;
      return function (event) {
        if (this$1.eventOnceUid.indexOf(name) === -1) {
          this$1.eventOnceUid.push(name);
          fn(event);
        }
      }
    };

    /**
     * for custom/systom directive v-xxx
     */
    ReactVueComponent.prototype.setDirective = function setDirective (directive) {
      var this$1 = this;

      directive.forEach(function (v) {
        this$1.newDirectiveData[v.uid] = Object.assign({}, v, { directive: directive });
      });
    };

    ReactVueComponent.prototype.setRef = function setRef (ref, text, inFor) {
      if (inFor === true) {
        if (!this.vm.$refs[text]) {
          this.vm.$refs[text] = [];
        }
        this.vm.$refs[text].push(ref);
      } else {
        this.vm.$refs[text] = ref;
      }
    };

    ReactVueComponent.prototype.buildVM = function buildVM (options) {
      render._withStripped = true;
      options = Object.assign({}, options, {
        render: render,
        propsData: this.props,
        parent: this.context.owner ? this.context.owner.vm : undefined
      });
      var vm = new Vue(options);
      vm.$options.components = pascalCaseComponentTag(vm.$options.components);
      return vm
    };

    ReactVueComponent.prototype.componentWillMount = function componentWillMount () {
      var this$1 = this;

      this.vm = this.buildVM(options);

      this.beforeMount = this.vm.$options.beforeMount || [];
      this.mounted = this.vm.$options.mounted || [];
      this.beforeUpdate = this.vm.$options.beforeUpdate || [];
      this.updated = this.vm.$options.updated || [];
      this.beforeDestroy = this.vm.$options.beforeDestroy || [];

      this.beforeMount.forEach(function (v) { return v.call(this$1.vm); });
    };

    ReactVueComponent.prototype.componentDidMount = function componentDidMount () {
      var this$1 = this;

      triggerDirective$1(this.newDirectiveData, this.oldDirectiveData, this.vm);
      this.mounted.forEach(function (v) { return v.call(this$1.vm); });
    };
    ReactVueComponent.prototype.componentWillUpdate = function componentWillUpdate () {
      var this$1 = this;

      this.oldDirectiveData = this.newDirectiveData;
      this.newDirectiveData = {};
      this.beforeUpdate.forEach(function (v) { return v.call(this$1.vm); });
    };
    ReactVueComponent.prototype.componentDidUpdate = function componentDidUpdate () {
      var this$1 = this;

      triggerDirective$1(this.newDirectiveData, this.oldDirectiveData, this.vm);
      this.updated.forEach(function (v) { return v.call(this$1.vm); });
    };
    ReactVueComponent.prototype.componentWillUnmount = function componentWillUnmount () {
      var this$1 = this;

      this.beforeDestroy.forEach(function (v) { return v.call(this$1.vm); });
    };
    ReactVueComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
      Object.assign({}, this.vm._props, nextProps);
    };
    ReactVueComponent.prototype.shouldComponentUpdate = function shouldComponentUpdate () {
      return false
    };
    ReactVueComponent.prototype.render = function render$1 () {
      return render.call(this, this.vm._renderProxy)
    };

    return ReactVueComponent;
  }(Component));
  ReactVueComponent.childContextTypes = {
    owner: PropTypes.object
  };
  ReactVueComponent.contextTypes = {
    owner: PropTypes.object
  };

  return ReactVueComponent
}

function dynamicComponent (vm, name) {
  var componentName;
  if (typeof name === 'string') {
    componentName = vm.$options.components[pascalCaseTag(name)];
  } else {
    componentName = name;
  }
  return componentName
}

/**
 * 
 */

export { index as platformDirectives, renderList, renderSlot, bindWebClass, bindWebStyle, checkKeyCodes, template, event, directive, mergeCssModule, transitionWeb, transitionGroupWeb, dynamicComponent, isUndef, isDef, isTrue, isPrimitive, isObject, isPlainObject, _toString, toNumber, makeMap, isBuiltInTag, remove, hasOwn, cached, camelize, capitalize, hyphenate, bind, toArray, extend, toObject, noop, no, identity, genStaticKeys, looseEqual, looseIndexOf, once, pascalCaseTag, buildComponent };
