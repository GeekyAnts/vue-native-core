import {
  COMMON
} from 'react-vue/compiler/config'

function triggerDirective (newData, oldData, vm, ref) {
  let directive
  if (newData) {
    directive = vm.$options.directives[newData.name]
  } else if (oldData) {
    directive = vm.$options.directives[oldData.name]
  }
  if (!directive) {
    return
  }
  let binding
  if (newData && oldData) { // update
    binding = {
      name: newData.name,
      value: newData.value,
      oldValue: oldData.value,
      expression: newData.expression,
      arg: newData.arg,
      modifiers: newData.modifiers
    }
    const args = [ref, binding]
    if (typeof directive === 'function') {
      directive.apply(vm, args)
    } else if (typeof directive.update === 'function') {
      directive.update.apply(vm, args)
    }
  } else if (newData && !oldData) { // bind
    binding = {
      name: newData.name,
      value: newData.value,
      expression: newData.expression,
      arg: newData.arg,
      modifiers: newData.modifiers
    }
    const args = [ref, binding]
    if (typeof directive === 'function') {
      directive.apply(vm, args)
    } else if (typeof directive.bind === 'function') {
      directive.bind.apply(vm, args)
    }
  } else if (!newData && oldData) { // unbind
    binding = {
      name: oldData.name,
      value: oldData.value,
      expression: oldData.expression,
      arg: oldData.arg,
      modifiers: oldData.modifiers
    }
    const args = [ref, binding]
    if (typeof directive.unbind === 'function') {
      directive.unbind.apply(vm, args)
    }
  }
}

function isObjectShallowModified (prev, next) {
  if (prev == null || next == null || typeof prev !== 'object' || typeof next !== 'object') {
    return prev !== next
  }
  const keys = Object.keys(prev)
  if (keys.length !== Object.keys(next).length) {
    return true
  }
  let key
  for (let i = keys.length - 1; i >= 0; i--) {
    key = keys[i]
    if (next[key] !== prev[key]) {
      return true
    }
  }
  return false
}

export function directive (Component, createElement) {
  return class DirectiveForm extends Component {
    constructor (props) {
      super(props)
      this.state = {
        formProps: {}
      }
      this.ref = null
    }
    directive (newProps, oldProps) {
      let context
      let newDirectives = []
      let oldDirectives = []
      if (oldProps) {
        context = oldProps[COMMON.directive.context]
        oldDirectives = oldProps[COMMON.directive.name]
      }
      if (newProps) {
        context = newProps[COMMON.directive.context]
        newDirectives = newProps[COMMON.directive.name]
      }
      const newDirectivesClone = newDirectives.slice()
      const oldDirectivesClone = oldDirectives.slice()
      if (Array.isArray(newDirectives) && Array.isArray(oldDirectives)) {
        newDirectives.forEach((newDirective, newIndex) => {
          oldDirectives.forEach((oldDirective, oldIndex) => {
            if (newDirective.name === oldDirective.name) {
              newDirectivesClone.splice(newIndex, 1, undefined)
              oldDirectivesClone.splice(oldIndex, 1, undefined)
              triggerDirective(newDirective, oldDirective, context.vm, this.ref) // update
            }
          })
        })
        newDirectivesClone.forEach(v => { // bind
          v && triggerDirective(v, null, context.vm, this.ref)
        })
        oldDirectivesClone.forEach(v => { // unbind
          v && triggerDirective(null, v, context.vm, this.ref)
        })
      }
    }
    handle (props) {
      const obj = {}
      for (const key in props) {
        if (key !== COMMON.directive.name &&
          key !== COMMON.directive.tag &&
          key !== COMMON.directive.context) {
          obj[key] = props[key]
        }
      }
      const refFn = obj.ref || function () {}
      obj.ref = ref => {
        this.ref = ref
        return refFn(ref)
      }
      const onChangeFn = obj.onChange || function () {}
      obj.onChange = event => {
        this.setState({
          formProps: Object.assign({}, this.state.formProps, {
            value: event.target.value
          })
        })
        return onChangeFn(event)
      }
      this.setState({
        formProps: obj
      })
    }
    componentWillMount () {
      this.handle(this.props)
    }
    componentDidMount () {
      this.directive(this.props)
    }
    componentWillReceiveProps (nextProps) {
      this.handle(nextProps)
      this.directive(nextProps, this.props)
    }
    componentWillUnmount () {
      this.directive(null, this.props)
    }
    shouldComponentUpdate (nextProps, nextState) {
      return isObjectShallowModified(this.props, nextProps)
    }
    render () {
      return createElement(this.props[COMMON.directive.tag], this.state.formProps, this.props.children)
    }
  }
}
