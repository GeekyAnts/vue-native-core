export function bindNativeStyle (styleBinding, staticStyle, showStyle) {
  if (styleBinding === undefined) {
    styleBinding = {}
  }
  staticStyle = Object.assign({}, staticStyle, showStyle)
  if (staticStyle.display === '') {
    delete showStyle.display
  }
  const type = Object.prototype.toString.call(styleBinding)
  if (type === '[object Object]') {
    return Object.assign({}, styleBinding, staticStyle)
  } else if (type === '[object Array]') {
    return styleBinding.map((v) => {
      return bindNativeStyle(v, staticStyle, showStyle)
    }).reduce((acc, val) => Object.assign(acc, val), {})
  }
}
