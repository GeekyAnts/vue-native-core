import { baseWarn } from 'compiler/helpers'
import {
  camelize,
  capitalize
} from 'shared/util'
import RenderGenerator from './RenderGenerator'
import {
  WEB
} from '../config'
import {
  HELPER_HEADER
} from '../constants'
import {
  genHandlers,
  genCustomEventHandlers,
  genTransitionEventHandlers
} from '../modules/events'
import parseStyleText from '../modules/style'
import {
  model as genModelDirectives,
  html as genHtmlDirectives,
  text as genTextDirectives
} from '../directives/index'
import {
  isReservedTag,
  isBuildInTag
} from '../util/index'

class ReactWebRenderGenerator extends RenderGenerator {

  /**
   * override
   */
  genTag (ast) {
    let tag = ast.tag

    if (isReservedTag(tag)) {
      tag = `'${tag}'`
    } else if (isBuildInTag(tag)) {
      tag = `${tag}`
    } else {
      tag = `vm.$options.components['${capitalize(camelize(tag))}']`
    }

    return tag
  }

  /**
   * override
   */
  genProps (ast) {
    let code = []
    code = code.concat(super.genProps(ast))
    ast.attrs = ast.attrs || []
    if (this.vueConfig.scopeId) {
      code.push(`'${this.vueConfig.scopeId}': ''`)
    }
    const classProps = this.genClassProps(ast)
    if (classProps) {
      code.push(classProps)
    }
    const styleProps = this.genStyleProps(ast)
    if (styleProps) {
      code.push(styleProps)
    }
    const eventHandler = this.genEventHandler(ast)
    if (eventHandler) {
      code.push(eventHandler)
    }
    const nativeEventHandler = this.genNativeEventHandler(ast)
    if (nativeEventHandler) {
      code.push(nativeEventHandler)
    }
    return code
  }

   /**
   * override
   */
  genTemplate (ast) {
    if (ast.parent === undefined) {
      return this.genElement(ast.children[0])
    } else {
      ast.tag = WEB.emptyComponent.component
      return this.genElement(ast)
    }
  }

  /**
   * override
   */
  genTransition (ast) {
    ast.originTag = ast.tag
    ast.tag = WEB.transition.component
    ast.attrs = ast.attrs || []
    const obj = {
      name: WEB.transition.collection,
      value: ''
    }
    const arr = []
    let i = 0
    ast.children.forEach((v1, i1) => {
      if (v1.if) {
        const conditionsArr = []
        v1.ifProcessed = true
        v1.ifConditions.forEach(v2 => {
          conditionsArr.push(`{
            index: ${i++},
            exp: ${v2.block.else ? true : v2.exp},
            element: ${this.genElement(v2.block)}
          }`)
        })
        arr.push(`{
          type: 'if',
          conditions: [${conditionsArr.join(',')}]
        }`)
      } else if (Array.isArray(v1.directives) && v1.directives.filter(v => v.name === 'show').length) {
        v1.directives.forEach(v => {
          if (v.name === 'show') {
            arr.push(`{
              index: ${i++},
              type: 'show',
              exp: ${v.value},
              element: ${this.genElement(v1)}
            }`)
          }
        })
      } else if (v1.key) {
        arr.push(`{
          index: ${i++},
          type: 'key',
          exp: ${v1.key},
          element: ${this.genElement(v1)}
        }`)
      } else if (v1.component !== undefined) {
        arr.push(`{
          index: ${i++},
          type: 'component',
          exp: ${v1.component},
          element: ${this.genElement(v1)}
        }`)
      } else {
        arr.push(`{
          index: ${i++},
          exp: ${v1.component},
          element: ${this.genElement(v1)}
        }`)
      }
    })
    obj.value = `[${arr.join(',')}]`
    ast.attrs.push(obj)
    ast.children = []
    return this.genElement(ast)
  }

  /**
   * override unfinished
   */
  genTransitionGroup (ast) {
    const node = {
      tag: 'span',
      children: ast.children,
      parent: ast.parent
    }
    return this.genElement(node)
  }
  _genTransitionGroup (ast) {
    ast.tag = WEB.transitionGroup.component
    ast.attrs = ast.attrs || []
    const obj = {
      name: WEB.transitionGroup.collection,
      value: ''
    }
    const arr = []
    ast.children.forEach((v1, i1) => {
      if (v1.if) {
        const conditionsArr = []
        v1.ifProcessed = true
        v1.ifConditions.forEach(v2 => {
          conditionsArr.push(`{
            exp: ${v2.block.else ? true : v2.exp},
            element: ${this.genElement(v2.block)}
          }`)
        })
        arr.push(`{
          type: 'if',
          conditions: [${conditionsArr.join(',')}]
        }`)
      } else if (Array.isArray(v1.directives) && v1.directives.filter(v => v.name === 'show').length) {
        v1.directives.forEach(v => {
          if (v.name === 'show') {
            arr.push(`{
              type: 'show',
              exp: ${v.value},
              element: ${this.genElement(v1)}
            }`)
          }
        })
      } else {
        arr.push(`{
          exp: true,
          element: ${this.genElement(v1)}
        }`)
      }
    })
    obj.value = `[${arr.join(',')}]`
    ast.attrs.push(obj)
    ast.children = []
    return this.genElement(ast)
  }

