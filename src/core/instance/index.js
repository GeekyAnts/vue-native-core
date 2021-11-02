import { initMixin } from './init'
import { stateMixin } from './state'
/**
 * react-vue change
 */
// import { renderMixin } from './render'
import { eventsMixin } from './events'
/**
 * react-vue change
 */
// import { lifecycleMixin } from './lifecycle'
import {
  warn,
  // nextTick,
} from '../util/index'

function Vue(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }

  if (process.env.NODE_ENV !== 'production') {
    warn(
      'Vue Native has been deprecated and is no longer being maintained. Please consider migrating to React Native or use NativeScript-Vue instead',
    )
  }
  /**
   * react-vue change
   */
  if (options) {
    if (options.reactVueSlots) {
      this.$slots = options.reactVueSlots
    }
    if (options.reactVueForceUpdate) {
      this.$forceUpdate = options.reactVueForceUpdate
    }
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)

/**
 * react-vue change
 */
// lifecycleMixin(Vue)
// renderMixin(Vue)

export default Vue
