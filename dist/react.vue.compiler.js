/*!
 * Vue.js v2.2.6
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deindent = _interopDefault(require('de-indent'));
var he = require('he');
var changeCase = _interopDefault(require('change-case'));

/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining






/**
 * Check if value is primitive
 */


/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */


/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */


/**
 * Convert a value to a string that is actually rendered.
 */


/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */


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


/**
 * Check whether the object has the property.
 */


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


/**
 * Hyphenate a camelCase string.
 */


/**
 * Simple bind, faster than native
 */


/**
 * Convert an Array-like object to a real Array.
 */


/**
 * Mix properties into target object.
 */


/**
 * Merge an Array of Objects into a single Object.
 */


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


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */




/**
 * Ensure a function is called only once.
 */

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
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

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

var singleAttrIdentifier = /([^\s"'<>/=]+)/;
var singleAttrAssign = /(?:=)/;
var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
];
var attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
);

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue
        }
      }

      var text = (void 0), rest$1 = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest$1 = html.slice(textEnd);
        while (
          !endTag.test(rest$1) &&
          !startTagOpen.test(rest$1) &&
          !comment.test(rest$1) &&
          !conditionalComment.test(rest$1)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest$1.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest$1 = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var endTagLength = 0;
      var rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest.length;
      html = rest;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' &&
            (i > pos || !tagName) &&
            options.warn) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var splitRE = /\r?\n/g;
var replaceRE = /./g;
var isSpecialTag = makeMap('script,style,template', true);



/**
 * Parse a single-file component (*.vue) file into an SFC Descriptor Object.
 */
function parseComponent (
  content,
  options
 ) {
  if ( options === void 0 ) options = {};

  var sfc = {
    template: null,
    script: null,
    styles: [],
    customBlocks: []
  };
  var depth = 0;
  var currentBlock = null;

  function start (
    tag,
    attrs,
    unary,
    start,
    end
  ) {
    if (depth === 0) {
      currentBlock = {
        type: tag,
        content: '',
        start: end,
        attrs: attrs.reduce(function (cumulated, ref) {
          var name = ref.name;
          var value = ref.value;

          cumulated[name] = value || true;
          return cumulated
        }, Object.create(null))
      };
      if (isSpecialTag(tag)) {
        checkAttrs(currentBlock, attrs);
        if (tag === 'style') {
          sfc.styles.push(currentBlock);
        } else {
          sfc[tag] = currentBlock;
        }
      } else { // custom blocks
        sfc.customBlocks.push(currentBlock);
      }
    }
    if (!unary) {
      depth++;
    }
  }

  function checkAttrs (block, attrs) {
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (attr.name === 'lang') {
        block.lang = attr.value;
      }
      if (attr.name === 'scoped') {
        block.scoped = true;
      }
      if (attr.name === 'module') {
        block.module = attr.value || true;
      }
      if (attr.name === 'src') {
        block.src = attr.value;
      }
    }
  }

  function end (tag, start, end) {
    if (depth === 1 && currentBlock) {
      currentBlock.end = start;
      var text = deindent(content.slice(currentBlock.start, currentBlock.end));
      // pad content so that linters and pre-processors can output correct
      // line numbers in errors and warnings
      if (currentBlock.type !== 'template' && options.pad) {
        text = padContent(currentBlock, options.pad) + text;
      }
      currentBlock.content = text;
      currentBlock = null;
    }
    depth--;
  }

  function padContent (block, pad) {
    if (pad === 'space') {
      return content.slice(0, block.start).replace(replaceRE, ' ')
    } else {
      var offset = content.slice(0, block.start).split(splitRE).length;
      var padChar = block.type === 'script' && !block.lang
        ? '//\n'
        : '\n';
      return Array(offset).join(padChar)
    }
  }

  parseHTML(content, {
    start: start,
    end: end
  });

  return sfc
}

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return (value + "=" + assignment)
  } else {
    return "var $$exp = " + (modelRs.exp) + ", $$idx = " + (modelRs.idx) + ";" +
      "if (!Array.isArray($$exp)){" +
        value + "=" + assignment + "}" +
      "else{$$exp.splice($$idx, 1, " + assignment + ")}"
  }
}

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var len;
var str;
var chr;
var index;
var expressionPos;
var expressionEndPos;

function parseModel (val) {
  str = val;
  len = str.length;
  index = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    }
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index)
}

