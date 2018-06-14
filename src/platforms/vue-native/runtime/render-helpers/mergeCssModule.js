export function mergeCssModule (computed, cssModules) {
  const _computed = Object.create(computed || null)
  Object.keys(cssModules).forEach(function (key) {
    var module = cssModules[key]
    _computed[key] = function () { return module }
  })
  return _computed
}
