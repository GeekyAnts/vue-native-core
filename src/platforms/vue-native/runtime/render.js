// @flow

import { nextTick } from 'core/util/index'

export function renderMixin(Vue: Class<Component>) {
  Vue.prototype.$nextTick = function(fn: Function) {
    return nextTick(fn, this)
  }
}
