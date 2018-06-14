import { looseEqual, looseIndexOf } from 'shared/util'
import { warn } from 'core/util/index'

function setSelected (el, binding, vm) {
  const value = binding.value
  const isMultiple = el.multiple
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      `<select multiple v-model="${binding.expression}"> ` +
      `expects an Array value for its binding, but got ${
        Object.prototype.toString.call(value).slice(8, -1)
      }`,
      vm
    )
    return
  }
  let selected, option
  for (let i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i]
    if (isMultiple) {
      selected = looseIndexOf(value, option.value) > -1
      if (option.selected !== selected) {
        option.selected = selected
      }
    } else {
      if (looseEqual(option.value, value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1
  }
}

function setCheckBox (el, binding) {
  let value = binding.value
  try {
    value = JSON.parse(value)
  } catch (e) {}
  if (value) {
    el.setAttribute('checked', value)
  } else {
    el.removeAttribute('checked')
  }
}

export default {
  bind (el, binding) {
    if (el.tagName) {
      const lowerTagName = el.tagName.toLowerCase()
      if (lowerTagName === 'select') {
        setSelected(el, binding, this)
      } else if (lowerTagName === 'input') {
        if (el.getAttribute('type') === 'checkbox') {
          setCheckBox(el, binding)
        }
      }
    }
  },
  update (el, binding) {
    if (el.tagName) {
      const lowerTagName = el.tagName.toLowerCase()
      if (lowerTagName === 'select') {
        setSelected(el, binding, this)
      } else if (lowerTagName === 'input') {
        if (el.getAttribute('type') === 'checkbox') {
          setCheckBox(el, binding)
        }
      }
    }
  }
}
