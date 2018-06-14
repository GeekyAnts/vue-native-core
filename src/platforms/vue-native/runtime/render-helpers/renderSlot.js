import {
  COMMON
} from 'react-vue/compiler/config'

export function renderSlot (names, children) {
  const hitSlot = {}
  const defaultSlot = []
  if (children == null) {
    return () => {}
  }
  if (!Array.isArray(children)) {
    children = [children]
  }
  children = children.filter(v => v != null)
  children.forEach(v => {
    if (v.type === COMMON.template.type) {
      if (v['data-slot'] === undefined) {
        defaultSlot.push(v.render)
      }
      return
    }
    if (v.props === undefined || v.props['data-slot'] === undefined) {
      defaultSlot.push(v)
    }
  })
  names.forEach(v => {
    children.forEach((_v, _i) => {
      if (typeof _v === 'string' || typeof _v === 'number') {
        return
      }
      if (_v.type === COMMON.template.type) {
        if (v === _v['data-slot']) {
          hitSlot[v] = _v.render
        }
        return
      }
      if (v === _v.props['data-slot']) {
        hitSlot[v] = _v
      }
      return
    })
  })
  function render (name, props) {
    let target
    if (name === undefined) {
      target = defaultSlot.length === 0 ? undefined : defaultSlot
    } else {
      target = hitSlot[name]
    }
    if (typeof target === 'function') {
      return target(props)
    } else if (Array.isArray(target)) {
      return target.map(v => {
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
