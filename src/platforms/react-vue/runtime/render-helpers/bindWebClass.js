export function bindWebClass (c) {
  const type = Object.prototype.toString.call(c)
  if (type === '[object Object]') {
    return Object.keys(c).filter((k) => {
      return !!c[k]
    }).join(' ')
  } else if (type === '[object Array]') {
    return c.map((v) => {
      return bindWebClass(v)
    }).join(' ')
  }
  return c
}
