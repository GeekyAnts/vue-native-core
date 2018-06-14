// unfinished

export function transitionGroupWeb (Component, createElement) {
  return class TransitionGroup extends Component {
    render () {
      const tag = this.props.tag || 'span'
      return createElement(tag, null)
    }
  }
}
