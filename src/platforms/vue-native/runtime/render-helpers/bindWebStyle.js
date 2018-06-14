import { cached, camelize } from 'shared/util'

const prefixes = ['Webkit', 'Moz', 'ms']

let testEl
const normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div')
  prop = camelize(prop)
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  const upper = prop.charAt(0).toUpperCase() + prop.slice(1)
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + upper
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
})

export function bindWebStyle (styleBinding, staticStyle, showStyle) {
  if (styleBinding === undefined) {
    styleBinding = {}
  }
  staticStyle = Object.assign({}, staticStyle, showStyle)
  const type = Object.prototype.toString.call(styleBinding)
  if (type === '[object Object]') {
    const normalizedStyle = {}
    styleBinding = Object.assign({}, styleBinding, staticStyle)
    for (const key in styleBinding) {
      normalizedStyle[normalize(key)] = styleBinding[key]
    }
    return normalizedStyle
  } else if (type === '[object Array]') {
    return styleBinding.map((v) => {
      return bindWebStyle(v, staticStyle, showStyle)
    }).reduce((acc, val) => Object.assign(acc, val), {})
  }
}
