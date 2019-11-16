import RenderGenerator from './RenderGenerator'

import { camelize, capitalize } from 'shared/util'

import { genHandlers, genCustomEventHandlers } from '../modules/events'
import { NATIVE } from '../config'
import parseStyleText from '../modules/style'
import { isReservedTag, isBuildInTag } from '../util/index'

import { HELPER_HEADER } from '../constants'

class ReactNativeRenderGenerator extends RenderGenerator {
  constructor(ast, options) {
    super(ast, options)
    this.isNative = true
  }

  /**
   * override
   */
  genTag(ast) {
    let tag = ast.tag

    if (isBuildInTag(tag)) {
      tag = `${tag}`
    } else {
      const c = tag
        .split(':')
        .map(v => `['${capitalize(camelize(v))}']`)
        .join('')
      tag = `vm.$options.components${c}`
    }

    return tag
  }

  /**
   * override
   * gen text expression
   * @param {Object} ast
   */
  genTextExpression(ast) {
    let code = super.genTextExpression(ast)
    code = code.replace(/^"\\n\s*/, '"').replace(/\\n\s*"$/, '"')
    return code
  }

  /**
   * override
   * gen text
   * @param {Object} ast
   */
  genText(ast) {
    let code = super.genText(ast)
    code = code.replace(/^"\\n\s*/, '"').replace(/\\n\s*"$/, '"')
    return code
  }

  /**
   * override
   */
  genProps(ast) {
    let code = []
    ast.attrs = ast.attrs || []
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
    if (Array.isArray(ast.attrs)) {
      const props = ast.attrs
        .filter(v => {
          return v.name !== 'class' && v.name !== 'style' && v.name !== 'v-pre'
        })
        .map(v => {
          let name = v.name
          name = camelize(name)
          return `${name}: ${v.value}`
        })
      code = code.concat(props)
    }

    const styleProps = this.genNativeStyleProps(ast)
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

  genTemplate(ast) {
    if (ast.parent === undefined) {
      return this.genElement(ast.children[0])
    } else {
      if (ast.children.length > 1) {
        ast.tag = 'view'
        return this.genElement(ast)
      } else {
        return this.genElement(ast.children[0])
      }
    }
  }

  genEventHandler(ast) {
    let code = ''
    if (ast.events) {
      if (isReservedTag(ast.tag) || isBuildInTag(ast.tag)) {
        code = genHandlers(ast.events, this.vueConfig)
      } else {
        code = genCustomEventHandlers(ast.events, this.vueConfig)
      }
    }
    return code
  }

  genNativeEventHandler(ast) {
    let code = ''
    if (ast.nativeEvents && !isReservedTag(ast.tag)) {
      code = `${HELPER_HEADER}nativeEvents: {${genHandlers(
        ast.nativeEvents,
        this.vueConfig,
      )}}`
    }
    return code
  }

  // merge style & class
  genNativeStyleProps(ast) {
    const classProps = this.genClassProps(ast)

    const styleProps = this.genStyleProps(ast)

    // merge style and class props into style
    return `style: ${NATIVE.mergeStyleAndClass.name}(${classProps}, ${styleProps})`
  }

  /**
   * gen style props
   * @param {Object} ast
   */
  genStyleProps(ast) {
    const styleAttrsValue = ast.attrs
      .filter(v => v.name === 'style')
      .map(v => v.value)
    const show =
      ast.directives && ast.directives.filter(v => v.name === 'show')[0]
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
    if (staticStyle) {
      try {
        staticStyle = JSON.stringify(parseStyleText(staticStyle))
      } catch (e) {}
    }
    if (show) {
      showStyle = `{display: ${show.value} ? '' : 'none'}`
    }
    return `${NATIVE.bindStyle.name}(${dynamicStyle}, ${staticStyle}, ${showStyle})`
  }

  /**
   * gen class props
   * @param {Object} ast
   */
  genClassProps(ast) {
    const topParent = this.isAstTopParent(ast)
    const classAttrsValue = ast.attrs
      .filter(v => v.name === 'class')
      .map(v => v.value)
    if (classAttrsValue.length === 0 && !topParent) {
      return
    }
    let staticClass, dynamicClass
    classAttrsValue.forEach(v => {
      if (/^".*"$/.test(v) || /^'.*'$/.test(v)) {
        staticClass = v.trim() // .replace(/^"(.*)"$/, '$1')
      } else {
        dynamicClass = v
      }
    })
    let objCode = '{'
    if (staticClass) {
      objCode += `staticClass: ${staticClass},`
    }
    if (dynamicClass) {
      objCode += `dynamicClass: ${dynamicClass},`
    }
    if (topParent) {
      objCode += `parentClass: this.props.style,`
    }
    objCode = `${objCode.replace(/,$/, '')}}`
    return `${NATIVE.bindClass.name}.call(this, ${objCode})`
  }

  isAstTopParent(ast) {
    if (ast.parent === undefined) {
      return true
    }
    if (
      ast.parent.tag === 'template' ||
      ast.parent.tag === 'transition' ||
      ast.parent.originTag === 'transition'
    ) {
      if (ast.parent.parent === undefined) {
        return true
      }
    }
    return false
  }
}

export default ReactNativeRenderGenerator
