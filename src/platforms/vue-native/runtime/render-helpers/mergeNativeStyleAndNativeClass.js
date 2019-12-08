export function mergeNativeStyleAndNativeClass(nativeClass, nativeStyle) {
  let resultant = []
  if (nativeClass) {
    if (Object.prototype.toString.call(nativeClass) === '[object Array]') {
      nativeClass.forEach(function(classObj) {
        resultant.push(classObj)
      })
    } else if (
      Object.prototype.toString.call(nativeClass) === '[object Object]'
    ) {
      resultant.push(nativeClass)
    }
  }
  if (nativeStyle) {
    if (Object.prototype.toString.call(nativeStyle) === '[object Array]') {
      nativeStyle.forEach(function(classObj) {
        resultant.push(classObj)
      })
    } else if (
      Object.prototype.toString.call(nativeStyle) === '[object Object]'
    ) {
      resultant.push(nativeStyle)
    }
  }
  return resultant
}
