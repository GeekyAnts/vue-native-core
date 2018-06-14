import {
  isUnaryTag
} from './util/index'

export function specialObserver (obj, cb) {
  for (const key in obj) {
    const val = obj[key]
    if (typeof val === 'string') {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get () {
          cb && cb(obj)
          return val
        }
      })
    } else {
      specialObserver(val, cb)
    }
  }
}

export function handleUnaryTag (ast) {
  if (!ast.children) {
    return
  }
  if (isUnaryTag(ast.tag)) {
    let unaryTagChildren = ast.children.shift()
    while (unaryTagChildren) {
      handleUnaryTag(unaryTagChildren)
      ast.parent.children.push(unaryTagChildren)
      unaryTagChildren = ast.children.shift()
    }
  } else {
    let length = ast.children.length
    while (length--) {
      handleUnaryTag(ast.children[length])
    }
  }
}

export function filterDirective (ast) {
  const arr = ['show', 'bind']
  if (Array.isArray(ast.directives)) {
    return ast.directives.filter(v => arr.indexOf(v.name) === -1)
  } else {
    return []
  }
}

export function filterDirectiveBindProps (ast) {
  if (Array.isArray(ast.directives)) {
    return ast.directives.filter(v => v.name === 'bind' && v.value === '$props')
  } else {
    return []
  }
}

export function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
