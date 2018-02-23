'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
var UA = inBrowser && window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase();
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
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

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

function setCheckBox (el, binding) {
  var value = binding.value;
  try {
    value = JSON.parse(value);
  } catch (e) {}
  if (value) {
    el.setAttribute('checked', value);
  } else {
    el.removeAttribute('checked');
  }
}

var model = {
  bind: function bind$$1 (el, binding) {
    if (el.tagName) {
      var lowerTagName = el.tagName.toLowerCase();
      if (lowerTagName === 'select') {
        setSelected(el, binding, this);
      } else if (lowerTagName === 'input') {
        if (el.getAttribute('type') === 'checkbox') {
          setCheckBox(el, binding);
        }
      }
    }
  },
  update: function update (el, binding) {
    if (el.tagName) {
      var lowerTagName = el.tagName.toLowerCase();
      if (lowerTagName === 'select') {
        setSelected(el, binding, this);
      } else if (lowerTagName === 'input') {
        if (el.getAttribute('type') === 'checkbox') {
          setCheckBox(el, binding);
        }
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
  'resolveFilter': {
    name: (HELPER_HEADER + "resolveFilter"),
    alias: 'resolveFilter'
  },
  'event': {
    name: (HELPER_HEADER + "event"),
    alias: 'event'
  },
  'directive': {
    name: (HELPER_HEADER + "buildDirective"),
    alias: 'buildDirective',
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
  },
  'customEvent': {
    name: (HELPER_HEADER + "customEvent")
  },
  'handleProps': {
    name: (HELPER_HEADER + "handleProps"),
    alias: 'handleProps'
  },
  'mergeProps': {
    name: (HELPER_HEADER + "mergeProps"),
    alias: 'mergeProps'
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
  'emptyComponent': {
    name: (HELPER_HEADER + "buildEmptyComponent"),
    alias: 'buildWebEmptyComponent',
    component: (HELPER_HEADER + "EmptyComponent")
  },
  'inputComponent': {
    name: (HELPER_HEADER + "buildInputComponent"),
    alias: 'buildWebInputComponent',
    tag: (HELPER_HEADER + "inputComponentTag"),
    component: (HELPER_HEADER + "InputComponent")
  },
  'transition': {
    name: (HELPER_HEADER + "transition"),
    alias: "buildWebTransition",
    component: (HELPER_HEADER + "transitionComponent"),
    collection: (HELPER_HEADER + "transitionCollection")
  },
  // unfinished
  'transitionGroup': {
    name: (HELPER_HEADER + "transitionGroup"),
    alias: "buildWebTransitionGroup",
    component: (HELPER_HEADER + "transitionGroupComponent"),
    collection: (HELPER_HEADER + "transitionGroupCollection")
  }
};

function renderSlot (names, children) {
  var hitSlot = {};
  var defaultSlot = [];
  if (children == null) {
    return function () {}
  }
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(function (v) { return v != null; });
  children.forEach(function (v) {
    if (v.type === COMMON.template.type) {
      if (v['data-slot'] === undefined) {
        defaultSlot.push(v.render);
      }
      return
    }
    if (v.props === undefined || v.props['data-slot'] === undefined) {
      defaultSlot.push(v);
    }
  });
  names.forEach(function (v) {
    children.forEach(function (_v, _i) {
      if (typeof _v === 'string' || typeof _v === 'number') {
        return
      }
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

function bindWebClass (c) {
  var type = Object.prototype.toString.call(c);
  if (type === '[object Object]') {
    return Object.keys(c).filter(function (k) {
      return !!c[k]
    }).join(' ')
  } else if (type === '[object Array]') {
    return c.map(function (v) {
      return bindWebClass(v)
    }).join(' ')
  }
  return c
}

function classBinding (c) {
  var type = Object.prototype.toString.call(c);
  if (type === '[object Object]') {
    return Object.keys(c).filter(function (k) {
      return !!c[k]
    })
  } else if (type === '[object Array]') {
    return c.map(function (v) {
      return classBinding(v)
    }).reduce(function (acc, val) {
      return acc.concat(val)
    }, [])
  }
  return c
}

function bindNativeClass (obj) {
  var this$1 = this;

  var arr = [];
  var style = [];
  if (obj.dynamicClass) {
    console.log('obj.dynamicClass', obj.dynamicClass);
    arr = arr.concat(classBinding(obj.dynamicClass));
  }
  if (obj.staticClass) {
    arr = arr.concat(obj.staticClass.split(/\s+/));
  }
  arr.forEach(function (v) {
    if (typeof this$1.css[v] === 'number') {
      style.push(this$1.css[v]);
    }
  });
  if (obj.parentClass) {
    style.push(obj.parentClass);
  }
  return style
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

function bindWebStyle (styleBinding, staticStyle, showStyle) {
  if (styleBinding === undefined) {
    styleBinding = {};
  }
  staticStyle = Object.assign({}, staticStyle, showStyle);
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
      return bindWebStyle(v, staticStyle, showStyle)
    }).reduce(function (acc, val) { return Object.assign(acc, val); }, {})
  }
}

function bindNativeStyle (styleBinding, staticStyle, showStyle) {
  if (styleBinding === undefined) {
    styleBinding = {};
  }
  staticStyle = Object.assign({}, staticStyle, showStyle);
  if (staticStyle.display === '') {
    delete showStyle.display;
  }
  var type = Object.prototype.toString.call(styleBinding);
  if (type === '[object Object]') {
    return Object.assign({}, styleBinding, staticStyle)
  } else if (type === '[object Array]') {
    return styleBinding.map(function (v) {
      return bindNativeStyle(v, staticStyle, showStyle)
    }).reduce(function (acc, val) { return Object.assign(acc, val); }, {})
  }
}

/*  */
function checkKeyCodes (
  vm,
  eventKeyCode,
  key,
  builtInAlias
) {
  var configKeyCodes = {};
  try {
    configKeyCodes = vm.$options._base.config.keyCodes;
  } catch (e) {
    warn('react-vue checkKeyCodes vm.$options._base.config.keyCodes catch error');
  }
  var keyCodes = configKeyCodes[key] || builtInAlias;
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

function mergeCssModule (computed, cssModules) {
  var _computed = Object.create(computed || null);
  Object.keys(cssModules).forEach(function (key) {
    var module = cssModules[key];
    _computed[key] = function () { return module };
  });
  return _computed
}

function isObjectShallowModified (prev, next) {
  // if (prev == null || next == null || typeof prev !== 'object' || typeof next !== 'object') {
  //   return prev !== next
  // }
  // const keys = Object.keys(prev)
  // if (keys.length !== Object.keys(next).length) {
  //   return true
  // }
  // let key
  // for (let i = keys.length - 1; i >= 0; i--) {
  //   key = keys[i]
  //   if (next[key] !== prev[key]) {
  //     return true
  //   }
  // }
  // return false
  if (prev.children !== undefined || next.children !== undefined) {
    return true
  }
  for (var k in next) {
    if (typeof next[k] !== 'object') {
      if (next[k] !== prev[k]) {
        return true
      }
    }
  }
  return false
}

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
function hasOwn$1 (obj, key) {
  return hasOwnProperty$1.call(obj, key)
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

/**
 * for options {components}
 * @param {Object} components
 */

function handleComponents (components) {
  for (var k in components) {
    if (hasOwn$1(components, k)) {
      components[pascalCaseTag(k)] = components[k];
      var c = components[k];
      if (c.name) {
        components[pascalCaseTag(c.name)] = components[k];
      }
    }
  }
  return components
}

function handleDirectives (directives) {
  var obj = {};
  for (var k in directives) {
    obj[k.toLowerCase().replace(/[^a-z]/g, '')] = directives[k];
  }
  return obj
}

/**
 * for 'this.$solts'
 * @param {this.props.children} children
 */
function getSlots (children) {
  var slots = {};
  if (children == null) {
    return slots
  }
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(function (v) { return v != null; });
  children.forEach(function (v, _i) {
    if (typeof v === 'string' || typeof v === 'number' || v === null) {
      slots.default = slots.default || [];
      slots.default.push(v);
    } else if (v.type === COMMON.template.type) {
      slots[v['data-slot']] = slots[v['data-slot']] || [];
      slots[v['data-slot']].push(v.render);
    } else if (v.props) {
      var dataSlot = v.props['data-slot'];
      if (dataSlot == null) {
        slots.default = slots.default || [];
        slots.default.push(v);
      } else {
        slots[dataSlot] = slots[dataSlot] || [];
        slots[dataSlot].push(v);
      }
    }
  });
  return slots
}

function filterCustomEvent (props) {
  return Object.keys(props).filter(function (v) {
    return v.indexOf(COMMON.customEvent.name) === 0
  }).map(function (v) {
    return {
      name: v.replace(COMMON.customEvent.name, ''),
      handle: props[v]
    }
  })
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

/*  */

function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

var ARIADOMPropertyConfig = {
  Properties: {
    // Global States and Properties
    'aria-current': 0, // state
    'aria-details': 0,
    'aria-disabled': 0, // state
    'aria-hidden': 0, // state
    'aria-invalid': 0, // state
    'aria-keyshortcuts': 0,
    'aria-label': 0,
    'aria-roledescription': 0,
    // Widget Attributes
    'aria-autocomplete': 0,
    'aria-checked': 0,
    'aria-expanded': 0,
    'aria-haspopup': 0,
    'aria-level': 0,
    'aria-modal': 0,
    'aria-multiline': 0,
    'aria-multiselectable': 0,
    'aria-orientation': 0,
    'aria-placeholder': 0,
    'aria-pressed': 0,
    'aria-readonly': 0,
    'aria-required': 0,
    'aria-selected': 0,
    'aria-sort': 0,
    'aria-valuemax': 0,
    'aria-valuemin': 0,
    'aria-valuenow': 0,
    'aria-valuetext': 0,
    // Live Region Attributes
    'aria-atomic': 0,
    'aria-busy': 0,
    'aria-live': 0,
    'aria-relevant': 0,
    // Drag-and-Drop Attributes
    'aria-dropeffect': 0,
    'aria-grabbed': 0,
    // Relationship Attributes
    'aria-activedescendant': 0,
    'aria-colcount': 0,
    'aria-colindex': 0,
    'aria-colspan': 0,
    'aria-controls': 0,
    'aria-describedby': 0,
    'aria-errormessage': 0,
    'aria-flowto': 0,
    'aria-labelledby': 0,
    'aria-owns': 0,
    'aria-posinset': 0,
    'aria-rowcount': 0,
    'aria-rowindex': 0,
    'aria-rowspan': 0,
    'aria-setsize': 0
  },
  DOMAttributeNames: {},
  DOMPropertyNames: {}
};

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
var MUST_USE_PROPERTY = 0x1;
var HAS_BOOLEAN_VALUE = 0x4;
var HAS_NUMERIC_VALUE = 0x8;
var HAS_POSITIVE_NUMERIC_VALUE = 0x10 | 0x8;
var HAS_OVERLOADED_BOOLEAN_VALUE = 0x20;
var ATTRIBUTE_NAME_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
var HTMLDOMPropertyConfig = {
  isCustomAttribute: RegExp.prototype.test.bind(new RegExp('^(data|aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$')),
  Properties: {
    /**
     * Standard Properties
     */
    accept: 0,
    acceptCharset: 0,
    accessKey: 0,
    action: 0,
    allowFullScreen: HAS_BOOLEAN_VALUE,
    allowTransparency: 0,
    alt: 0,
    // specifies target context for links with `preload` type
    as: 0,
    async: HAS_BOOLEAN_VALUE,
    autoComplete: 0,
    /**
     * react-vue change
     */
    // autoFocus is polyfilled/normalized by AutoFocusUtils
    autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    capture: HAS_BOOLEAN_VALUE,
    cellPadding: 0,
    cellSpacing: 0,
    charSet: 0,
    challenge: 0,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    cite: 0,
    classID: 0,
    className: 0,
    cols: HAS_POSITIVE_NUMERIC_VALUE,
    colSpan: 0,
    content: 0,
    contentEditable: 0,
    contextMenu: 0,
    controls: HAS_BOOLEAN_VALUE,
    coords: 0,
    crossOrigin: 0,
    data: 0, // For `<object />` acts as `src`.
    dateTime: 0,
    'default': HAS_BOOLEAN_VALUE,
    defer: HAS_BOOLEAN_VALUE,
    dir: 0,
    disabled: HAS_BOOLEAN_VALUE,
    download: HAS_OVERLOADED_BOOLEAN_VALUE,
    draggable: 0,
    encType: 0,
    form: 0,
    formAction: 0,
    formEncType: 0,
    formMethod: 0,
    formNoValidate: HAS_BOOLEAN_VALUE,
    formTarget: 0,
    frameBorder: 0,
    headers: 0,
    height: 0,
    hidden: HAS_BOOLEAN_VALUE,
    high: 0,
    href: 0,
    hrefLang: 0,
    htmlFor: 0,
    httpEquiv: 0,
    icon: 0,
    id: 0,
    inputMode: 0,
    integrity: 0,
    is: 0,
    keyParams: 0,
    keyType: 0,
    kind: 0,
    label: 0,
    lang: 0,
    list: 0,
    loop: HAS_BOOLEAN_VALUE,
    low: 0,
    manifest: 0,
    marginHeight: 0,
    marginWidth: 0,
    max: 0,
    maxLength: 0,
    media: 0,
    mediaGroup: 0,
    method: 0,
    min: 0,
    minLength: 0,
    // Caution; `option.selected` is not updated if `select.multiple` is
    // disabled with `removeAttribute`.
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    name: 0,
    nonce: 0,
    noValidate: HAS_BOOLEAN_VALUE,
    open: HAS_BOOLEAN_VALUE,
    optimum: 0,
    pattern: 0,
    placeholder: 0,
    playsInline: HAS_BOOLEAN_VALUE,
    poster: 0,
    preload: 0,
    profile: 0,
    radioGroup: 0,
    readOnly: HAS_BOOLEAN_VALUE,
    referrerPolicy: 0,
    rel: 0,
    required: HAS_BOOLEAN_VALUE,
    reversed: HAS_BOOLEAN_VALUE,
    role: 0,
    rows: HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: HAS_NUMERIC_VALUE,
    sandbox: 0,
    scope: 0,
    scoped: HAS_BOOLEAN_VALUE,
    scrolling: 0,
    seamless: HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    shape: 0,
    size: HAS_POSITIVE_NUMERIC_VALUE,
    sizes: 0,
    span: HAS_POSITIVE_NUMERIC_VALUE,
    spellCheck: 0,
    src: 0,
    srcDoc: 0,
    srcLang: 0,
    srcSet: 0,
    start: HAS_NUMERIC_VALUE,
    step: 0,
    style: 0,
    summary: 0,
    tabIndex: 0,
    target: 0,
    title: 0,
    // Setting .type throws on non-<input> tags
    type: 0,
    useMap: 0,
    value: 0,
    width: 0,
    wmode: 0,
    wrap: 0,

    /**
     * RDFa Properties
     */
    about: 0,
    datatype: 0,
    inlist: 0,
    prefix: 0,
    // property is also supported for OpenGraph in meta tags.
    property: 0,
    resource: 0,
    'typeof': 0,
    vocab: 0,

    /**
     * Non-standard Properties
     */
    // autoCapitalize and autoCorrect are supported in Mobile Safari for
    // keyboard hints.
    autoCapitalize: 0,
    autoCorrect: 0,
    // autoSave allows WebKit/Blink to persist values of input fields on page reloads
    autoSave: 0,
    // color is for Safari mask-icon link
    color: 0,
    // itemProp, itemScope, itemType are for
    // Microdata support. See http://schema.org/docs/gs.html
    itemProp: 0,
    itemScope: HAS_BOOLEAN_VALUE,
    itemType: 0,
    // itemID and itemRef are for Microdata support as well but
    // only specified in the WHATWG spec document. See
    // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
    itemID: 0,
    itemRef: 0,
    // results show looking glass icon and recent searches on input
    // search fields in WebKit/Blink
    results: 0,
    // IE-only attribute that specifies security restrictions on an iframe
    // as an alternative to the sandbox attribute on IE<10
    security: 0,
    // IE-only attribute that controls focus behavior
    unselectable: 0
  },
  DOMAttributeNames: {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv'
  },
  DOMPropertyNames: {},
  DOMMutationMethods: {
    value: function (node, value) {
      if (value == null) {
        return node.removeAttribute('value')
      }

      // Number inputs get special treatment due to some edge cases in
      // Chrome. Let everything else assign the value attribute as normal.
      // https://github.com/facebook/react/issues/7253#issuecomment-236074326
      if (node.type !== 'number' || node.hasAttribute('value') === false) {
        node.setAttribute('value', '' + value);
      } else if (node.validity && !node.validity.badInput && node.ownerDocument.activeElement !== node) {
        // Don't assign an attribute if validation reports bad
        // input. Chrome will clear the value. Additionally, don't
        // operate on inputs that have focus, otherwise Chrome might
        // strip off trailing decimal places and cause the user's
        // cursor position to jump to the beginning of the input.
        //
        // In ReactDOMInput, we have an onBlur event that will trigger
        // this function again when focus is lost.
        node.setAttribute('value', '' + value);
      }
    }
  }
};

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

var NS = {
  xlink: 'http://www.w3.org/1999/xlink',
  xml: 'http://www.w3.org/XML/1998/namespace'
};

// We use attributes for everything SVG so let's avoid some duplication and run
// code instead.
// The following are all specified in the HTML config already so we exclude here.
// - class (as className)
// - color
// - height
// - id
// - lang
// - max
// - media
// - method
// - min
// - name
// - style
// - target
// - type
// - width
var ATTRS = {
  accentHeight: 'accent-height',
  accumulate: 0,
  additive: 0,
  alignmentBaseline: 'alignment-baseline',
  allowReorder: 'allowReorder',
  alphabetic: 0,
  amplitude: 0,
  arabicForm: 'arabic-form',
  ascent: 0,
  attributeName: 'attributeName',
  attributeType: 'attributeType',
  autoReverse: 'autoReverse',
  azimuth: 0,
  baseFrequency: 'baseFrequency',
  baseProfile: 'baseProfile',
  baselineShift: 'baseline-shift',
  bbox: 0,
  begin: 0,
  bias: 0,
  by: 0,
  calcMode: 'calcMode',
  capHeight: 'cap-height',
  clip: 0,
  clipPath: 'clip-path',
  clipRule: 'clip-rule',
  clipPathUnits: 'clipPathUnits',
  colorInterpolation: 'color-interpolation',
  colorInterpolationFilters: 'color-interpolation-filters',
  colorProfile: 'color-profile',
  colorRendering: 'color-rendering',
  contentScriptType: 'contentScriptType',
  contentStyleType: 'contentStyleType',
  cursor: 0,
  cx: 0,
  cy: 0,
  d: 0,
  decelerate: 0,
  descent: 0,
  diffuseConstant: 'diffuseConstant',
  direction: 0,
  display: 0,
  divisor: 0,
  dominantBaseline: 'dominant-baseline',
  dur: 0,
  dx: 0,
  dy: 0,
  edgeMode: 'edgeMode',
  elevation: 0,
  enableBackground: 'enable-background',
  end: 0,
  exponent: 0,
  externalResourcesRequired: 'externalResourcesRequired',
  fill: 0,
  fillOpacity: 'fill-opacity',
  fillRule: 'fill-rule',
  filter: 0,
  filterRes: 'filterRes',
  filterUnits: 'filterUnits',
  floodColor: 'flood-color',
  floodOpacity: 'flood-opacity',
  focusable: 0,
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontSizeAdjust: 'font-size-adjust',
  fontStretch: 'font-stretch',
  fontStyle: 'font-style',
  fontVariant: 'font-variant',
  fontWeight: 'font-weight',
  format: 0,
  from: 0,
  fx: 0,
  fy: 0,
  g1: 0,
  g2: 0,
  glyphName: 'glyph-name',
  glyphOrientationHorizontal: 'glyph-orientation-horizontal',
  glyphOrientationVertical: 'glyph-orientation-vertical',
  glyphRef: 'glyphRef',
  gradientTransform: 'gradientTransform',
  gradientUnits: 'gradientUnits',
  hanging: 0,
  horizAdvX: 'horiz-adv-x',
  horizOriginX: 'horiz-origin-x',
  ideographic: 0,
  imageRendering: 'image-rendering',
  'in': 0,
  in2: 0,
  intercept: 0,
  k: 0,
  k1: 0,
  k2: 0,
  k3: 0,
  k4: 0,
  kernelMatrix: 'kernelMatrix',
  kernelUnitLength: 'kernelUnitLength',
  kerning: 0,
  keyPoints: 'keyPoints',
  keySplines: 'keySplines',
  keyTimes: 'keyTimes',
  lengthAdjust: 'lengthAdjust',
  letterSpacing: 'letter-spacing',
  lightingColor: 'lighting-color',
  limitingConeAngle: 'limitingConeAngle',
  local: 0,
  markerEnd: 'marker-end',
  markerMid: 'marker-mid',
  markerStart: 'marker-start',
  markerHeight: 'markerHeight',
  markerUnits: 'markerUnits',
  markerWidth: 'markerWidth',
  mask: 0,
  maskContentUnits: 'maskContentUnits',
  maskUnits: 'maskUnits',
  mathematical: 0,
  mode: 0,
  numOctaves: 'numOctaves',
  offset: 0,
  opacity: 0,
  operator: 0,
  order: 0,
  orient: 0,
  orientation: 0,
  origin: 0,
  overflow: 0,
  overlinePosition: 'overline-position',
  overlineThickness: 'overline-thickness',
  paintOrder: 'paint-order',
  panose1: 'panose-1',
  pathLength: 'pathLength',
  patternContentUnits: 'patternContentUnits',
  patternTransform: 'patternTransform',
  patternUnits: 'patternUnits',
  pointerEvents: 'pointer-events',
  points: 0,
  pointsAtX: 'pointsAtX',
  pointsAtY: 'pointsAtY',
  pointsAtZ: 'pointsAtZ',
  preserveAlpha: 'preserveAlpha',
  preserveAspectRatio: 'preserveAspectRatio',
  primitiveUnits: 'primitiveUnits',
  r: 0,
  radius: 0,
  refX: 'refX',
  refY: 'refY',
  renderingIntent: 'rendering-intent',
  repeatCount: 'repeatCount',
  repeatDur: 'repeatDur',
  requiredExtensions: 'requiredExtensions',
  requiredFeatures: 'requiredFeatures',
  restart: 0,
  result: 0,
  rotate: 0,
  rx: 0,
  ry: 0,
  scale: 0,
  seed: 0,
  shapeRendering: 'shape-rendering',
  slope: 0,
  spacing: 0,
  specularConstant: 'specularConstant',
  specularExponent: 'specularExponent',
  speed: 0,
  spreadMethod: 'spreadMethod',
  startOffset: 'startOffset',
  stdDeviation: 'stdDeviation',
  stemh: 0,
  stemv: 0,
  stitchTiles: 'stitchTiles',
  stopColor: 'stop-color',
  stopOpacity: 'stop-opacity',
  strikethroughPosition: 'strikethrough-position',
  strikethroughThickness: 'strikethrough-thickness',
  string: 0,
  stroke: 0,
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeOpacity: 'stroke-opacity',
  strokeWidth: 'stroke-width',
  surfaceScale: 'surfaceScale',
  systemLanguage: 'systemLanguage',
  tableValues: 'tableValues',
  targetX: 'targetX',
  targetY: 'targetY',
  textAnchor: 'text-anchor',
  textDecoration: 'text-decoration',
  textRendering: 'text-rendering',
  textLength: 'textLength',
  to: 0,
  transform: 0,
  u1: 0,
  u2: 0,
  underlinePosition: 'underline-position',
  underlineThickness: 'underline-thickness',
  unicode: 0,
  unicodeBidi: 'unicode-bidi',
  unicodeRange: 'unicode-range',
  unitsPerEm: 'units-per-em',
  vAlphabetic: 'v-alphabetic',
  vHanging: 'v-hanging',
  vIdeographic: 'v-ideographic',
  vMathematical: 'v-mathematical',
  values: 0,
  vectorEffect: 'vector-effect',
  version: 0,
  vertAdvY: 'vert-adv-y',
  vertOriginX: 'vert-origin-x',
  vertOriginY: 'vert-origin-y',
  viewBox: 'viewBox',
  viewTarget: 'viewTarget',
  visibility: 0,
  widths: 0,
  wordSpacing: 'word-spacing',
  writingMode: 'writing-mode',
  x: 0,
  xHeight: 'x-height',
  x1: 0,
  x2: 0,
  xChannelSelector: 'xChannelSelector',
  xlinkActuate: 'xlink:actuate',
  xlinkArcrole: 'xlink:arcrole',
  xlinkHref: 'xlink:href',
  xlinkRole: 'xlink:role',
  xlinkShow: 'xlink:show',
  xlinkTitle: 'xlink:title',
  xlinkType: 'xlink:type',
  xmlBase: 'xml:base',
  xmlns: 0,
  xmlnsXlink: 'xmlns:xlink',
  xmlLang: 'xml:lang',
  xmlSpace: 'xml:space',
  y: 0,
  y1: 0,
  y2: 0,
  yChannelSelector: 'yChannelSelector',
  z: 0,
  zoomAndPan: 'zoomAndPan'
};

var SVGDOMPropertyConfig = {
  Properties: {},
  DOMAttributeNamespaces: {
    xlinkActuate: NS.xlink,
    xlinkArcrole: NS.xlink,
    xlinkHref: NS.xlink,
    xlinkRole: NS.xlink,
    xlinkShow: NS.xlink,
    xlinkTitle: NS.xlink,
    xlinkType: NS.xlink,
    xmlBase: NS.xml,
    xmlLang: NS.xml,
    xmlSpace: NS.xml
  },
  DOMAttributeNames: {}
};

Object.keys(ATTRS).forEach(function (key) {
  SVGDOMPropertyConfig.Properties[key] = 0;
  if (ATTRS[key]) {
    SVGDOMPropertyConfig.DOMAttributeNames[key] = ATTRS[key];
  }
});

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/**
 * Types of raw signals from the browser caught at the top level.
 */
var topLevelTypes = {
  topAbort: null,
  topAnimationEnd: null,
  topAnimationIteration: null,
  topAnimationStart: null,
  topBlur: null,
  topCanPlay: null,
  topCanPlayThrough: null,
  topChange: null,
  topClick: null,
  topCompositionEnd: null,
  topCompositionStart: null,
  topCompositionUpdate: null,
  topContextMenu: null,
  topCopy: null,
  topCut: null,
  topDoubleClick: null,
  topDrag: null,
  topDragEnd: null,
  topDragEnter: null,
  topDragExit: null,
  topDragLeave: null,
  topDragOver: null,
  topDragStart: null,
  topDrop: null,
  topDurationChange: null,
  topEmptied: null,
  topEncrypted: null,
  topEnded: null,
  topError: null,
  topFocus: null,
  topInput: null,
  topInvalid: null,
  topKeyDown: null,
  topKeyPress: null,
  topKeyUp: null,
  topLoad: null,
  topLoadedData: null,
  topLoadedMetadata: null,
  topLoadStart: null,
  topMouseDown: null,
  topMouseMove: null,
  topMouseOut: null,
  topMouseOver: null,
  topMouseUp: null,
  topPaste: null,
  topPause: null,
  topPlay: null,
  topPlaying: null,
  topProgress: null,
  topRateChange: null,
  topReset: null,
  topScroll: null,
  topSeeked: null,
  topSeeking: null,
  topSelectionChange: null,
  topStalled: null,
  topSubmit: null,
  topSuspend: null,
  topTextInput: null,
  topTimeUpdate: null,
  topTouchCancel: null,
  topTouchEnd: null,
  topTouchMove: null,
  topTouchStart: null,
  topTransitionEnd: null,
  topVolumeChange: null,
  topWaiting: null,
  topWheel: null
};

var EventConstants = {
  topLevelTypes: topLevelTypes
};

var reactProps = {
  children: true,
  dangerouslySetInnerHTML: true,
  key: true,
  ref: true,

  autoFocus: true,
  defaultValue: true,
  valueLink: true,
  defaultChecked: true,
  checkedLink: true,
  innerHTML: true,
  suppressContentEditableWarning: true,
  onFocusIn: true,
  onFocusOut: true
};

var propertyMap = {};

Object.keys(ARIADOMPropertyConfig.Properties).forEach(function (v) {
  propertyMap[v.toLowerCase()] = v;
});

Object.keys(HTMLDOMPropertyConfig.Properties).forEach(function (v) {
  propertyMap[v.toLowerCase()] = v;
});

Object.keys(SVGDOMPropertyConfig.DOMAttributeNames).forEach(function (v) {
  propertyMap[SVGDOMPropertyConfig.DOMAttributeNames[v]] = v;
});

Object.keys(EventConstants.topLevelTypes).map(function (v) {
  return v.replace(/^top/, 'on')
}).forEach(function (v) {
  propertyMap[v.toLowerCase()] = v;
});

Object.keys(reactProps).map(function (v) {
  propertyMap[v.toLowerCase()] = v;
});

/*  */

var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');


var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

/*  */



var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

var buildInTags = [
  COMMON.directive.component,
  COMMON.dynamicComponent.name,
  WEB.transition.component,
  WEB.transitionGroup.component,
  WEB.emptyComponent.component,
  WEB.inputComponent.component
];

var isBuildInTag = makeMap(buildInTags.join(','));



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function handleProps (props, tag) {
  var handledProps = {};
  if (typeof tag === 'string' && isReservedTag(tag)) {
    for (var key in props) {
      var prop = propertyMap[key.toLowerCase()];
      if (prop && props[key] !== undefined && key.indexOf(HELPER_HEADER) !== 0) {
        handledProps[prop] = props[key];
      }
    }
  } else {
    handledProps = props;
  }
  if (isUnaryTag(tag)) {
    delete handledProps.children;
  }
  return handledProps
}

function mergeProps () {
  var this$1 = this;

  var args = Array.prototype.slice.call(arguments, 0).filter(function (v) { return v; });
  var obj = {};
  args.forEach(function (o) {
    Object.keys(o).forEach(function (k) {
      if (!obj[k]) {
        obj[k] = [];
      }
      obj[k].push(o[k]);
    });
  });
  var loop = function ( k ) {
    var l = obj[k].length;
    if (l === 1) {
      obj[k] = obj[k][0];
    } else if (l > 1) {
      var _p = obj[k];
      if (typeof _p[0] === 'function') {
        obj[k] = function () {
          var arguments$1 = arguments;
          var this$1 = this;

          for (var i = 0; i < l; i++) {
            typeof _p[i] === 'function' && _p[i].apply(this$1, arguments$1);
          }
        }.bind(this$1);
      } else {
        obj[k] = obj[k][l - 1];
      }
    }
  };

  for (var k in obj) loop( k );
  return obj
}

/**
 * 
 */

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
      this._ref = null;
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

    ReactVueComponent.prototype.setRootRef = function setRootRef (ref) {
      if (ref) {
        ref = ref._ref || ref;
        this._ref = ref;
        this.vm.$el = this._ref;
      }
    };

    ReactVueComponent.prototype.setRef = function setRef (ref, text, inFor) {
      if (ref) {
        // for buildin component, we set ref to his hold node directly
        // it means the buildin componet would be the end of $refs chain
        ref = ref.vm || ref._ref || ref;
        if (inFor === true) {
          if (!this.vm.$refs[text]) {
            this.vm.$refs[text] = [];
          }
          this.vm.$refs[text].push(ref);
        } else {
          this.vm.$refs[text] = ref;
        }
        this.$refs = this.vm.$refs;
      }
    };

    ReactVueComponent.prototype.buildVM = function buildVM (options) {
      // set this property to prevent runtime error in vue
      render._withStripped = true;

      var vueOptions = {
        render: render,
        propsData: this.props,
        parent: this.context.owner ? this.context.owner.vm : undefined
      };

      var reactVueOptions = {
        reactVueSlots: getSlots(this.props.children),
        reactVueForceUpdate: this.forceUpdate.bind(this),
        reactVueCustomEvent: filterCustomEvent(this.props)
      };

      Object.assign(options, vueOptions, reactVueOptions);

      var vm = new Vue(options);

      vm.$options.directives = handleDirectives(vm.$options.directives);
      vm.$options.components = handleComponents(vm.$options.components);

      /**
       * for ignoredElements
       */
      Vue.config.ignoredElements.forEach(function (name) {
        var _name = pascalCaseTag(name);
        if (vm.$options.components[_name] === undefined) {
          vm.$options.components[_name] = name;
        }
      });

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

      this.vm.$nextTick(function () { return this$1.mounted.forEach(function (v) { return v.call(this$1.vm); }); });
    };
    ReactVueComponent.prototype.componentWillUpdate = function componentWillUpdate () {
      var this$1 = this;

      this.beforeUpdate.forEach(function (v) { return v.call(this$1.vm); });
    };
    ReactVueComponent.prototype.componentDidUpdate = function componentDidUpdate () {
      var this$1 = this;

      this.updated.forEach(function (v) { return v.call(this$1.vm); });
    };
    ReactVueComponent.prototype.componentWillUnmount = function componentWillUnmount () {
      var this$1 = this;

      this.beforeDestroy.forEach(function (v) { return v.call(this$1.vm); });
    };
    ReactVueComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
      this.vm._props && Object.assign(this.vm._props, nextProps);
      this.vm.$slots = getSlots(nextProps.children);
    };
    ReactVueComponent.prototype.shouldComponentUpdate = function shouldComponentUpdate (nextProps) {
      return isObjectShallowModified(this.props, nextProps)
    };
    ReactVueComponent.prototype.render = function render$1 () {
      return render ? render.call(this, this.vm._renderProxy) : null
    };

    return ReactVueComponent;
  }(Component));
  ReactVueComponent.childContextTypes = {
    owner: PropTypes.object
  };
  ReactVueComponent.contextTypes = {
    owner: PropTypes.object
  };

  ReactVueComponent.options = options;

  return ReactVueComponent
}

function buildMixin (Component) {
  return (function (Component) {
    function Mixin (props) {
      Component.call(this, props);
      /**
       * for vue, every component should have a ref to represent node element
       */
      this._ref = null;
    }

    if ( Component ) Mixin.__proto__ = Component;
    Mixin.prototype = Object.create( Component && Component.prototype );
    Mixin.prototype.constructor = Mixin;

    Mixin.prototype.setRef = function setRef (ref) {
      if (ref) {
        if (ref._reactInternalInstance && ref.vm === undefined) {
          this._ref = ref._ref || ref;
        } else {
          this._ref = ref.vm || ref;
        }
      }
    };

    Mixin.prototype.buildStateProps = function buildStateProps (props) {
      var this$1 = this;

      var stateProps = Object.assign({}, props);
      var originRef = stateProps.ref;
      stateProps.ref = function (ref) {
        this$1.setRef(ref);
        if (typeof originRef === 'function') {
          return originRef(ref)
        } else {
          return ref
        }
      };

      return stateProps
    };

    return Mixin;
  }(Component))
}

function triggerDirective (newData, oldData, vm, ref) {
  var directive, binding, args;

  var vnode = {
    context: vm
  };

  if (newData) {
    directive = vm.$options.directives[newData.directiveName];
  } else if (oldData) {
    directive = vm.$options.directives[oldData.directiveName];
  }

  if (!directive) {
    return
  }

  if (newData && oldData) { // update
    binding = {
      name: newData.name,
      value: newData.value,
      oldValue: oldData.value,
      expression: newData.expression,
      arg: newData.arg,
      modifiers: newData.modifiers
    };
    args = [ref, binding, vnode];
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
    args = [ref, binding, vnode];
    if (typeof directive === 'function') {
      directive.apply(vm, args);
    } else if (typeof directive.bind === 'function') {
      directive.bind.apply(vm, args);
    }
  } else if (!newData && oldData) { // unbind
    binding = {
      name: oldData.name,
      value: oldData.value,
      expression: oldData.expression,
      arg: oldData.arg,
      modifiers: oldData.modifiers
    };
    args = [ref, binding, vnode];
    if (typeof directive.unbind === 'function') {
      directive.unbind.apply(vm, args);
    }
  }
}

function buildDirective (Component, createElement) {
  return (function (superclass) {
    function Directive (props) {
      superclass.call(this, props);
      // set vm from parent context that
      // this.vm = props[COMMON.directive.context].vm
      this.state = {
        props: handleProps(props, props[COMMON.directive.tag])
      };
    }

    if ( superclass ) Directive.__proto__ = superclass;
    Directive.prototype = Object.create( superclass && superclass.prototype );
    Directive.prototype.constructor = Directive;
    Directive.prototype.setDirectiveLifeCycle = function setDirectiveLifeCycle (newProps, oldProps) {
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
              triggerDirective(newDirective, oldDirective, context.vm, this$1._ref); // update
            }
          });
        });
        newDirectivesClone.forEach(function (v) { // bind
          v && triggerDirective(v, null, context.vm, this$1._ref);
        });
        oldDirectivesClone.forEach(function (v) { // unbind
          v && triggerDirective(null, v, context.vm, this$1._ref);
        });
      }
    };
    Directive.prototype.getDirectiveName = function getDirectiveName (props) {
      if (props[COMMON.directive.name]) {
        return props[COMMON.directive.name].map(function (v) { return v.name; })
      } else {
        return []
      }
    };
    Directive.prototype.buildInHandle = function buildInHandle (props) {
      var this$1 = this;

      var names = this.getDirectiveName(props);
      var stateProps = this.buildStateProps(props);
      if (names.indexOf('model') !== -1) {
        var onChangeFn = stateProps.onChange || stateProps.onInput || function () {};
        stateProps.onChange = function (event) {
          this$1.setState({
            props: Object.assign({}, this$1.state.props, {
              value: event.target.value
            })
          });
          return onChangeFn(event)
        };
      }
      this.setState({
        props: handleProps(stateProps, props[COMMON.directive.tag])
      });
    };
    Directive.prototype.componentWillMount = function componentWillMount () {
      this.buildInHandle(this.props);
    };
    Directive.prototype.componentDidMount = function componentDidMount () {
      this.setDirectiveLifeCycle(this.props);
    };
    Directive.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
      this.buildInHandle(nextProps);
      this.setDirectiveLifeCycle(nextProps, this.props);
    };
    Directive.prototype.componentWillUnmount = function componentWillUnmount () {
      this.setDirectiveLifeCycle(null, this.props);
    };
    Directive.prototype.render = function render () {
      return createElement(this.props[COMMON.directive.tag], this.state.props, this.state.props.children)
    };

    return Directive;
  }(buildMixin.apply(this, arguments)))
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

