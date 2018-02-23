function classBinding (c) {
  const type = Object.prototype.toString.call(c)
  if (type === '[object Object]') {
    return Object.keys(c).filter((k) => {
      return !!c[k]
    })
  } else if (type === '[object Array]') {
    return c.map((v) => {
      return classBinding(v)
    }).reduce((acc, val) => {
      return acc.concat(val)
    }, [])
  }
  return c
}

export function bindNativeClass (obj) {
  let arr = []
  const style = []
  if (obj.dynamicClass) {
    console.log('obj.dynamicClass', obj.dynamicClass)
    arr = arr.concat(classBinding(obj.dynamicClass))
  }
  if (obj.staticClass) {
    arr = arr.concat(obj.staticClass.split(/\s+/))
  }
  arr.forEach(v => {
    if (typeof this.css[v] === 'number') {
      style.push(this.css[v])
    }
  })
  if (obj.parentClass) {
    style.push(obj.parentClass)
  }
  return style
}
