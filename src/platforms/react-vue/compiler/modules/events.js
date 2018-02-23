import changeCase from 'change-case'
import {
  COMMON
} from '../config'

const fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/
const simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/
const EVENT_ACTION = ['composition', 'key', 'context', 'double', 'drag', 'mouse', 'touch', 'can', 'play', 'duration', 'loaded', 'meta', 'load', 'rate', 'time', 'volume', 'animation', 'transition']

const addSeparateLine = function (eventName) {
  EVENT_ACTION.forEach(v => {
    eventName = eventName.replace(v, v + '-')
  })
  return eventName
}

let uid = 0

// keyCode aliases
let keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
}

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
const genGuard = condition => `if(${condition})return null;`

const modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard(`$event.target !== $event.currentTarget`),
  ctrl: genGuard(`!$event.ctrlKey`),
  shift: genGuard(`!$event.shiftKey`),
  alt: genGuard(`!$event.altKey`),
  meta: genGuard(`!$event.metaKey`),
  left: genGuard(`'button' in $event && $event.button !== 0`),
  middle: genGuard(`'button' in $event && $event.button !== 1`),
  right: genGuard(`'button' in $event && $event.button !== 2`)
}

function genHandlers (
  events,
  options
) {
  let res = ''
  if (options.keyCodes) {
    keyCodes = Object.assign({}, keyCodes, options.keyCodes)
  }
  for (let name in events) {
    const handler = events[name]
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if (process.env.NODE_ENV !== 'production' &&
        name === 'click' &&
        handler && handler.modifiers && handler.modifiers.right
      ) {
      console.warn(
        `Use "contextmenu" instead of "click.right" since right clicks ` +
        `do not actually fire "click" events.`
      )
    }
    if (name.indexOf('!') === 0 || name.indexOf('~!') === 0) {
      name += 'Capture'
    }
    let eventHandler = genHandler(name, handler)
    if (name.indexOf('~') === 0) {
      eventHandler = `this.setEventOnce(function once_${++uid}(event){(${eventHandler})(event)})`
    }
    eventHandler = `${COMMON.event.name}(${eventHandler})`
    res += `on${changeCase.pascalCase(addSeparateLine(name))}: ${eventHandler},`
  }
  res = res.replace(/,$/, '')
  return res
}

function genCustomEventHandlers (
  events,
  options
) {
  let res = ''
  if (options.keyCodes) {
    keyCodes = Object.assign({}, keyCodes, options.keyCodes)
  }
  for (let name in events) {
    const handler = events[name]
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if (process.env.NODE_ENV !== 'production' &&
        name === 'click' &&
        handler && handler.modifiers && handler.modifiers.right
      ) {
      console.warn(
        `Use "contextmenu" instead of "click.right" since right clicks ` +
        `do not actually fire "click" events.`
      )
    }
    if (name.indexOf('!') === 0 || name.indexOf('~!') === 0) {
      name += 'Capture'
    }
    let eventHandler = genCustomHandler(name, handler)
    if (name.indexOf('~') === 0) {
      eventHandler = `this.setEventOnce(function once_${++uid}(event){(${eventHandler})(event)})`
    }
    eventHandler = `${COMMON.event.name}(${eventHandler})`
    res += `'${COMMON.customEvent.name}${name}': ${eventHandler},`
  }
  res = res.replace(/,$/, '')
  return res
}

function genTransitionEventHandlers (
  events,
  options
) {
  let res = ''
  for (const name in events) {
    const handler = events[name]
    let eventHandler = genTransitionEventHandler(name, handler)
    if (name.indexOf('~') === 0) {
      eventHandler = `this.setEventOnce(function once_${++uid}(event){(${eventHandler})(event)})`
    }
    eventHandler = `${COMMON.event.name}(${eventHandler})`
    res += `on${changeCase.pascalCase(addSeparateLine(name))}: ${eventHandler},`
  }
  res = res.replace(/,$/, '')
  return res
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return `[${handler.map(handler => genHandler(name, handler)).join(',')}]`
  }

  const isMethodPath = simplePathRE.test(handler.value)
  const isFunctionExpression = fnExpRE.test(handler.value)

  const handlerCode = isMethodPath
    ? handler.value + '($event)'
    : isFunctionExpression
      ? `(${handler.value})($event)`
      : handler.value

  if (!handler.modifiers) {
    return `({nativeEvent: $event}) => {${handlerCode}}`
    // return isMethodPath || isFunctionExpression
    //   ? handler.value
    //   : `({nativeEvent: $event}) => {${handler.value}}` // inline statement
  } else {
    let code = ''
    let genModifierCode = ''
    const keys = []
    for (const key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key]
        // left/right
        if (keyCodes[key]) {
          keys.push(key)
        }
      } else {
        keys.push(key)
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys)
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode
    }
    return `({nativeEvent: $event}) => {${code}${handlerCode}}`
  }
}

function genCustomHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return `[${handler.map(handler => genHandler(name, handler)).join(',')}]`
  }

  const isMethodPath = simplePathRE.test(handler.value)
  const isFunctionExpression = fnExpRE.test(handler.value)

  const handlerCode = isMethodPath
    ? handler.value + '.apply(this, arguments)'
    : isFunctionExpression
      ? `(${handler.value}).apply(this, arguments)`
      : handler.value

  if (!handler.modifiers) {
    return `function ($event) {${handlerCode}}.bind(this)`
  } else {
    let code = ''
    let genModifierCode = ''
    const keys = []
    for (const key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key]
        // left/right
        if (keyCodes[key]) {
          keys.push(key)
        }
      } else {
        keys.push(key)
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys)
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode
    }
    return `function ($event) {${code}${handlerCode}}.bind(this)`
  }
}

function genTransitionEventHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return `[${handler.map(handler => genTransitionEventHandler(name, handler)).join(',')}]`
  }

  const isMethodPath = simplePathRE.test(handler.value)
  const isFunctionExpression = fnExpRE.test(handler.value)

  const handlerCode = isMethodPath
    ? handler.value + '.apply(this, arguments)'
    : isFunctionExpression
      ? `(${handler.value}).apply(this, arguments)`
      : handler.value
  return `function () {${handlerCode}}.bind(this)`
}

function genKeyFilter (keys) {
  return `if(!('button' in $event)&&${keys.map(genFilterCode).join('&&')})return null;`
}

function genFilterCode (key) {
  const keyVal = parseInt(key, 10)
  if (keyVal) {
    return `$event.keyCode!==${keyVal}`
  }
  const alias = keyCodes[key]
  return `${COMMON.checkKeyCodes.name}(vm, $event.keyCode,${JSON.stringify(key)}${alias ? ',' + JSON.stringify(alias) : ''})`
}

export {
  genHandlers,
  genCustomEventHandlers,
  genTransitionEventHandlers
}
