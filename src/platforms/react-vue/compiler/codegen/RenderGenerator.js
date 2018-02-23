import changeCase from 'change-case'
import { camelize } from 'shared/util'
import {
  COMMON
} from '../config'
import {
  HELPER_HEADER
} from '../constants'
import {
  isReservedTag,
  isBooleanAttr
} from '../util/index'
import BaseGenerator from './BaseGenerator'
import {
  filterDirective,
  filterDirectiveBindProps,
  transformSpecialNewlines
} from 'react-vue/compiler/helpers'
import {
  parseText
} from 'react-vue/compiler/parser/text-parser'
import propertyMap from 'react-vue/compiler/property/index'

class RenderGenerator extends BaseGenerator {
  genElement (ast) {
    // text
    if (ast.type === 3) {
      return this.genText(ast)
    }

    // text expression
    if (ast.type === 2) {
      return this.genTextExpression(ast)
    }

    // for
    if (ast.for && !ast.forProcessed) {
      return this.genFor(ast)
    }

    // if condition
    if (ast.if && !ast.ifProcessed) {
      return this.genIf(ast)
    }

    if (ast.tag === 'slot') {
      return this.genSlot(ast)
    }

    if (ast.tag === 'template') {
      return this.genTemplate(ast)
    }

    if (ast.tag === 'transition') {
      return this.genTransition(ast)
    }

    if (ast.tag === 'transition-group') {
      return this.genTransitionGroup(ast)
    }

    // for web platform, we wrapped node in a buildin component to prevent IME problem
    if (this.isWebInput(ast)) {
      return this.genIMEResolve(ast)
    }

    const s = `${COMMON.createElement.name}(`
    const e = `)`

    let tag = this.genTag(ast)

    // for directive, we transform tag to a buildin component to achieve directive lifecycle
    if (filterDirective(ast).length) {
      tag = COMMON.directive.component
    }

    // for dynamic component eg: <component is="view">
    if (ast.tag === 'component') {
      tag = `${COMMON.dynamicComponent.name}(vm, ${ast.component})`
    }

    let props = this.genProps(ast)
    if (props.length) {
      props = `{${props.join(',')}}`
    } else {
      props = 'null'
    }

    // for modifiers eg: @click.native
    if (ast.parent === undefined) {
      // props = `Object.assign({}, this.props.${HELPER_HEADER}nativeEvents, ${props})`
      props = `${COMMON.mergeProps.name}.call(this, this.props.${HELPER_HEADER}nativeEvents, ${props})`
    }

    // for template $props eg: v-bind:$props
    if (filterDirectiveBindProps(ast).length) {
      props = `Object.assign({}, vm.$props, ${props})`
      props = `${COMMON.handleProps.name}(${props}, '${ast.tag}')`
    }

    props = `,${props}`

    let children = this.genChildren(ast)
    if (children.length) {
      children = `,${children.join(',')}`
    }

    return `${s}${tag}${props}${children}${e}`
  }

  /**
   * gen children, include slot template generate
   * @param {Object} ast
   */
  genChildren (ast) {
    let children = []
    if (ast.children && ast.children.length) {
      children = children.concat(ast.children.map((v) => {
        return this.genElement(v)
      }))
    }
    if (ast.scopedSlots) {
      children = children.concat(Object.keys(ast.scopedSlots)
        .map(v => ast.scopedSlots[v])
        .map(v => {
          const slotCode = this.genElement(v) || ''
          const slotScope = v.slotScope
          const render = `render: (${slotScope}) => ${slotCode.trim()}`
          const type = `type: '${COMMON.template.type}'`
          const slot = `'data-slot': ${v.slotTarget}`
          const code = `{${type},${render},${slot}}`
          return code
        }))
    }
    return children
  }

  /**
   * gen text expression
   * @param {Object} ast
   */
  genTextExpression (ast) {
    return parseText(ast.text)
  }

  /**
   * gen text
   * @param {Object} ast
   */
  genText (ast) {
    const text = transformSpecialNewlines(ast.text)
    return JSON.stringify(text)
  }