function buildWebEmptyComponent (Component, createElement) {
  return (function (Component) {
    function EmptyComponent (props) {
      Component.call(this, props);
      this._ref = null;
      this.state = {
        props: {}
      };
    }

    if ( Component ) EmptyComponent.__proto__ = Component;
    EmptyComponent.prototype = Object.create( Component && Component.prototype );
    EmptyComponent.prototype.constructor = EmptyComponent;
    EmptyComponent.prototype.setRef = function setRef (ref) {
      this._ref = ref;
    };
    EmptyComponent.prototype.buildStateProps = function buildStateProps (props) {
      var this$1 = this;

      var stateProps = Object.assign({}, props);
      var originRef = stateProps.ref;
      stateProps.ref = function (ref) {
        this$1.setRef(ref);
        if (typeof originRef === 'function') {
          return originRef(ref)
        } else {
          return ref
        }
      };
      return stateProps
    };
    EmptyComponent.prototype.componentWillMount = function componentWillMount () {
      this.setState({
        props: this.buildStateProps(this.props)
      });
    };
    EmptyComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
      this.setState({
        props: this.buildStateProps(nextProps)
      });
    };
    EmptyComponent.prototype.unwrap = function unwrap (wrapper) {
      if (wrapper.parentNode) {
        var docFrag = document.createDocumentFragment();
        while (wrapper.firstChild) {
          var child = wrapper.removeChild(wrapper.firstChild);
          docFrag.appendChild(child);
        }
        wrapper.parentNode.replaceChild(docFrag, wrapper);
      }
    };
    EmptyComponent.prototype.componentDidMount = function componentDidMount () {
      // this.unwrap(this._ref)
    };
    EmptyComponent.prototype.componentDidUpdate = function componentDidUpdate () {
      // this.unwrap(this._ref)
    };
    EmptyComponent.prototype.render = function render () {
      var ref = this.state.props;
      var tag = ref.tag;
      var children = ref.children;
      return createElement(tag || 'view', this.state.props, children)
    };

    return EmptyComponent;
  }(Component))
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

