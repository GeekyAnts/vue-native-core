export function buildWebEmptyComponent (Component, createElement) {
  return class EmptyComponent extends Component {
    constructor (props) {
      super(props)
      this._ref = null
      this.state = {
        props: {}
      }
    }
    setRef (ref) {
      this._ref = ref
    }
    buildStateProps (props) {
      const stateProps = Object.assign({}, props)
      const originRef = stateProps.ref
      stateProps.ref = (ref) => {
        this.setRef(ref)
        if (typeof originRef === 'function') {
          return originRef(ref)
        } else {
          return ref
        }
      }
      return stateProps
    }
    componentWillMount () {
      this.setState({
        props: this.buildStateProps(this.props)
      })
    }
    componentWillReceiveProps (nextProps) {
      this.setState({
        props: this.buildStateProps(nextProps)
      })
    }
    unwrap (wrapper) {
      if (wrapper.parentNode) {
        const docFrag = document.createDocumentFragment()
        while (wrapper.firstChild) {
          const child = wrapper.removeChild(wrapper.firstChild)
          docFrag.appendChild(child)
        }
        wrapper.parentNode.replaceChild(docFrag, wrapper)
      }
    }
    componentDidMount () {
      // this.unwrap(this._ref)
    }
    componentDidUpdate () {
      // this.unwrap(this._ref)
    }
    render () {
      const {
        tag, children
      } = this.state.props
      return createElement(tag || 'view', this.state.props, children)
    }
  }
}
