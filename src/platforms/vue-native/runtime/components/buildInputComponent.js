import {
  WEB
} from 'react-vue/compiler/config'

import {
  buildMixin
} from './buildMixin'

import {
  handleProps
} from '../render-helpers/handleProps'

export function buildInputComponent (Component, createElement) {
  return class Input extends buildMixin.apply(this, arguments) {
    constructor (props) {
      super(props)
      this.state = {
        props: {}
      }
    }
    buildStateProps (props) {
      const stateProps = super.buildStateProps(props)

      const onChangeFn = stateProps.onChange || stateProps.onInput || function () {}
      stateProps.onChange = event => {
        this.setState({
          props: Object.assign({}, this.state.props, {
            value: event.target.value
          })
        })
        return onChangeFn(event)
      }

      return handleProps(stateProps, props[WEB.inputComponent.tag])
    }
    setStateProps (props) {
      const stateProps = this.buildStateProps(props)
      this.setState({
        props: stateProps
      })
    }
    componentWillMount () {
      this.setStateProps(this.props)
    }
    componentWillReceiveProps (nextProps) {
      this.setStateProps(nextProps)
    }
    render () {
      return createElement(this.props[WEB.inputComponent.tag], this.state.props, this.state.props.children)
    }
  }
}
