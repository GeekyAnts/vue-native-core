import {
  addClass,
  removeClass
} from 'web/runtime/class-util.js'
import {
  nextFrame,
  resolveTransition,
  whenTransitionEnds,
  getTransitionInfo
} from 'web/runtime/transition-util'
import { isIE9, warn } from 'core/util/index'
import {
  once,
  isDef,
  isUndef,
  isObject,
  toNumber
} from 'shared/util'
import {
  WEB,
  COMMON
} from 'react-vue/compiler/config'
import {
  buildWebEmptyComponent
} from './buildWebEmptyComponent'
// import {
//   isObjectShallowModified
// } from './util'

function filterCollection (collection) {
  const result = []
  collection.forEach(v => {
    if (v.type === 'if') {
      const _result = v.conditions.filter(_v => _v.exp).map(_v => {
        return {
          type: 'if',
          index: _v.index,
          element: _v.element,
          exp: _v.exp
        }
      })
      if (_result.length) {
        result.push(_result[0])
      }
    } else {
      result.push(v)
    }
  })
  if (result.length > 1) {
    console.warn(`<transition> can only be used on a single element. Use <transition-group> for lists.`)
  }
  return result
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  const invokerFns = fn.fns
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

// only used in dev mode
function checkDuration (val, name) {
  if (typeof val !== 'number') {
    warn(
      `<transition> explicit ${name} duration is not a valid number - ` +
      `got ${JSON.stringify(val)}.`
    )
  } else if (isNaN(val)) {
    warn(
      `<transition> explicit ${name} duration is NaN - ` +
      'the duration expression might be incorrect.'
    )
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

function addTransitionClass (ref, className) {
  addClass(ref, className)
}

function removeTransitionClass (ref, className) {
  removeClass(ref, className)
}

/**
 * check whether animation should be updated
 * for performance it does not used for under component
 * but in the future we would be used
 * @param {Object} prev props
 * @param {Object} next props
 */
// function checkTransitionStateChanged (prev, next) {
//   let result = true
//   try {
//     const prevCollection = prev[WEB.transition.collection]
//     const nextCollection = next[WEB.transition.collection]
//     result = prevCollection.filter((pV, i) => {
//       const nV = nextCollection[i]
//       let result = false
//       if (pV.exp !== nV.exp ||
//         pV.index !== nV.index ||
//         pV.element.className !== nV.element.className ||
//         pV.element.style !== nV.element.style) {
//         result = true
//       }
//       return result
//     }).length > 0
//   } catch (e) {
//     result = true
//   }
//   return result
// }

export function enter ({ el, cb }) {
  const {
    css,
    type,
    enterClass,
    enterToClass,
    enterActiveClass,
    appearClass,
    appearToClass,
    appearActiveClass,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeAppear,
    appear,
    onAppear,
    onAfterAppear,
    onAppearCancelled,
    duration
  } = this.transitionResolved

  const isAppear = this.isAppear

  if (isUndef(el)) {
    return
  }

  if (isAppear && !appear && appear !== '') {
    return
  }

  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  const startClass = isAppear && appearClass
    ? appearClass
    : enterClass
  const activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass
  const toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass

  const beforeEnterHook = isAppear
    ? (onBeforeAppear || onBeforeEnter)
    : onBeforeEnter
  const enterHook = isAppear
    ? (onAppear || onEnter)
    : onEnter
  const afterEnterHook = isAppear
    ? (onAfterAppear || onAfterEnter)
    : onAfterEnter
  const enterCancelledHook = isAppear
    ? (onAppearCancelled || onEnterCancelled)
    : onEnterCancelled

  const explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  )

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter')
  }

  const expectsCSS = css !== false && !isIE9
  const userWantsControl = getHookArgumentsLength(enterHook)

  const _cb = el._enterCb = once(() => {
    if (expectsCSS) {
      removeTransitionClass(el, activeClass)
      removeTransitionClass(el, toClass)
    }
    cb && cb()
    if (_cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass)
      }
      enterCancelledHook && enterCancelledHook(el)
    } else {
      afterEnterHook && afterEnterHook(el)
    }
    el._enterCb = null
  })

  beforeEnterHook && beforeEnterHook(el)

  if (expectsCSS) {
    addTransitionClass(el, startClass)
    addTransitionClass(el, activeClass)

    nextFrame(() => {
      removeTransitionClass(el, startClass)
      addTransitionClass(el, toClass)
      if (!_cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(_cb, explicitEnterDuration)
        } else {
          whenTransitionEnds(el, type || getTransitionInfo(el).type, _cb)
        }
      }
    })
  }

  nextFrame(() => enterHook && enterHook(el, _cb))

  if (!expectsCSS && !userWantsControl) {
    _cb()
  }
}

