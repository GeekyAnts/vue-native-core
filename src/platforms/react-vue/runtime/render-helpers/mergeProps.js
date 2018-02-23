export function mergeProps () {
  const args = Array.prototype.slice.call(arguments, 0).filter(v => v)
  const obj = {}
  args.forEach((o) => {
    Object.keys(o).forEach((k) => {
      if (!obj[k]) {
        obj[k] = []
      }
      obj[k].push(o[k])
    })
  })
  for (const k in obj) {
    const l = obj[k].length
    if (l === 1) {
      obj[k] = obj[k][0]
    } else if (l > 1) {
      const _p = obj[k]
      if (typeof _p[0] === 'function') {
        obj[k] = function () {
          for (let i = 0; i < l; i++) {
            typeof _p[i] === 'function' && _p[i].apply(this, arguments)
          }
        }.bind(this)
      } else {
        obj[k] = obj[k][l - 1]
      }
    }
  }
  return obj
}
