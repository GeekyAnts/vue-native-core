export function buildMixin (Component) {
  return class Mixin extends Component {
    constructor (props) {
      super(props)
      /**
       * for vue, every component should have a ref to represent node element
       */
      this._ref = null
    }

    setRef (ref) {
      if (ref) {
        if (ref._reactInternalInstance && ref.vm === undefined) {
          this._ref = ref._ref || ref
        } else {
          this._ref = ref.vm || ref
        }
      }
    }

    buildStateProps (props) {
      const stateProps = Object.assign({}, props)
      const originRef = stateProps.ref
      stateProps.ref = ref => {
        this.setRef(ref)
        if (typeof originRef === 'function') {
          return originRef(ref)
        } else {
          return ref
        }
      }

      return stateProps
    }
  }
}
