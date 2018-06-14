/* @flow */

import config from 'core/config'
import { addHandler, addAttr, getBindingAttr } from 'compiler/helpers'
import { genAssignmentCode } from 'compiler/directives/model'
import {
  COMMON,
  WEB
} from '../config'

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.

export default function model (
  el: ASTElement,
  dir: ASTDirective,
  warn: Function
): ?boolean {
  const value = dir.value
  const modifiers = dir.modifiers
  const tag = el.tag
  const type = el.attrsMap.type

  if (process.env.NODE_ENV !== 'production') {
    const dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type']
    if (tag === 'input' && dynamicType) {
      warn(
        `<input :type="${dynamicType}" v-model="${value}">:\n` +
        `v-model does not support dynamic input types. Use v-if branches instead.`
      )
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn(
        `<${el.tag} v-model="${value}" type="file">:\n` +
        `File inputs are read only. Use a v-on:change listener instead.`
      )
    }
  }

  if (tag === 'select') {
    genSelect(el, value, modifiers)
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers)
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers)
  } else if (tag === 'input' || tag === 'textarea' || tag === WEB.inputComponent.component) {
    genDefaultModel(el, value, modifiers)
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers)
    // component v-model doesn't need extra runtime
    return false
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `<${el.tag} v-model="${value}">: ` +
      `v-model is not supported on this element type. ` +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    )
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
) {
  const number = modifiers && modifiers.number
  const valueBinding = getBindingAttr(el, 'value') || 'null'
  const trueValueBinding = getBindingAttr(el, 'true-value') || 'true'
  const falseValueBinding = getBindingAttr(el, 'false-value') || 'false'
  addAttr(el, 'checked',
    `Array.isArray(${value})` +
      `?${COMMON.looseIndexOf.name}(${value},${valueBinding})>-1` + (
        trueValueBinding === 'true'
          ? `:(${value})`
          : `:${COMMON.looseEqual.name}(${value},${trueValueBinding})`
      )
  )
  addHandler(el, 'change',
    `var $$a=${value},` +
        `$$el=$event.target,` +
        `$$c=$$el.checked?(${trueValueBinding}):(${falseValueBinding});` +
    `if(Array.isArray($$a)){` +
      `var $$v=${number ? COMMON.toNumber.name + '(' + valueBinding + ')' : valueBinding},` +
          `$$i=${COMMON.looseIndexOf.name}($$a,$$v);` +
      `if($$c){$$i<0&&(${value}=$$a.concat($$v))}` +
      `else{$$i>-1&&(${value}=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}` +
    `}else{${genAssignmentCode(value, '$$c')}}`,
    null, true
  )
}

function genRadioModel (
    el: ASTElement,
    value: string,
    modifiers: ?ASTModifiers
) {
  const number = modifiers && modifiers.number
  let valueBinding = getBindingAttr(el, 'value') || 'null'
  valueBinding = number ? `${COMMON.toNumber.name}(${valueBinding})` : valueBinding
  addAttr(el, 'checked', `${COMMON.looseEqual.name}(${value},${valueBinding})`)
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true)
}

function genSelect (
    el: ASTElement,
    value: string,
    modifiers: ?ASTModifiers
) {
  const number = modifiers && modifiers.number
  const selectedVal = `Array.prototype.filter` +
    `.call($event.target.options,function(o){return o.selected})` +
    `.map(function(o){var val = "_value" in o ? o._value : o.value;` +
    `return ${number ? COMMON.toNumber.name + '(val)' : 'val'}})`

  const assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]'
  let code = `var $$selectedVal = ${selectedVal};`
  code = `${code} ${genAssignmentCode(value, assignment)}`
  addAttr(el, 'value', `(${value}) == null ? '' : (${value})`)
  addHandler(el, 'change', code, null, true)
}

function genDefaultModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean {
  const type = el.attrsMap.type
  const { lazy, number, trim } = modifiers || {}

  let valueExpression = '$event.target.value'
  if (trim) {
    valueExpression = `$event.target.value.trim()`
  }
  if (number) {
    valueExpression = `${COMMON.toNumber.name}(${valueExpression})`
  }

  const code = genAssignmentCode(value, valueExpression)
  // const needCompositionGuard = !lazy && type !== 'range'
  // if (needCompositionGuard) {
  //   code = `if($event.target.composing)return;${code}`
  // }

  addAttr(el, 'value', `(${value}) == null ? '' : (${value})`)
  if (lazy) {
    addHandler(el, 'blur', code, null, true)
  } else {
    addHandler(el, 'change', code, null, true)
  }
  if (trim || number || type === 'number') {
    addHandler(el, 'blur', 'this.forceUpdate()')
  }
}

function genComponentModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
) {
  const { number, trim } = modifiers || {}

  const baseValueExpression = 'arguments[0]'
  let valueExpression = baseValueExpression
  if (trim) {
    valueExpression =
      `(typeof ${baseValueExpression} === 'string'` +
        `? ${baseValueExpression}.trim()` +
        `: ${baseValueExpression})`
  }
  if (number) {
    valueExpression = `${COMMON.toNumber.name}(${valueExpression})`
  }

  // let valueExpression = 'value'
  // if (trim) {
  //   valueExpression = `value.trim()`
  // }
  // if (number) {
  //   valueExpression = `${COMMON.toNumber.name}(${valueExpression})`
  // }

  let code = genAssignmentCode(value, valueExpression)
  code = `function () {${code}}`

  addAttr(el, 'value', `(${value}) == null ? '' : (${value})`)
  addHandler(el, 'input', code, null, true)
}