  /**
   * gen if condition
   * @param {Object} ast
   */
  genIf (ast) {
    ast.ifProcessed = true
    return this.genIfConditions(ast.ifConditions.slice())
  }

  genIfConditions (conditions) {
    if (!conditions.length) {
      return 'null'
    }
    const condition = conditions.shift()
    let code
    if (condition.exp) {
      code = `(${condition.exp}) ?${this.genElement(condition.block)} : ${this.genIfConditions(conditions)}`
    } else {
      code = `${this.genElement(condition.block)}`
    }
    return code
  }

  /**
   * gen for
   * @param {Object} ast
   */
  genFor (ast) {
    const exp = ast.for
    const alias = ast.alias
    const iterator1 = ast.iterator1 ? `,${ast.iterator1}` : ''
    const iterator2 = ast.iterator2 ? `,${ast.iterator2}` : ''

    ast.forProcessed = true

    const code = `${COMMON.renderList.name}(${exp}, function (${alias}${iterator1}${iterator2}){return ${this.genElement(this.genKeyFor(ast))}}.bind(this))`
    return code
  }

  /**
   * gen slot
   * @param {Object} ast
   */
  genSlot (ast) {
    const name = ast.slotName
    const props = []
    this.setSlots(ast.slotName)
    if (Array.isArray(ast.attrs)) {
      ast.attrs.forEach((v) => {
        props.push(`${v.name}: ${v.value}`)
      })
    }
    let code = `${COMMON.renderSlot.value}(${name}, {${props.join(',')}})`
    this.genChildrenKey(ast)
    const children = this.genChildren(ast)
    if (children.length) {
      code += ` || [${children.join(',')}]`
    }
    return code
  }

  /**
   * gen a empty component
   * @param {Object} ast
   */
  genTemplate (ast) {
    return this.genElement(ast.children[0])
  }

  /**
   * gen children key
   * @param {Object} ast
   */
  genChildrenKey (ast) {
    ast.children.forEach((v, i) => {
      v.attrs = v.attrs || []
      v.attrs.push({
        name: 'key',
        value: String(i)
      })
    })
  }

  /**
   * gen transition helper, this function would be override by sub class
   * @param {Object} ast
   */
  genTransition (ast) {
    return this.genChildren(ast)
  }

  /**
   * gen transition group helper, this function would be override by sub class
   * @param {Object} ast
   */
  genTransitionGroup (ast) {
    return this.genChildren(ast)
  }

  /**
   * gen props, this funciton would be override by sub class
   * @param {Object} ast
   */
  genProps (ast) {
    let code = []
    if (filterDirective(ast).length) {
      const directives = this.genDirectives(ast)
      if (directives) {
        code.push(directives)
      }
      const directiveTag = this.genDirectiveTag(ast)
      if (directiveTag) {
        code.push(directiveTag)
      }
      const directiveContext = this.genDirectiveContext(ast)
      if (directiveContext) {
        code.push(directiveContext)
      }
    }
    if (ast.slotTarget !== undefined) {
      this.genSlotTarget(ast)
    }
    if (ast.ref || ast.parent === undefined) {
      const ref = this.genRef(ast)
      if (ref) {
        code.push(ref)
      }
    }
    if (ast.key !== undefined) {
      const key = this.genKey(ast)
      if (key) {
        code.push(key)
      }
    }
    if (Array.isArray(ast.attrsList)) {
      ast.attrsList.forEach(v => {
        if (v.name === 'v-bind' && /^\{.*\}$/.test(v.value)) {
          try {
            const matchVArr = v.value.match(/^\{(.*)\}$/)
            if (matchVArr && matchVArr[1]) {
              matchVArr[1].split(',').forEach(_v => {
                const _vArr = _v.split(':')
                if (_vArr.length === 2) {
                  ast.attrs.push({
                    name: _vArr[0].trim(),
                    value: _vArr[1].trim()
                  })
                }
              })
            }
          } catch (e) {
            console.log('parse error for v-bind obj')
          }
        }
      })
    }
    if (Array.isArray(ast.attrs)) {
      const props = ast.attrs
        .filter(v => {
          return v.name !== 'class' && v.name !== 'style' && v.name !== 'v-pre'
        })
        .map((v) => {
          let value = v.value
          let name = v.name
          if (name.indexOf('data-') === 0 ||
            name.indexOf(HELPER_HEADER) === 0) {
            return `'${name}': ${value}`
          }
          if (name === 'for') {
            name = 'htmlFor'
          }
          if (isBooleanAttr(name)) {
            if (value === '""') {
              value = 'true'
            }
          }
          if (!isReservedTag(ast.tag)) {
            name = camelize(name)
          } else if (propertyMap[name]) {
            name = propertyMap[name]
          }
          return `'${name}': ${value}`
        })
      code = code.concat(props)
    }
    return code
  }

