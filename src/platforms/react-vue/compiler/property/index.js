import ARIADOMPropertyConfig from './ARIADOMPropertyConfig'
import HTMLDOMPropertyConfig from './HTMLDOMPropertyConfig'
import SVGDOMPropertyConfig from './SVGDOMPropertyConfig'
import EventConstant from './EventConstant'
import ReactProps from './ReactProps'

const propertyMap = {}

Object.keys(ARIADOMPropertyConfig.Properties).forEach(v => {
  propertyMap[v.toLowerCase()] = v
})

Object.keys(HTMLDOMPropertyConfig.Properties).forEach(v => {
  propertyMap[v.toLowerCase()] = v
})

Object.keys(SVGDOMPropertyConfig.DOMAttributeNames).forEach(v => {
  propertyMap[SVGDOMPropertyConfig.DOMAttributeNames[v]] = v
})

Object.keys(EventConstant.topLevelTypes).map(v => {
  return v.replace(/^top/, 'on')
}).forEach(v => {
  propertyMap[v.toLowerCase()] = v
})

Object.keys(ReactProps).map(v => {
  propertyMap[v.toLowerCase()] = v
})

export default propertyMap
