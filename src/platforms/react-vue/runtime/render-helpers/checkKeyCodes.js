/* @flow */
import { warn } from 'core/util/index'
/**
 * Runtime helper for checking keyCodes.
 */
export function checkKeyCodes (
  vm: Object,
  eventKeyCode: number,
  key: string,
  builtInAlias: number | Array<number> | void
): boolean {
  let configKeyCodes = {}
  try {
    configKeyCodes = vm.$options._base.config.keyCodes
  } catch (e) {
    warn('react-vue checkKeyCodes vm.$options._base.config.keyCodes catch error')
  }
  const keyCodes = configKeyCodes[key] || builtInAlias
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}
