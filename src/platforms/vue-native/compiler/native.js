import _ from 'lodash'

import { parse, processAttrs } from 'compiler/parser/index'

import { NativeRenderGenerator } from 'vue-native/compiler/codegen/index'

export function nativeCompiler(template, options) {
  let ast
  let importCode = ''
  let renderCode = '() => null'
  options = Object.assign(
    {
      preserveWhitespace: false,
    },
    options,
  )
  template = template.trim()
  if (template) {
    ast = parse(template, options)
    let importObj = { imports: [] }
    traverse(ast, options, importObj)
    let imports = importObj.imports
    const renderer = new NativeRenderGenerator(ast, options)
    importCode = renderer.generateImport()
    renderCode = renderer.generateRender()
    // Remove extra commas
    renderCode = renderCode.replace(/\},{2,}/g, '},')
    renderCode = renderCode.replace(/\),{2,}/g, '),')
    // Add imports of the render props missing from main import
    let requiredImports = []
    imports.forEach(customImport => {
      if (importCode.indexOf(customImport) === -1) {
        requiredImports.push(customImport)
      }
    })
    let requiredImportsString = requiredImports.join(',')
    if (requiredImportsString) {
      importCode = importCode.replace(
        /\} from 'vue-native-helper'/g,
        `, ${requiredImportsString} } from 'vue-native-helper'`,
      )
    }
  }
  return {
    ast,
    importCode,
    renderCode,
  }
}

function traverse(ast, options, importObj, parent = null, childIndex) {
  // Check for render-prop and render-prop-fn within child, if yes then add that as a prop
  //
  if (
    ast.attrsMap &&
    (ast.attrsMap['render-prop'] || ast.attrsMap['render-prop-fn']) &&
    ast.parent
  ) {
    let slotname = ast.attrsMap['render-prop'] || ast.attrsMap['render-prop-fn']
    if (slotname && ast.parent) {
      // Get modules imported for slots
      let importModules = processAttrs(ast, options, true)
      importObj.imports = _.union(importObj.imports, importModules)
      if (parent) {
        delete parent.children[childIndex]
      }
    }
  }
  if (ast.children) {
    ast.children.forEach((child, index) => {
      if (child.ifConditions) {
        child.ifConditions.forEach((condition, conditionIdx) => {
          traverse(condition.block, options, importObj, child, conditionIdx)
        })
      }
      traverse(child, options, importObj, ast, index)
    })
  }
}