export function leave ({ el, cb }) {
  const {
    css,
    type,
    leaveClass,
    leaveToClass,
    leaveActiveClass,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    duration
  } = this.transitionResolved

  if (isUndef(el)) {
    return
  }

  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  const expectsCSS = css !== false && !isIE9
  const userWantsControl = getHookArgumentsLength(onLeave)

  const explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  )

  if (process.env.NODE_ENV !== 'production' && explicitLeaveDuration != null) {
    checkDuration(explicitLeaveDuration, 'leave')
  }

  const _cb = el._leaveCb = once(() => {
    if (expectsCSS) {
      removeTransitionClass(el, leaveActiveClass)
      removeTransitionClass(el, leaveToClass)
    }
    cb && cb()
    if (_cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass)
      }
      onLeaveCancelled && onLeaveCancelled(el)
    } else {
      onAfterLeave && onAfterLeave(el)
    }
    el._leaveCb = null
  })

  onBeforeLeave && onBeforeLeave(el)
  if (expectsCSS) {
    addTransitionClass(el, leaveClass)
    addTransitionClass(el, leaveActiveClass)

    nextFrame(() => {
      removeTransitionClass(el, leaveClass)
      addTransitionClass(el, leaveToClass)
      if (!_cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitLeaveDuration)) {
          setTimeout(_cb, explicitLeaveDuration)
        } else {
          whenTransitionEnds(el, type || getTransitionInfo(el).type, _cb)
        }
      }
    })
  }
  onLeave && onLeave(el, _cb)
  if (!expectsCSS && !userWantsControl) {
    _cb()
  }
}

