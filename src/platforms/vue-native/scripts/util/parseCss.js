import { parseTransform } from './parseTransform'

const camelizeRE = /-(\w)/g

function camelize(str) {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}

function parseDeclarations(declarations) {
  const declarationObj = {}

  // Comments and @media blocks don't have declarations at the top level.
  if (declarations) {
    declarations.forEach(function(declaration) {
      if (declaration.type === 'declaration') {
        let value = declaration.value
        if (/px$/.test(value)) {
          value = parseFloat(value.replace(/px$/, ''))
        } else if (
          declaration.property !== 'font-weight' &&
          isNaN(value) === false
        ) {
          value = parseFloat(value)
        }
        if (declaration.property === 'transform') {
          value = parseTransform(value)
        }
        declarationObj[camelize(declaration.property)] = value
      }
    })
  }

  return declarationObj
}

export function parseCss(ast) {
  const obj = {}
  if (ast.type === 'stylesheet') {
    ast.stylesheet.rules.forEach(function(rule) {
      const declarationObj = parseDeclarations(rule.declarations)
      if (rule.selectors) {
        rule.selectors.forEach(function(selector) {
          if (selector.indexOf('.') === 0) {
            obj[selector.replace(/^\./, '')] = declarationObj
          }
        })
      }
    })
  }
  return obj
}
