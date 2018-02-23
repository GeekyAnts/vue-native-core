import {
	parse
} from 'compiler/parser/index'

import {
	WebRenderGenerator
} from 'react-vue/compiler/codegen/index'

import {
  isPreTag,
  isUnaryTag,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace
} from './util/index'

const baseOptions = {
  expectHTML: true,
  isPreTag,
  isUnaryTag,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace
}

export function compile (template, options) {
  let ast
  let code
  template = template.trim()
  if (template) {
    ast = parse(template, Object.assign({}, baseOptions, options))
    const renderer = new WebRenderGenerator(ast, options)
    code = renderer.generate()
  } else {
    code = 'export default () => null'
  }
  return {
    ast,
    code
  }
}
