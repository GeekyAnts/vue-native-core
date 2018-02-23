import {
  isObjectShallowModified,
  handleComponents,
  handleDirectives,
  getSlots,
  pascalCaseTag,
  filterCustomEvent
} from './util'

export function buildNativeComponent (render, options, config) {
  const { Component, PropTypes, Vue, ReactNative, css } = config
  if (!Vue.ReactNativeInjected) {
    Vue.ReactNativeInjected = true
    Object.keys(ReactNative).map(k => {
      if (/^[A-Z]/.test(k)) {
        try {
          Vue.component(k, ReactNative[k])
        } catch (e) {}
      }
    })
  }
  class ReactVueComponent extends Component {
    constructor (props) {
      super(props)
      this._ref = null
      this.eventOnceUid = []
      this.newDirectiveData = {}
      this.oldDirectiveData = {}
      this.vm = {}
      this.beforeMount = []
      this.mounted = []
      this.beforeUpdate = []
      this.updated = []
      this.beforeDestroy = []
      this.css = ReactNative.StyleSheet.create(css)
    }

    /**
     * children can access parent instance by 'this.context.owner'
     */
    getChildContext () {
      return {
        owner: this
      }
    }

    /**
     * for event modifiers v-on:xxx.once
     */
    setEventOnce (fn) {
      const name = fn.name
      return (event) => {
        if (this.eventOnceUid.indexOf(name) === -1) {
          this.eventOnceUid.push(name)
          fn(event)
        }
      }
    }

    setRootRef (ref) {
      if (ref) {
        ref = ref._ref || ref
        this._ref = ref
        this.vm.$el = this._ref
      }
    }

    setRef (ref, text, inFor) {
      if (ref) {
        // for buildin component, we set ref to his hold node directly
        // it means the buildin componet would be the end of $refs chain
        ref = ref.vm || ref._ref || ref
        if (inFor === true) {
          if (!this.vm.$refs[text]) {
            this.vm.$refs[text] = []
          }
          this.vm.$refs[text].push(ref)
        } else {
          this.vm.$refs[text] = ref
        }
        this.$refs = this.vm.$refs
      }
    }

    buildVM (options) {
      // set this property to prevent runtime error in vue
      render._withStripped = true

      const vueOptions = {
        render: render,
        propsData: this.props,
        parent: this.context.owner ? this.context.owner.vm : undefined
      }

      const reactVueOptions = {
        reactVueSlots: getSlots(this.props.children),
        reactVueForceUpdate: this.forceUpdate.bind(this),
        reactVueCustomEvent: filterCustomEvent(this.props)
      }

      Object.assign(options, vueOptions, reactVueOptions)

      const vm = new Vue(options)

      vm.$options.directives = handleDirectives(vm.$options.directives)
      vm.$options.components = handleComponents(vm.$options.components)

      /**
       * for ignoredElements
       */
      Vue.config.ignoredElements.forEach(name => {
        const _name = pascalCaseTag(name)
        if (vm.$options.components[_name] === undefined) {
          vm.$options.components[_name] = name
        }
      })

      return vm
    }

    componentWillMount () {
      this.vm = this.buildVM(options)

      this.beforeMount = this.vm.$options.beforeMount || []
      this.mounted = this.vm.$options.mounted || []
      this.beforeUpdate = this.vm.$options.beforeUpdate || []
      this.updated = this.vm.$options.updated || []
      this.beforeDestroy = this.vm.$options.beforeDestroy || []

      this.beforeMount.forEach(v => v.call(this.vm))
    }

    componentDidMount () {
      setTimeout(() => {
        this.mounted.forEach(v => v.call(this.vm))
      }, 0)
    }
    componentWillUpdate () {
      this.beforeUpdate.forEach(v => v.call(this.vm))
    }
    componentDidUpdate () {
      this.updated.forEach(v => v.call(this.vm))
    }
    componentWillUnmount () {
      this.beforeDestroy.forEach(v => v.call(this.vm))
    }
    componentWillReceiveProps (nextProps) {
      this.vm._props && Object.assign(this.vm._props, nextProps)
      this.vm.$slots = getSlots(nextProps.children)
    }
    shouldComponentUpdate (nextProps) {
      return isObjectShallowModified(this.props, nextProps)
    }
    render () {
      return render ? render.call(this, this.vm._renderProxy) : null
    }
  }
  ReactVueComponent.childContextTypes = {
    owner: PropTypes.object
  }
  ReactVueComponent.contextTypes = {
    owner: PropTypes.object
  }

  ReactVueComponent.options = options

  return ReactVueComponent
}
