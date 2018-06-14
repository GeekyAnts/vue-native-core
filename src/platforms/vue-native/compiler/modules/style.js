import changeCase from 'change-case'

export default function parseStyleText (cssText) {
  const res = {}
  const listDelimiter = /;(?![^(]*\))/g
  const propertyDelimiter = /:(.+)/
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      const tmp = item.split(propertyDelimiter)
      if (tmp.length > 1) {
        let val = tmp[1].trim()
        if (isNaN(val) === false) {
          val = parseFloat(val)
        }
        res[changeCase.camelCase(tmp[0].trim())] = val
      }
    }
  })
  return res
}
