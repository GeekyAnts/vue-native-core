import {
	parse
} from 'compiler/parser/index'

import {
	NativeRenderGenerator
} from 'react-vue/compiler/codegen/index'

export function nativeCompiler (template, options) {
  let ast
  let importCode = ''
  let renderCode = '() => null'
  options = Object.assign({
    preserveWhitespace: false
  }, options)
  template = template.trim()
  if (template) {
    ast = parse(template, options)
    const renderer = new NativeRenderGenerator(ast, options)
    importCode = renderer.generateImport()
    renderCode = renderer.generateRender()
  }
  return {
    ast,
    importCode,
    renderCode
  }
}