export function buildWebTransition (Component, createElement) {
  const EmptyComponent = buildWebEmptyComponent(Component, createElement)
  class Transition extends Component {
    constructor (props) {
      super(props)
      this._ref = null
      this._refs = {}
      this.transitionResolved = {}
      this._shouldComponentUpdateTransitionResult = false
      this.isAppear = false
      this.state = {
        transObj: {},
        animated: true,
        tagKey: null
      }
    }

    setRef (ref, key) {
      if (!ref) {
        return
      }
      this._ref = ref._ref || ref
      this._refs[key] = this._ref
    }

    resolveData (props, type) {
      const target = filterCollection(props[WEB.transition.collection])[0]
      if (target) {
        const element = target.element
        const _props = {}
        for (const key in element.props) {
          _props[key] = element.props[key]
        }

        let key = target.index
        if (element.key != null) {
          key = element.key + key
        }
        if (target.type === 'component') {
          const targetExp = target.exp
          const thisTarget = this.state.transObj[this.state.tagKey]
          const thisExp = thisTarget && thisTarget.exp
          if (targetExp !== thisExp) {
            key = this.state.tagKey === 0 ? 1 : 0
          }
        }
        _props.key = _props.key || key

        const setRef = (ref) => {
          this.setRef(ref, _props.key)
          element.ref && element.ref(ref)
        }
        if (target.type === 'component') {
          _props[COMMON.setRef.name] = setRef
        } else {
          _props.ref = setRef
        }

        const transObj = Object.assign({}, this.state.transObj)
        transObj[_props.key] = Object.assign({}, target, {
          props: _props
        })
        return {
          transObj: transObj,
          animated: true,
          tagKey: _props.key
        }
      } else if (type === 'update') {
        const tagKey = this.state.tagKey
        const transition = this.state.transObj[tagKey]
        // someone want to hide and his prev state is show
        if (transition) {
          const transObj = {}
          transObj[tagKey] = Object.assign({}, transition, {
            exp: transition.exp ? !transition.exp : transition.exp
          })
          return {
            animated: true,
            transObj: transObj,
            tagKey: tagKey
          }
        }
      }
    }

    componentWillMount () {
      this.transitionResolved = resolveTransition(this.props)
      this.isAppear = true
      const state = this.resolveData(this.props)
      state && this.setState(state)
    }

    componentDidMount () {
      this.resolveEnterTransition({
        el: this._refs[this.state.tagKey]
      })
    }

    componentWillReceiveProps (nextProps) {
      this.transitionResolved = resolveTransition(nextProps)
      this.isAppear = false
      const nextState = this.resolveData(nextProps, 'update')

      if (nextState) {
        this._shouldComponentUpdateTransitionResult =
          this._shouldComponentUpdateTransition(nextProps, nextState)
        this.setState(nextState)
      }

      if (this._shouldComponentUpdateTransitionResult) {
        Object.keys(this._refs).forEach(k => {
          const el = this._refs[k]
          if (isDef(el._leaveCb)) {
            el._leaveCb.cancelled = true
            el._leaveCb()
          }
          if (isDef(el._enterCb)) {
            el._enterCb.cancelled = true
            el._enterCb()
          }
        })
      }
    }

    _shouldComponentUpdateTransition (nextProps, nextState) {
      if (Object.keys(nextState.transObj).length !==
          Object.keys(this.state.transObj).length) {
        return true
      }
      if (nextState.tagKey === this.state.tagKey) {
        const nextTransition = nextState.transObj[nextState.tagKey]
        const transition = this.state.transObj[this.state.tagKey]
        if (nextTransition && transition) {
          return transition.exp !== nextTransition.exp
        }
      }
      return true
    }

    resolveEnterTransition (option) {
      enter.call(this, option)
    }

    resolveLeaveTransition (option) {
      leave.call(this, option)
    }

    componentDidUpdate (prevProps, prevState) {
      if (this.state.animated === false ||
        this._shouldComponentUpdateTransitionResult === false) {
        return
      }
      if (this.state.tagKey === prevState.tagKey) { // same element
        const ref = this._refs[this.state.tagKey]
        const transition = this.state.transObj[this.state.tagKey]
        if (ref && transition) {
          if (transition.type === 'show') {
            ref.style.display = ''
            if (transition.exp === false) {
              this.resolveLeaveTransition({
                el: ref,
                cb: () => {
                  ref.style.display = 'none'
                }
              })
            } else if (transition.exp === true) {
              this.resolveEnterTransition({
                el: ref
              })
            }
          } else if (transition.type === 'if') {
            if (transition.exp === false) {
              const transObj = Object.assign({}, this.state.transObj)
              delete transObj[prevState.tagKey]
              this.resolveLeaveTransition({
                el: ref,
                cb: () => {
                  this.setState({
                    transObj: transObj,
                    animated: false
                  })
                }
              })
            } else if (transition.exp === true) {
              this.resolveEnterTransition({
                el: ref
              })
            }
          }
        }
      } else {
        const enterRef = this._refs[this.state.tagKey]
        const leaveRef = this._refs[prevState.tagKey]
        const transObj = Object.assign({}, this.state.transObj)
        delete transObj[prevState.tagKey]
        this.resolveEnterTransition({
          el: enterRef
        })
        this.resolveLeaveTransition({
          el: leaveRef,
          cb: () => {
            this.setState({
              transObj: transObj,
              animated: false
            })
          }
        })
      }
    }

    render () {
      const transObj = this.state.transObj
      const tag = this.props.tag || EmptyComponent
      return createElement(tag, null, Object.keys(transObj).map(k => {
        const type = transObj[k].element.type
        const props = transObj[k].props
        const children = props.children
        return createElement(type, props, children)
      }))
    }
  }
  return Transition
}
