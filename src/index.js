import { addSideEffect } from '@babel/helper-module-imports'
import { winPath, Configuration } from './utils.js'
import { join } from 'path'
import assert from 'assert'

const tipMessage = `
  for separation should't use ImportDefaultSpecifier or ImportNamespaceSpecifier to load resource,
  error  for --> (import all from 'xxx') / (import * as other from 'xxx'),
  should for --> (import { child1, child2 } from 'xxx')
`

export default function ({ types: t }) {
  const pluginsUtil = []
  // Program visitor
  const Program = (path, {opts}) => {
    // Init plugin instances once.
    if (!pluginsUtil.length) {
      if (Array.isArray(opts)) {
        opts.forEach(
          item => {
            pluginsUtil.push(new Configuration(
              item.libraryName,
              item.libraryDirectory,
              item.style,
              item.camelSymbol,
              item.fileName,
              item.onlyStyle
            ))
          }
        )
      } else {
        assert(opts.libraryName, 'libraryName should be provided')
        assert(!(!opts.style && opts.onlyStyle), 'in onlyStyle mode must provided style')
        pluginsUtil.push(new Configuration(
          opts.libraryName,
          opts.libraryDirectory,
          opts.style,
          opts.camelSymbol,
          opts.fileName,
          opts.onlyStyle
        ))
      }
    }
  }
  // ImportDeclaration visitor
  const ImportDeclaration = (path, state) => {
    pluginsUtil.forEach( plugin => {
      const { libraryName, libraryDirectory, style, fileName, formatHandler, onlyStyle } = plugin
      if (path.get('source').isLiteral({ value: libraryName })) {
        const { node } = path
        const specifiers = node.specifiers
  
        assert(specifiers.every(spec => t.isImportSpecifier(spec)), tipMessage)
        specifiers.forEach(spec => {
          const transformedMethodName = formatHandler(spec.imported.name)
          const localName = spec.local.name
          const filePath = winPath(
            join(libraryName, libraryDirectory, transformedMethodName, fileName)
          )
          // if has style add style file
          if (style === true) {
            addSideEffect(path, `${filePath}/style`)
          } else if (style) {
            addSideEffect(path, `${filePath}/style/${style}`)
          }
          // if not onlyStyle add separation file
          if (onlyStyle !== true) {
            path.insertAfter(t.ImportDeclaration(
              [t.ImportDefaultSpecifier(t.Identifier(localName))],
              t.stringLiteral(`${filePath}`)
            ))
          }
        })
  
        if (onlyStyle !== true) {
          path.remove()
        }
      }
    })
  }

  const ret = {
    visitor: { Program, ImportDeclaration }
  }

  return ret
}