/**
 * check whether animation should be updated
 * for performance it does not used for under component
 * but in the future we would be used
 * @param {Object} prev props
 * @param {Object} next props
 */
// function checkTransitionStateChanged (prev, next) {
//   let result = true
//   try {
//     const prevCollection = prev[WEB.transition.collection]
//     const nextCollection = next[WEB.transition.collection]
//     result = prevCollection.filter((pV, i) => {
//       const nV = nextCollection[i]
//       let result = false
//       if (pV.exp !== nV.exp ||
//         pV.index !== nV.index ||
//         pV.element.className !== nV.element.className ||
//         pV.element.style !== nV.element.style) {
//         result = true
//       }
//       return result
//     }).length > 0
//   } catch (e) {
//     result = true
//   }
//   return result
// }

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
  if (!expectsCSS && !userWantsControl && !onLeave) {
    _cb();
  }
}

function buildWebTransition (Component, createElement) {
  var EmptyComponent = buildWebEmptyComponent(Component, createElement);
  var Transition = (function (Component) {
    function Transition (props) {
      Component.call(this, props);
      this._ref = null;
      this._refs = {};
      this.transitionResolved = {};
      this._shouldComponentUpdateTransitionResult = false;
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
      this._ref = ref._ref || ref;
      this._refs[key] = this._ref;
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
        var tagKey = this.state.tagKey;
        var transition = this.state.transObj[tagKey];
        // someone want to hide and his prev state is show
        if (transition) {
          var transObj$1 = {};
          transObj$1[tagKey] = Object.assign({}, transition, {
            exp: transition.exp ? !transition.exp : transition.exp
          });
          return {
            animated: true,
            transObj: transObj$1,
            tagKey: tagKey
          }
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

      if (nextState) {
        this._shouldComponentUpdateTransitionResult =
          this._shouldComponentUpdateTransition(nextProps, nextState);
        this.setState(nextState);
      }

      if (this._shouldComponentUpdateTransitionResult) {
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
      }
    };

    Transition.prototype._shouldComponentUpdateTransition = function _shouldComponentUpdateTransition (nextProps, nextState) {
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

    Transition.prototype.resolveEnterTransition = function resolveEnterTransition (option) {
      enter.call(this, option);
    };

    Transition.prototype.resolveLeaveTransition = function resolveLeaveTransition (option) {
      leave.call(this, option);
    };

    Transition.prototype.componentDidUpdate = function componentDidUpdate (prevProps, prevState) {
      var this$1 = this;

      if (this.state.animated === false ||
        this._shouldComponentUpdateTransitionResult === false) {
        return
      }
      if (this.state.tagKey === prevState.tagKey) { // same element
        var ref = this._refs[this.state.tagKey];
        var transition = this.state.transObj[this.state.tagKey];
        if (ref && transition) {
          if (transition.type === 'show') {
            ref.style.display = '';
            if (transition.exp === false) {
              this.resolveLeaveTransition({
                el: ref,
                cb: function () {
                  ref.style.display = 'none';
                }
              });
            } else if (transition.exp === true) {
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
      var tag = this.props.tag || EmptyComponent;
      return createElement(tag, null, Object.keys(transObj).map(function (k) {
        var type = transObj[k].element.type;
        var props = transObj[k].props;
        var children = props.children;
        return createElement(type, props, children)
      }))
    };

    return Transition;
  }(Component));
  return Transition
}

function buildInputComponent (Component, createElement) {
  return (function (superclass) {
    function Input (props) {
      superclass.call(this, props);
      this.state = {
        props: {}
      };
    }

    if ( superclass ) Input.__proto__ = superclass;
    Input.prototype = Object.create( superclass && superclass.prototype );
    Input.prototype.constructor = Input;
    Input.prototype.buildStateProps = function buildStateProps (props) {
      var this$1 = this;

      var stateProps = superclass.prototype.buildStateProps.call(this, props);

      var onChangeFn = stateProps.onChange || stateProps.onInput || function () {};
      stateProps.onChange = function (event) {
        this$1.setState({
          props: Object.assign({}, this$1.state.props, {
            value: event.target.value
          })
        });
        return onChangeFn(event)
      };

      return handleProps(stateProps, props[WEB.inputComponent.tag])
    };
    Input.prototype.setStateProps = function setStateProps (props) {
      var stateProps = this.buildStateProps(props);
      this.setState({
        props: stateProps
      });
    };
    Input.prototype.componentWillMount = function componentWillMount () {
      this.setStateProps(this.props);
    };
    Input.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
      this.setStateProps(nextProps);
    };
    Input.prototype.render = function render () {
      return createElement(this.props[WEB.inputComponent.tag], this.state.props, this.state.props.children)
    };

    return Input;
  }(buildMixin.apply(this, arguments)))
}

var buildWebInputComponent = buildInputComponent;

function buildNativeComponent (render, options, config) {
  var Component = config.Component;
  var PropTypes = config.PropTypes;
  var Vue = config.Vue;
  var ReactNative = config.ReactNative;
  var css = config.css;
  if (!Vue.ReactNativeInjected) {
    Vue.ReactNativeInjected = true;
    Object.keys(ReactNative).map(function (k) {
      if (/^[A-Z]/.test(k)) {
        try {
          Vue.component(k, ReactNative[k]);
        } catch (e) {}
      }
    });
  }
  var ReactVueComponent = (function (Component) {
    function ReactVueComponent (props) {
      Component.call(this, props);
      this._ref = null;
      this.eventOnceUid = [];
      this.newDirectiveData = {};
      this.oldDirectiveData = {};
      this.vm = {};
      this.beforeMount = [];
      this.mounted = [];
      this.beforeUpdate = [];
      this.updated = [];
      this.beforeDestroy = [];
      this.css = ReactNative.StyleSheet.create(css);
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

    ReactVueComponent.prototype.setRootRef = function setRootRef (ref) {
      if (ref) {
        ref = ref._ref || ref;
        this._ref = ref;
        this.vm.$el = this._ref;
      }
    };

    ReactVueComponent.prototype.setRef = function setRef (ref, text, inFor) {
      if (ref) {
        // for buildin component, we set ref to his hold node directly
        // it means the buildin componet would be the end of $refs chain
        ref = ref.vm || ref._ref || ref;
        if (inFor === true) {
          if (!this.vm.$refs[text]) {
            this.vm.$refs[text] = [];
          }
          this.vm.$refs[text].push(ref);
        } else {
          this.vm.$refs[text] = ref;
        }
        this.$refs = this.vm.$refs;
      }
    };

    ReactVueComponent.prototype.buildVM = function buildVM (options) {
      // set this property to prevent runtime error in vue
      render._withStripped = true;

      var vueOptions = {
        render: render,
        propsData: this.props,
        parent: this.context.owner ? this.context.owner.vm : undefined
      };

      var reactVueOptions = {
        reactVueSlots: getSlots(this.props.children),
        reactVueForceUpdate: this.forceUpdate.bind(this),
        reactVueCustomEvent: filterCustomEvent(this.props)
      };

      Object.assign(options, vueOptions, reactVueOptions);

      var vm = new Vue(options);

      vm.$options.directives = handleDirectives(vm.$options.directives);
      vm.$options.components = handleComponents(vm.$options.components);

      /**
       * for ignoredElements
       */
      Vue.config.ignoredElements.forEach(function (name) {
        var _name = pascalCaseTag(name);
        if (vm.$options.components[_name] === undefined) {
          vm.$options.components[_name] = name;
        }
      });

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

      setTimeout(function () {
        this$1.mounted.forEach(function (v) { return v.call(this$1.vm); });
      }, 0);
    };
    ReactVueComponent.prototype.componentWillUpdate = function componentWillUpdate () {
      var this$1 = this;

      this.beforeUpdate.forEach(function (v) { return v.call(this$1.vm); });
    };
    ReactVueComponent.prototype.componentDidUpdate = function componentDidUpdate () {
      var this$1 = this;

      this.updated.forEach(function (v) { return v.call(this$1.vm); });
    };
    ReactVueComponent.prototype.componentWillUnmount = function componentWillUnmount () {
      var this$1 = this;

      this.beforeDestroy.forEach(function (v) { return v.call(this$1.vm); });
    };
    ReactVueComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
      this.vm._props && Object.assign(this.vm._props, nextProps);
      this.vm.$slots = getSlots(nextProps.children);
    };
    ReactVueComponent.prototype.shouldComponentUpdate = function shouldComponentUpdate (nextProps) {
      return isObjectShallowModified(this.props, nextProps)
    };
    ReactVueComponent.prototype.render = function render$1 () {
      return render ? render.call(this, this.vm._renderProxy) : null
    };

    return ReactVueComponent;
  }(Component));
  ReactVueComponent.childContextTypes = {
    owner: PropTypes.object
  };
  ReactVueComponent.contextTypes = {
    owner: PropTypes.object
  };

  ReactVueComponent.options = options;

  return ReactVueComponent
}

exports.platformDirectives = index;
exports.renderList = renderList;
exports.renderSlot = renderSlot;
exports.bindWebClass = bindWebClass;
exports.bindNativeClass = bindNativeClass;
exports.bindWebStyle = bindWebStyle;
exports.bindNativeStyle = bindNativeStyle;
exports.checkKeyCodes = checkKeyCodes;
exports.template = template;
exports.event = event;
exports.mergeCssModule = mergeCssModule;
exports.dynamicComponent = dynamicComponent;
exports.resolveFilter = resolveFilter;
exports.handleProps = handleProps;
exports.mergeProps = mergeProps;
exports.isUndef = isUndef;
exports.isDef = isDef;
exports.isTrue = isTrue;
exports.isPrimitive = isPrimitive;
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports._toString = _toString;
exports.toNumber = toNumber;
exports.makeMap = makeMap;
exports.isBuiltInTag = isBuiltInTag;
exports.remove = remove;
exports.hasOwn = hasOwn;
exports.cached = cached;
exports.camelize = camelize;
exports.capitalize = capitalize;
exports.hyphenate = hyphenate;
exports.bind = bind;
exports.toArray = toArray;
exports.extend = extend;
exports.toObject = toObject;
exports.noop = noop;
exports.no = no;
exports.identity = identity;
exports.genStaticKeys = genStaticKeys;
exports.looseEqual = looseEqual;
exports.looseIndexOf = looseIndexOf;
exports.once = once;
exports.buildComponent = buildComponent;
exports.buildDirective = buildDirective;
exports.buildWebTransition = buildWebTransition;
exports.buildWebEmptyComponent = buildWebEmptyComponent;
exports.buildWebInputComponent = buildWebInputComponent;
exports.buildNativeComponent = buildNativeComponent;
