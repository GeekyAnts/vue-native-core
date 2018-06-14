import {
  HELPER_HEADER
} from 'react-vue/compiler/constants'
import propertyMap from 'react-vue/compiler/property/index'
import {
  isReservedTag,
  isUnaryTag
} from 'react-vue/compiler/util/index'

export function handleProps (props, tag) {
  let handledProps = {}
  if (typeof tag === 'string' && isReservedTag(tag)) {
    for (const key in props) {
      const prop = propertyMap[key.toLowerCase()]
      if (prop && props[key] !== undefined && key.indexOf(HELPER_HEADER) !== 0) {
        handledProps[prop] = props[key]
      }
    }
  } else {
    handledProps = props
  }
  if (isUnaryTag(tag)) {
    delete handledProps.children
  }
  return handledProps
}