function eof () {
  return index >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

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

var warn$1 = noop;
var tip = noop;
var formatComponentName;

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn$1 = function (msg, vm) {
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
      warn$1(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
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

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    process.env.NODE_ENV !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }
  var events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr (el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  return val
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn = options.warn || baseWarn;
  platformGetTagNamespace = options.getTagNamespace || no;
  platformMustUseProp = options.mustUseProp || no;
  platformIsPreTag = options.isPreTag || no;
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  transforms = pluckModuleFunction(options.modules, 'transformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        process.env.NODE_ENV !== 'production' && warn(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processComponent(element);
        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
          transforms[i$1](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints (el) {
        if (process.env.NODE_ENV !== 'production') {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if (process.env.NODE_ENV !== 'production') {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
          currentParent.tag === 'textarea' &&
          currentParent.attrsMap.placeholder === text) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if (process.env.NODE_ENV !== 'production' && el.tag === 'template') {
      warn("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      process.env.NODE_ENV !== 'production' && warn(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if (process.env.NODE_ENV !== 'production' && children[i].text !== ' ') {
        warn(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    }
    if (el.tag === 'template') {
      el.slotScope = getAndRemoveAttr(el, 'scope');
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (process.env.NODE_ENV !== 'production') {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      process.env.NODE_ENV !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

var TAB_INDENT = '    ';
var CREATE_ELEMENT = 'createElement';
var COMPONENT = 'Component';
var HELPER_HEADER = '__react__vue__';
var RENDER_HELPER_MODULE_NAME = 'react-vue-helper';

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

var NATIVE = {};

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



var isUnaryTag$1 = makeMap(
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

var isBuildInTag = makeMap(
  ((COMMON.directive.component) + "," + (WEB.transition.component) + "," + (WEB.transitionGroup.component) + "," + (COMMON.dynamicComponent.name))
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function specialObserver (obj, cb) {
  var loop = function ( key ) {
    var val = obj[key];
    if (typeof val === 'string') {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function get () {
          cb && cb(obj);
          return val
        }
      });
    } else {
      specialObserver(val, cb);
    }
  };

  for (var key in obj) loop( key );
}

var BaseGenerator = function BaseGenerator (ast, options) {
  this.ast = ast;
  this.level = options.level;
  this.variableDependency = [];
  this.slots = [];
  this.vueConfig = options.vueConfig || {};
  this.uid = 0;

  specialObserver(COMMON, this.setVariableDependency.bind(this));
  specialObserver(WEB, this.setVariableDependency.bind(this));
  specialObserver(NATIVE, this.setVariableDependency.bind(this));
};

BaseGenerator.prototype.setSlots = function setSlots (name) {
  if (this.slots.indexOf(name) === -1) {
    this.slots.push(name);
  }
};

BaseGenerator.prototype.setVariableDependency = function setVariableDependency (variable) {
  if (this.variableDependency.indexOf(variable) === -1) {
    this.variableDependency.push(variable);
  }
};

BaseGenerator.prototype.generate = function generate () {
  var coreCode = this.genElement(this.ast, this.level);
  var importDep = this.genDependence();
  var render = coreCode.trim();
  var slot = '';
  render = "return " + render;
  if (this.slots.length) {
    slot = "const " + (COMMON.renderSlot.value) + " = " + (COMMON.renderSlot.name) + "([" + (this.slots.join(',')) + "], this.props.children)";
    render = slot + "\n" + render;
  }
  return {
    import: importDep,
    render: render,
    code: (importDep + " export default function render (vm) {" + render + "}")
  }
};

BaseGenerator.prototype.genDependence = function genDependence () {
  var code = "";
  var helperDependency = this.variableDependency
    .filter(function (v) { return v !== COMMON.createElement && v !== COMMON.component && v.alias; });
  if (helperDependency.length) {
    code += 'import { ';
    code += helperDependency.map(function (v) { return ((v.alias) + " as " + (v.name)); }).join(',');
    code += " } from '" + RENDER_HELPER_MODULE_NAME + "'\n";
  }
  code += "import {\n      " + (COMMON.createElement.alias) + " as " + (COMMON.createElement.name) + ",\n      " + (COMMON.component.alias) + " as " + (COMMON.component.name) + "\n    } from 'react'\n";
  if (this.variableDependency.indexOf(COMMON.directive) !== -1) {
    code += "const " + (COMMON.directive.component) + " = " + (COMMON.directive.name) + "(" + (COMMON.component.name) + ", " + (COMMON.createElement.name) + ");";
  }
  if (this.variableDependency.indexOf(WEB.transition) !== -1) {
    code += "const " + (WEB.transition.component) + " = " + (WEB.transition.name) + "(" + (COMMON.component.name) + ", " + (COMMON.createElement.name) + ");";
  }
  if (this.variableDependency.indexOf(WEB.transitionGroup) !== -1) {
    code += "const " + (WEB.transitionGroup.component) + " = " + (WEB.transitionGroup.name) + "(" + (COMMON.component.name) + ", " + (COMMON.createElement.name) + ");";
  }
  return code
};

var RenderGenerator = (function (BaseGenerator$$1) {
  function RenderGenerator () {
    BaseGenerator$$1.apply(this, arguments);
  }

  if ( BaseGenerator$$1 ) RenderGenerator.__proto__ = BaseGenerator$$1;
  RenderGenerator.prototype = Object.create( BaseGenerator$$1 && BaseGenerator$$1.prototype );
  RenderGenerator.prototype.constructor = RenderGenerator;

  RenderGenerator.prototype.genElement = function genElement (ast, level) {
    // text
    if (ast.type === 3) {
      return this.genText(ast, level)
    }

    // text expression
    if (ast.type === 2) {
      return this.genTextExpression(ast, level)
    }

    // for
    if (ast.for && !ast.forProcessed) {
      return this.genFor(ast, level)
    }

    // if condition
    if (ast.if && !ast.ifProcessed) {
      return this.genIf(ast, level)
    }

    if (ast.tag === 'slot') {
      return this.genSlot(ast, level)
    }

    if (ast.tag === 'template') {
      return this.genTemplate(ast, level)
    }

    if (ast.tag === 'transition') {
      return this.genTransition(ast, level)
    }

    if (ast.tag === 'transition-group') {
      return this.genTransitionGroup(ast, level)
    }

    var s = (COMMON.createElement.name) + "(";
    var e = ")";
    s = this.genFormat(s, level);
    e = this.genFormat(e, level);

    var tag = this.genTag(ast);
    if (Array.isArray(ast.directives) && ast.directives.length) {
      tag = COMMON.directive.component;
    }
    if (ast.tag === 'component') {
      tag = (COMMON.dynamicComponent.name) + "(vm, " + (ast.component) + ")";
    }
    tag = this.genFormat(tag, level + 1);

    var props = this.genProps(ast, level + 1);
    if (props.length) {
      props = "{" + (props.join(',')) + (this.genFormat('}', level + 1));
    } else {
      props = 'null';
    }
    if (ast.parent === undefined) {
      props = "Object.assign({}, this.props." + HELPER_HEADER + "nativeEvents, " + props + ")";
    }
    props = "," + (this.genFormat(props, level + 1));

    var children = this.genChildren(ast, level + 1);
    if (children.length) {
      children = "," + (children.join(','));
    }

    if (isUnaryTag$1(ast.tag)) {
      return ("" + s + tag + props + e + children)
    }

    return ("" + s + tag + props + children + e)
  };

  /**
   * gen children, include slot template generate
   * @param {Object} ast
   * @param {Number} level
   */
  RenderGenerator.prototype.genChildren = function genChildren (ast, level) {
    var this$1 = this;

    var children = [];
    if (ast.children && ast.children.length) {
      children = children.concat(ast.children.map(function (v) {
        return this$1.genElement(v, level)
      }));
    }
    if (ast.scopedSlots) {
      children = children.concat(Object.keys(ast.scopedSlots)
        .map(function (v) { return ast.scopedSlots[v]; })
        .map(function (v) {
          var slotCode = this$1.genElement(v, level + 2) || '';
          var slotScope = v.slotScope;
          var render = "render: (" + slotScope + ") => " + (this$1.genFormat(slotCode.trim(), level + 2));
          var type = "type: '" + (COMMON.template.type) + "'";
          var slot = "'data-slot': " + (v.slotTarget);
          var code = "{" + (this$1.genFormat(type, level + 1)) + "," + (this$1.genFormat(render, level + 1)) + "," + (this$1.genFormat(slot, level + 1)) + "}";
          return this$1.genFormat(code, level)
        }));
    }
    return children
  };

  /**
   * gen text expression
   * @param {Object} ast
   * @param {Number} level
   */
  RenderGenerator.prototype.genTextExpression = function genTextExpression (ast, level) {
    var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
    var text = ast.text.replace(defaultTagRE, ("${" + (COMMON.toString.name) + "(" + ('$1') + ")}")).trim();
    return this.genFormat(("`" + text + "`"), level)
  };

  /**
   * gen text
   * @param {Object} ast
   * @param {Number} level
   */
  RenderGenerator.prototype.genText = function genText (ast, level) {
    var text = ast.text;
    return this.genFormat('`' + text + '`', level)
  };

  /**
   * gen if condition
   * @param {Object} ast
   * @param {Number} level
   */
  RenderGenerator.prototype.genIf = function genIf (ast, level) {
    ast.ifProcessed = true;
    return this.genIfConditions(ast.ifConditions.slice(), level)
  };

  RenderGenerator.prototype.genIfConditions = function genIfConditions (conditions, level) {
    if (!conditions.length) {
      return 'null'
    }
    var condition = conditions.shift();
    var code;
    if (condition.exp) {
      code = "(" + (condition.exp) + ") ?" + (this.genElement(condition.block, level + 1)) + " : " + (this.genIfConditions(conditions, level + 1));
    } else {
      code = "" + (this.genElement(condition.block));
    }
    return this.genFormat(code, level)
  };

  /**
   * gen for
   * @param {Object} ast
   * @param {Number} level
   */
  RenderGenerator.prototype.genFor = function genFor (ast, level) {
    var exp = ast.for;
    var alias = ast.alias;
    var iterator1 = ast.iterator1 ? ("," + (ast.iterator1)) : '';
    var iterator2 = ast.iterator2 ? ("," + (ast.iterator2)) : '';

    ast.forProcessed = true;

    var code = (COMMON.renderList.name) + "(" + exp + ", function (" + alias + iterator1 + iterator2 + "){return " + (this.genElement(this.genKeyFor(ast))) + "}.bind(this))";
    return this.genFormat(code, level)
  };

  /**
   * gen slot
   * @param {Object} ast
   * @param {Number} level
   */
  RenderGenerator.prototype.genSlot = function genSlot (ast, level) {
    var name = ast.slotName;
    var props = [];
    this.setSlots(ast.slotName);
    if (Array.isArray(ast.attrs)) {
      ast.attrs.forEach(function (v) {
        props.push(((v.name) + ": " + (v.value)));
      });
    }
    var code = (COMMON.renderSlot.value) + "(" + name + ", {" + (props.join(',')) + "})";
    // if (name === undefined) {
    //   code += ` ||${this.genChildren(ast, level + 1)}`
    // }
    var children = this.genChildren(ast, level + 1);
    if (children.length) {
      code += " || " + (children.join(','));
    }
    return this.genFormat(code, level)
  };

  /**
   * gen a empty component
   * @param {Object} ast
   * @param {Number} level
   */
  RenderGenerator.prototype.genTemplate = function genTemplate (ast, level) {
    ast.children.forEach(function (v, i) {
      v.attrs = v.attrs || [];
      v.attrs.push({
        name: 'key',
        value: String(i)
      });
    });
    var children = this.genChildren(ast, level + 1);
    return ("[" + (children.join(',')) + "]")
  };

  /**
   * gen transition helper, this function would be override by sub class
   * @param {Object} ast
   * @param {Number} level
   */
  RenderGenerator.prototype.genTransition = function genTransition (ast, level) {
    return this.genChildren(ast, level)
  };

  /**
   * gen transition group helper, this function would be override by sub class
   * @param {Object} ast
   * @param {Number} level
   */
  RenderGenerator.prototype.genTransitionGroup = function genTransitionGroup (ast, level) {
    return this.genChildren(ast, level)
  };

  /**
   * gen props, this funciton would be override by sub class
   * @param {Object} ast
   * @param {Number} level
   */
  RenderGenerator.prototype.genProps = function genProps (ast, level) {
    var this$1 = this;

    var code = [];
    if (Array.isArray(ast.directives)) {
      var directives = this.genDirectives(ast);
      if (directives) {
        directives = this.genFormat(directives, level + 1);
        code.push(directives);
      }
      var directiveTag = this.genDirectiveTag(ast);
      if (directiveTag) {
        directiveTag = this.genFormat(directiveTag, level + 1);
        code.push(directiveTag);
      }
      var directiveContext = this.genDirectiveContext(ast);
      if (directiveContext) {
        directiveContext = this.genFormat(directiveContext, level + 1);
        code.push(directiveContext);
      }
    }
    if (ast.slotTarget !== undefined) {
      this.genSlotTarget(ast);
    }
    if (ast.ref || ast.parent === undefined) {
      var ref = this.genRef(ast);
      if (ref) {
        ref = this.genFormat(ref, level + 1);
        code.push(ref);
      }
    }
    if (ast.key !== undefined) {
      var key = this.genKey(ast);
      if (key) {
        key = this.genFormat(key, level + 1);
        code.push(key);
      }
    }
    if (Array.isArray(ast.attrs)) {
      var props = (ast.attrs
        .filter(function (v) {
          return v.name !== 'class' && v.name !== 'style'
        })
        .map(function (v) {
          var value = v.value;
          var name = v.name;
          if (name.indexOf('data-') === 0 || name.indexOf(HELPER_HEADER) === 0) {
            return ("'" + name + "': " + value)
          }
          if (name === 'for') {
            name = 'htmlFor';
          }
          if (isBooleanAttr(name)) {
            if (value === '""') {
              value = 'true';
            }
          }
          return ((changeCase.camelCase(name)) + ": " + value)
        })
        .map(function (v) {
          return this$1.genFormat(v, level + 1)
        }));
      code = code.concat(props);
    }
    return code
  };

  /**
   * gen common directive, this function would be override by SubClass
   */
  RenderGenerator.prototype.genDirectives = function genDirectives (ast) {
    var code = '';
    ast.directives.forEach(function (v) {
      code += "{name:\"" + (v.name) + "\",rawName:\"" + (v.rawName) + "\"" + (v.value ? (",value:(" + (v.value) + "),expression:" + (JSON.stringify(v.value))) : '') + (v.arg ? (",arg:\"" + (v.arg) + "\"") : '') + (v.modifiers ? (",modifiers:" + (JSON.stringify(v.modifiers))) : '') + "},";
    });
    code = (COMMON.directive.name) + ": [" + code + "]";
    return code
  };

  RenderGenerator.prototype.genDirectiveTag = function genDirectiveTag (ast) {
    var code = '';
    code += (COMMON.directive.tag) + ": " + (this.genTag(ast));
    return code
  };

  RenderGenerator.prototype.genDirectiveContext = function genDirectiveContext (ast) {
    var code = '';
    code += (COMMON.directive.context) + ": this";
    return code
  };

  /**
   * gen slot props
   * @param {Object} ast
   */
  RenderGenerator.prototype.genSlotTarget = function genSlotTarget (ast) {
    ast.attrs = ast.attrs || [];
    ast.attrs.push({
      name: 'data-slot',
      value: ast.slotTarget
    });
  };

  RenderGenerator.prototype.genKey = function genKey (ast) {
    return ("key: " + (ast.key))
  };

  /**
   * gen key in for iterator
   * @param {Object} ast
   */
  RenderGenerator.prototype.genKeyFor = function genKeyFor (ast) {
    if (!ast.key) {
      var obj = {};
      obj.name = 'key';
      obj.value = 'arguments[1]';
      ast.attrs = ast.attrs || [];
      ast.attrs.push(obj);
    }
    return ast
  };

  /**
   * gen ref
   */
  RenderGenerator.prototype.genRef = function genRef (ast) {
    var code1 = '';
    var code2 = '';
    if (ast.ref) {
      code1 = "this.setRef(ref, " + (ast.ref) + ", " + (ast.refInFor) + ");";
    }
    if (ast.parent === undefined) {
      code2 = "this.props['" + (COMMON.setRef.name) + "'] && this.props['" + (COMMON.setRef.name) + "'](ref);";
    }
    return ("ref: (ref) => {\n      " + code1 + code2 + "\n    }")
  };

  /**
   * format single row
   * @param {String} code
   * @param {Number} level
   */
  RenderGenerator.prototype.genFormat = function genFormat (code, level) {
    if (level) {
      return ("\n" + (TAB_INDENT.repeat(level)) + code)
    } else {
      return code
    }
  };

  /**
   * generate react tag, this funciton would be override by sub class
   * @param {String} tag
   */
  RenderGenerator.prototype.genTag = function genTag (ast) {
    return ast.tag
  };

  return RenderGenerator;
}(BaseGenerator));

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;
var EVENT_ACTION = ['composition', 'key', 'context', 'double', 'drag', 'mouse', 'touch', 'can', 'play', 'duration', 'loaded', 'meta', 'load', 'rate', 'time', 'volume', 'animation', 'transition'];

var addSeparateLine = function (eventName) {
  EVENT_ACTION.forEach(function (v) {
    eventName = eventName.replace(v, v + '-');
  });
  return eventName
};

var uid = 0;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  options
) {
  var res = '';
  if (options.keyCodes) {
    keyCodes = Object.assign({}, keyCodes, options.keyCodes);
  }
  for (var name in events) {
    var handler = events[name];
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if (process.env.NODE_ENV !== 'production' &&
        name === 'click' &&
        handler && handler.modifiers && handler.modifiers.right
      ) {
      console.warn(
        "Use \"contextmenu\" instead of \"click.right\" since right clicks " +
        "do not actually fire \"click\" events."
      );
    }
    if (name.indexOf('!') === 0 || name.indexOf('~!') === 0) {
      name += 'Capture';
    }
    var eventHandler = genHandler(name, handler);
    if (name.indexOf('~') === 0) {
      eventHandler = "this.setEventOnce(function once_" + (++uid) + "(event){(" + eventHandler + ")(event)})";
    }
    eventHandler = (COMMON.event.name) + "(" + eventHandler + ")";
    res += "on" + (changeCase.pascalCase(addSeparateLine(name))) + ": " + eventHandler + ",";
  }
  return res
}

function genHandler (
  name,
  handler,
  options
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("({nativeEvent: $event}) => {" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("({nativeEvent: $event}) => {" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var alias = keyCodes[key];
  return ((COMMON.checkKeyCodes.name) + "($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
}

function parseStyleText (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[changeCase.camelCase(tmp[0].trim())] = tmp[1].trim());
    }
  });
  return res
}

/*  */

function model (
  el,
  dir,
  warn
) {
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (process.env.NODE_ENV !== 'production') {
    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn(
        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
        "v-model does not support dynamic input types. Use v-if branches instead."
      );
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addAttr(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?" + (COMMON.looseIndexOf.name) + "(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":" + (COMMON.looseEqual.name) + "(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        "$$el=$event.target," +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    "if(Array.isArray($$a)){" +
      "var $$v=" + (number ? COMMON.toNumber.name + '(' + valueBinding + ')' : valueBinding) + "," +
          "$$i=" + (COMMON.looseIndexOf.name) + "($$a,$$v);" +
      "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ((COMMON.toNumber.name) + "(" + valueBinding + ")") : valueBinding;
  addAttr(el, 'checked', ((COMMON.looseEqual.name) + "(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? COMMON.toNumber.name + '(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addAttr(el, 'value', ("(" + value + ") == null ? '' : (" + value + ")"));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = (COMMON.toNumber.name) + "(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addAttr(el, 'value', ("(" + value + ") == null ? '' : (" + value + ")"));
  if (lazy) {
    addHandler(el, 'blur', code, null, true);
  } else {
    addHandler(el, 'change', code, null, true);
  }
  if (trim || number || type === 'number') {
    addHandler(el, 'blur', 'this.forceUpdate()');
  }
}

function html (ast, level) {
  var obj = {};
  var directive = ast.directives.filter(function (v) { return v.name === 'html'; })[0];
  obj.name = 'dangerouslySetInnerHTML';
  obj.value = "{__html: '" + (directive.value) + "'}";
  ast.attrs = ast.attrs || [];
  ast.attrs.push(obj);
}

function text (ast) {
  var children = [];
  var directive = ast.directives.filter(function (v) { return v.name === 'text'; })[0];
  children.push({
    type: 2,
    text: ("{{ " + (directive.value) + " }}")
  });
  ast.children = children;
}

var ReactWebRenderGenerator = (function (RenderGenerator$$1) {
  function ReactWebRenderGenerator () {
    RenderGenerator$$1.apply(this, arguments);
  }

  if ( RenderGenerator$$1 ) ReactWebRenderGenerator.__proto__ = RenderGenerator$$1;
  ReactWebRenderGenerator.prototype = Object.create( RenderGenerator$$1 && RenderGenerator$$1.prototype );
  ReactWebRenderGenerator.prototype.constructor = ReactWebRenderGenerator;

  ReactWebRenderGenerator.prototype.genTag = function genTag (ast) {
    var tag = ast.tag;
    if (isReservedTag(tag)) {
      return ("'" + tag + "'")
    } else if (isBuildInTag(tag)) {
      return ("" + tag)
    } else {
      return ("vm.$options.components['" + (changeCase.pascalCase(tag)) + "']")
    }
  };

  /**
   * override
   */
  ReactWebRenderGenerator.prototype.genProps = function genProps (ast, level) {
    var code = [];
    code = code.concat(RenderGenerator$$1.prototype.genProps.call(this, ast, level));
    ast.attrs = ast.attrs || [];
    if (this.vueConfig.scopeId) {
      code.push(("'" + (this.vueConfig.scopeId) + "': ''"));
    }
    var classProps = this.genClassProps(ast);
    if (classProps) {
      classProps = this.genFormat(classProps, level + 1);
      code.push(classProps);
    }
    var styleProps = this.genStyleProps(ast);
    if (styleProps) {
      styleProps = this.genFormat(styleProps, level + 1);
      code.push(styleProps);
    }
    var eventHandler = this.genEventHandler(ast);
    if (eventHandler) {
      eventHandler = this.genFormat(eventHandler, level + 1);
      code.push(eventHandler);
    }
    var nativeEventHandler = this.genNativeEventHandler(ast);
    if (nativeEventHandler) {
      nativeEventHandler = this.genFormat(nativeEventHandler, level + 1);
      code.push(nativeEventHandler);
    }
    return code
  };

  /**
   * override
   */
  ReactWebRenderGenerator.prototype.genTransition = function genTransition (ast, level) {
    var this$1 = this;

    ast.tag = WEB.transition.component;
    ast.attrs = ast.attrs || [];
    var obj = {
      name: WEB.transition.collection,
      value: ''
    };
    var arr = [];
    var i = 0;
    ast.children.forEach(function (v1, i1) {
      if (v1.if) {
        var conditionsArr = [];
        v1.ifProcessed = true;
        v1.ifConditions.forEach(function (v2) {
          conditionsArr.push(("{\n            index: " + (i++) + ",\n            exp: " + (v2.block.else ? true : v2.exp) + ",\n            element: " + (this$1.genElement(v2.block, level + 1)) + "\n          }"));
        });
        arr.push(("{\n          type: 'if',\n          conditions: [" + (conditionsArr.join(',')) + "]\n        }"));
      } else if (Array.isArray(v1.directives) && v1.directives.filter(function (v) { return v.name === 'show'; }).length) {
        v1.directives.forEach(function (v) {
          if (v.name === 'show') {
            arr.push(("{\n              index: " + (i++) + ",\n              type: 'show',\n              exp: " + (v.value) + ",\n              element: " + (this$1.genElement(v1, level + 1)) + "\n            }"));
          }
        });
      } else if (v1.key) {
        arr.push(("{\n          index: " + (i++) + ",\n          type: 'key',\n          exp: " + (v1.key) + ",\n          element: " + (this$1.genElement(v1, level + 1)) + "\n        }"));
      } else if (v1.component !== undefined) {
        arr.push(("{\n          index: " + (i++) + ",\n          type: 'component',\n          exp: " + (v1.component) + ",\n          element: " + (this$1.genElement(v1, level + 1)) + "\n        }"));
      } else {
        arr.push(("{\n          index: " + (i++) + ",\n          exp: " + (v1.component) + ",\n          element: " + (this$1.genElement(v1, level + 1)) + "\n        }"));
      }
    });
    obj.value = "[" + (arr.join(',')) + "]";
    ast.attrs.push(obj);
    ast.children = [];
    return this.genElement(ast, level)
  };

  /**
   * override
   */
  ReactWebRenderGenerator.prototype._genTransitionGroup = function _genTransitionGroup (ast, level) {
    var this$1 = this;

    ast.tag = WEB.transitionGroup.component;
    ast.attrs = ast.attrs || [];
    var obj = {
      name: WEB.transitionGroup.collection,
      value: ''
    };
    var arr = [];
    ast.children.forEach(function (v1, i1) {
      if (v1.if) {
        var conditionsArr = [];
        v1.ifProcessed = true;
        v1.ifConditions.forEach(function (v2) {
          conditionsArr.push(("{\n            exp: " + (v2.block.else ? true : v2.exp) + ",\n            element: " + (this$1.genElement(v2.block, level + 1)) + "\n          }"));
        });
        arr.push(("{\n          type: 'if',\n          conditions: [" + (conditionsArr.join(',')) + "]\n        }"));
      } else if (Array.isArray(v1.directives) && v1.directives.filter(function (v) { return v.name === 'show'; }).length) {
        v1.directives.forEach(function (v) {
          if (v.name === 'show') {
            arr.push(("{\n              type: 'show',\n              exp: " + (v.value) + ",\n              element: " + (this$1.genElement(v1, level + 1)) + "\n            }"));
          }
        });
      } else {
        arr.push(("{\n          exp: true,\n          element: " + (this$1.genElement(v1, level + 1)) + "\n        }"));
      }
    });
    obj.value = "[" + (arr.join(',')) + "]";
    ast.attrs.push(obj);
    ast.children = [];
    return this.genElement(ast, level)
  };

  /**
   * gen class props
   * @param {Object} ast
   */
  ReactWebRenderGenerator.prototype.genClassProps = function genClassProps (ast) {
    var code = '';
    var classAttrsValue = ast.attrs.filter(function (v) { return v.name === 'class'; }).map(function (v) { return v.value; });
    if (classAttrsValue.length === 0 && ast.parent) {
      return code
    }
    var staticClass, dynamicClass;
    classAttrsValue.forEach(function (v) {
      if (/^".*"$/.test(v) || /^'.*'$/.test(v)) {
        staticClass = v.trim(); // .replace(/^"(.*)"$/, '$1')
      } else {
        dynamicClass = v;
      }
    });
    if (staticClass) {
      code += " " + staticClass;
    }
    if (dynamicClass) {
      code = code.replace(/"$/, ' "');
      code += " + " + (WEB.bindClass.name) + "(" + dynamicClass + ")";
    }
    if (ast.parent === undefined) {
      code += "+ ' ' + (this.props.className || '')";
    }
    code = "className: (" + (code.trim().replace(/^[\s]*\+[\s]*/, '')) + ").trim()";
    return code
  };

  /**
   * gen style props
   * @param {Object} ast
   */
  ReactWebRenderGenerator.prototype.genStyleProps = function genStyleProps (ast) {
    var styleAttrsValue = ast.attrs.filter(function (v) { return v.name === 'style'; }).map(function (v) { return v.value; });
    var show = ast.directives && ast.directives.filter(function (v) { return v.name === 'show'; })[0];
    if (styleAttrsValue.length === 0 && !show) {
      return
    }
    var staticStyle, dynamicStyle;
    styleAttrsValue.forEach(function (v) {
      if (/^".*"$/.test(v)) {
        staticStyle = v.trim().replace(/;*"$/, ';"');
      } else {
        dynamicStyle = v;
      }
    });
    var code = '';
    if (staticStyle) {
      try {
        staticStyle = JSON.stringify(parseStyleText(staticStyle));
      } catch (e) {}
    }
    if (dynamicStyle || staticStyle) {
      code += " + " + (WEB.bindStyle.name) + "(" + dynamicStyle + ", " + staticStyle + ")";
    }
    if (show) {
      code += " + " + (WEB.bindStyle.name) + "({display: " + (show.value) + " ? '' : 'none'})";
    }
    code = "style: " + (code.trim().replace(/^[\s]*\+[\s]*/, ''));
    return code
  };

  ReactWebRenderGenerator.prototype.genDirectives = function genDirectives (ast) {
    var this$1 = this;

    var code = RenderGenerator$$1.prototype.genDirectives.call(this, ast);
    ast.directives.forEach(function (v) {
      if (v.name === 'model') {
        this$1.genModelDirectives(ast, v);
      } else if (v.name === 'html') {
        this$1.genHtmlDirectives(ast);
      } else if (v.name === 'text') {
        this$1.genTextDirectives(ast);
      }
    });
    return code
  };

  ReactWebRenderGenerator.prototype.genModelDirectives = function genModelDirectives$1 (ast, directive) {
    return model(ast, directive, baseWarn)
  };

  ReactWebRenderGenerator.prototype.genHtmlDirectives = function genHtmlDirectives$1 (ast) {
    return html(ast)
  };

  ReactWebRenderGenerator.prototype.genTextDirectives = function genTextDirectives$1 (ast) {
    return text(ast)
  };

  ReactWebRenderGenerator.prototype.genEventHandler = function genEventHandler (ast) {
    var code = '';
    if (ast.events) {
      code = genHandlers(ast.events, this.vueConfig);
    }
    return code
  };

  ReactWebRenderGenerator.prototype.genNativeEventHandler = function genNativeEventHandler (ast) {
    var code = '';
    if (ast.nativeEvents && !isReservedTag(ast.tag)) {
      code = HELPER_HEADER + "nativeEvents: {" + (genHandlers(ast.nativeEvents, this.vueConfig)) + "}";
    }
    return code
  };

  return ReactWebRenderGenerator;
}(RenderGenerator));

/**
 * 
 */
function compile (template, options) {
  var ast = parse(template.trim(), options);
  var code;
  if (ast) {
    var renderer = new ReactWebRenderGenerator(ast, options);
    code = renderer.generate();
  } else {
    code = '() => null';
  }
  return {
    ast: ast,
    code: code
  }
}

/*  */

exports.parseComponent = parseComponent;
exports.compile = compile;
