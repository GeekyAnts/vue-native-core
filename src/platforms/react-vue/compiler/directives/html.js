export default function html (ast, level) {
  const obj = {}
  const directive = ast.directives.filter(v => v.name === 'html')[0]
  obj.name = 'dangerouslySetInnerHTML'
  obj.value = `{__html: '${directive.value}'}`
  ast.attrs = ast.attrs || []
  ast.attrs.push(obj)
}
