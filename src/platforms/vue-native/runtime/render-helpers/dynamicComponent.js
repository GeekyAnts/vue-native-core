import {
  pascalCaseTag
} from '../components/util.js'

export function dynamicComponent (vm, name) {
  let componentName
  if (typeof name === 'string') {
    componentName = vm.$options.components[pascalCaseTag(name)]
  } else {
    componentName = name
  }
  return componentName
}
