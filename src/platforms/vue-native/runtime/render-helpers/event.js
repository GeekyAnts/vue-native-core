export function event (fn) {
  if (Array.isArray(fn)) {
    return function () {
      return fn.map(v => v.apply(this, arguments))
    }
  } else {
    return fn
  }
}
