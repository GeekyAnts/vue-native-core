import {
  COMMON
} from 'react-vue/compiler/config'

export function isObjectShallowModified (prev, next) {
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
  for (const k in next) {
    if (typeof next[k] !== 'object') {
      if (next[k] !== prev[k]) {
        return true
      }
    }
  }
  return false
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function mergeCssModule (computed, cssModules) {
  const _computed = Object.create(computed || null)
  Object.keys(cssModules).forEach(function (key) {
    var module = cssModules[key]
    _computed[key] = function () { return module }
  })
  return _computed
}

export function pascalCaseTag (tag) {
  return tag.split('-').map(v => v.replace(/^[a-z]/, s => s.toUpperCase())).join('')
}

/**
 * for options {components}
 * @param {Object} components
 */

export function handleComponents (components) {
  for (const k in components) {
    if (hasOwn(components, k)) {
      components[pascalCaseTag(k)] = components[k]
      const c = components[k]
      if (c.name) {
        components[pascalCaseTag(c.name)] = components[k]
      }
    }
  }
  return components
}

export function handleDirectives (directives) {
  const obj = {}
  for (const k in directives) {
    obj[k.toLowerCase().replace(/[^a-z]/g, '')] = directives[k]
  }
  return obj
}

/**
 * for 'this.$solts'
 * @param {this.props.children} children
 */
export function getSlots (children) {
  const slots = {}
  if (children == null) {
    return slots
  }
  if (!Array.isArray(children)) {
    children = [children]
  }
  children = children.filter(v => v != null)
  children.forEach((v, _i) => {
    if (typeof v === 'string' || typeof v === 'number' || v === null) {
      slots.default = slots.default || []
      slots.default.push(v)
    } else if (v.type === COMMON.template.type) {
      slots[v['data-slot']] = slots[v['data-slot']] || []
      slots[v['data-slot']].push(v.render)
    } else if (v.props) {
      const dataSlot = v.props['data-slot']
      if (dataSlot == null) {
        slots.default = slots.default || []
        slots.default.push(v)
      } else {
        slots[dataSlot] = slots[dataSlot] || []
        slots[dataSlot].push(v)
      }
    }
  })
  return slots
}

export function filterCustomEvent (props) {
  return Object.keys(props).filter(v => {
    return v.indexOf(COMMON.customEvent.name) === 0
  }).map(v => {
    return {
      name: v.replace(COMMON.customEvent.name, ''),
      handle: props[v]
    }
  })
}