  /**
   * gen class props
   * @param {Object} ast
   */
  genClassProps (ast) {
    let code = ''
    const topParent = this.isAstTopParent(ast)
    const classAttrsValue = ast.attrs.filter(v => v.name === 'class').map(v => v.value)
    if (classAttrsValue.length === 0 && !topParent) {
      return code
    }
    let staticClass, dynamicClass
    classAttrsValue.forEach(v => {
      if (/^".*"$/.test(v) || /^'.*'$/.test(v)) {
        staticClass = v.trim() // .replace(/^"(.*)"$/, '$1')
      } else {
        dynamicClass = v
      }
    })
    if (staticClass) {
      code += ` ${staticClass}`
    }
    if (dynamicClass) {
      code = code.replace(/"$/, ' "')
      code += ` + ${WEB.bindClass.name}(${dynamicClass})`
    }
    if (topParent) {
      code += `+ ' ' + (this.props.className || '')`
    }
    code = `className: (${code.trim().replace(/^[\s]*\+[\s]*/, '')}).trim()`
    return code
  }

  /**
   * gen style props
   * @param {Object} ast
   */
  genStyleProps (ast) {
    const styleAttrsValue = ast.attrs.filter(v => v.name === 'style').map(v => v.value)
    const show = ast.directives && ast.directives.filter(v => v.name === 'show')[0]
    const topParent = this.isAstTopParent(ast)
    if (styleAttrsValue.length === 0 && !show && !topParent) {
      return
    }
    let staticStyle, dynamicStyle, showStyle
    styleAttrsValue.forEach(v => {
      if (/^".*"$/.test(v)) {
        staticStyle = v.trim().replace(/;*"$/, ';"')
      } else {
        dynamicStyle = v
      }
    })
    let code = ''
    if (staticStyle) {
      try {
        staticStyle = JSON.stringify(parseStyleText(staticStyle))
      } catch (e) {}
    }
    if (show) {
      showStyle = `{display: ${show.value} ? '' : 'none'}`
    }
    if (topParent) {
      showStyle = `Object.assign({}, ${showStyle}, this.props.style)`
    }
    code = `${WEB.bindStyle.name}(${dynamicStyle}, ${staticStyle}, ${showStyle})`
    code = `style: ${code.trim().replace(/^[\s]*\+[\s]*/, '')}`
    return code
  }

  /**
   * override
   * @param {Object} ast
   */
  genIMEResolve (ast) {
    ast.attrs = ast.attrs || []
    ast.attrs.push({
      name: WEB.inputComponent.tag,
      value: `'${ast.tag}'`
    })
    ast.tag = WEB.inputComponent.component
    return this.genElement(ast)
  }

  genDirectives (ast) {
    const code = super.genDirectives(ast)
    ast.directives.forEach((v) => {
      if (v.name === 'model') {
        this.genModelDirectives(ast, v)
      } else if (v.name === 'html') {
        this.genHtmlDirectives(ast)
      } else if (v.name === 'text') {
        this.genTextDirectives(ast)
      }
    })
    return code
  }

  genModelDirectives (ast, directive) {
    return genModelDirectives(ast, directive, baseWarn)
  }

  genHtmlDirectives (ast) {
    return genHtmlDirectives(ast)
  }

  genTextDirectives (ast) {
    return genTextDirectives(ast)
  }

  genEventHandler (ast) {
    let code = ''
    if (ast.events) {
      if (isReservedTag(ast.tag) || isBuildInTag(ast.tag)) {
        if (ast.tag === WEB.transition.component) {
          code = genTransitionEventHandlers(ast.events, this.vueConfig)
        } else {
          code = genHandlers(ast.events, this.vueConfig)
        }
      } else {
        code = genCustomEventHandlers(ast.events, this.vueConfig)
        // code = Object.keys(ast.events).map(k => {
        //   return `'${COMMON.customEvent.name}${k}': ${ast.events[k].value}`
        // }).join(',')
      }
    }
    return code
  }

  genNativeEventHandler (ast) {
    let code = ''
    if (ast.nativeEvents && !isReservedTag(ast.tag)) {
      code = `${HELPER_HEADER}nativeEvents: {${genHandlers(ast.nativeEvents, this.vueConfig)}}`
    }
    return code
  }

  isAstTopParent (ast) {
    if (ast.parent === undefined) {
      return true
    }
    if (ast.parent.tag === 'template' || ast.parent.tag === 'transition' || ast.parent.originTag === 'transition') {
      if (ast.parent.parent === undefined) {
        return true
      }
    }
    return false
  }
}

export default ReactWebRenderGenerator
