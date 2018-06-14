export default function text (ast) {
  const children = []
  const directive = ast.directives.filter(v => v.name === 'text')[0]
  children.push({
    type: 2,
    text: `{{ ${directive.value} }}`
  })
  ast.children = children
}