  /**
   * gen common directive, this function would be override by SubClass
   */
  genDirectives (ast) {
    let code = []
    ast.directives.forEach((v) => {
      code.push(`{name:"${v.name}",directiveName:"${changeCase.lowerCase(changeCase.camelCase(v.name))}",rawName:"${v.rawName}"${
        v.value ? `,value:(${v.value}),expression:${JSON.stringify(v.value)}` : ''
      }${
        v.arg ? `,arg:"${v.arg}"` : ''
      }${
        v.modifiers ? `,modifiers:${JSON.stringify(v.modifiers)}` : ''
      }}`)
    })
    code = `${COMMON.directive.name}: [${code.join(',')}]`
    return code
  }

  genDirectiveTag (ast) {
    let code = ''
    code += `${COMMON.directive.tag}: ${this.genTag(ast)}`
    return code
  }

  genDirectiveContext (ast) {
    let code = ''
    code += `${COMMON.directive.context}: this`
    return code
  }

  /**
   * gen slot props
   * @param {Object} ast
   */
  genSlotTarget (ast) {
    ast.attrs = ast.attrs || []
    ast.attrs.push({
      name: 'data-slot',
      value: ast.slotTarget
    })
  }

  genKey (ast) {
    return `key: ${ast.key}`
  }

  /**
   * gen key in for iterator
   * @param {Object} ast
   */
  genKeyFor (ast) {
    if (!ast.key) {
      const obj = {}
      obj.name = 'key'
      obj.value = 'arguments[1]'
      ast.attrs = ast.attrs || []
      ast.attrs.push(obj)
    }
    return ast
  }

  /**
   * gen ref
   */
  genRef (ast) {
    let code1 = ''
    let code2 = ''
    if (ast.ref) {
      code1 = `this.setRef(ref, ${ast.ref}, ${ast.refInFor});`
    }
    if (ast.parent === undefined) {
      // setRootRef for $el, this.props.setRef for transition component
      code2 = `this.setRootRef(ref);this.props['${COMMON.setRef.name}'] && this.props['${COMMON.setRef.name}'](ref);`
    }
    return `ref: (ref) => {
      ${code1}${code2}
    }`
  }

  /**
   * wrapped node in a buildin component to prevent IME problem
   * @param {Object} ast
   */
  genIMEResolve (ast) {
    ast.inputProcessed = true
    return this.genElement(ast)
  }

  /**
   * generate react tag, this funciton would be override by sub class
   * @param {String} tag
   */
  genTag (ast) {
    return ast.tag
  }

  /**
   * for web platform, we wrapped node in a buildin component to prevent IME problem
   * @param {Object} ast
   */
  isWebInput (ast) {
    if (!ast.inputProcessed) {
      if (ast.tag === 'textarea') {
        return true
      } else if (ast.tag === 'input') {
        const type = ast.attrs.filter(v => v.name === 'type')[0]
        if (type === undefined) {
          return true
        } else if (type.value === 'text' || type.value === 'password') {
          return true
        }
      }
    }
    return false
  }
}

export default RenderGenerator
