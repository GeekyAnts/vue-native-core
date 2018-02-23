import {
  COMMON
} from 'react-vue/compiler/config'

import {
  handleProps
} from '../render-helpers/handleProps'

import {
  buildMixin
} from './buildMixin'

function triggerDirective (newData, oldData, vm, ref) {
  let directive, binding, args

  const vnode = {
    context: vm
  }

  if (newData) {
    directive = vm.$options.directives[newData.directiveName]
  } else if (oldData) {
    directive = vm.$options.directives[oldData.directiveName]
  }

  if (!directive) {
    return
  }

  if (newData && oldData) { // update
    binding = {
      name: newData.name,
      value: newData.value,
      oldValue: oldData.value,
      expression: newData.expression,
      arg: newData.arg,
      modifiers: newData.modifiers
    }
    args = [ref, binding, vnode]
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
    args = [ref, binding, vnode]
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
    args = [ref, binding, vnode]
    if (typeof directive.unbind === 'function') {
      directive.unbind.apply(vm, args)
    }
  }
}

export function buildDirective (Component, createElement) {
  return class Directive extends buildMixin.apply(this, arguments) {
    constructor (props) {
      super(props)
      // set vm from parent context that
      // this.vm = props[COMMON.directive.context].vm
      this.state = {
        props: handleProps(props, props[COMMON.directive.tag])
      }
    }
    setDirectiveLifeCycle (newProps, oldProps) {
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
              triggerDirective(newDirective, oldDirective, context.vm, this._ref) // update
            }
          })
        })
        newDirectivesClone.forEach(v => { // bind
          v && triggerDirective(v, null, context.vm, this._ref)
        })
        oldDirectivesClone.forEach(v => { // unbind
          v && triggerDirective(null, v, context.vm, this._ref)
        })
      }
    }
    getDirectiveName (props) {
      if (props[COMMON.directive.name]) {
        return props[COMMON.directive.name].map(v => v.name)
      } else {
        return []
      }
    }
    buildInHandle (props) {
      const names = this.getDirectiveName(props)
      const stateProps = this.buildStateProps(props)
      if (names.indexOf('model') !== -1) {
        const onChangeFn = stateProps.onChange || stateProps.onInput || function () {}
        stateProps.onChange = event => {
          this.setState({
            props: Object.assign({}, this.state.props, {
              value: event.target.value
            })
          })
          return onChangeFn(event)
        }
      }
      this.setState({
        props: handleProps(stateProps, props[COMMON.directive.tag])
      })
    }
    componentWillMount () {
      this.buildInHandle(this.props)
    }
    componentDidMount () {
      this.setDirectiveLifeCycle(this.props)
    }
    componentWillReceiveProps (nextProps) {
      this.buildInHandle(nextProps)
      this.setDirectiveLifeCycle(nextProps, this.props)
    }
    componentWillUnmount () {
      this.setDirectiveLifeCycle(null, this.props)
    }
    render () {
      return createElement(this.props[COMMON.directive.tag], this.state.props, this.state.props.children)
    }
  }
}
