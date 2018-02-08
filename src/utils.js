/**
 * 生成lib下对应包的名字
 * 规则为首字母小写后面如果有大写字母则转换为 - 加上对应的小写字母
 * 【 Button组建 -> button， DatePicker -> data-picker】
 * @param  {string} _str 对应的间隔符号 会返回一个可以生成对应间隔符号的函数
 * @return {func}      对应包的路径名称
 */
const formatCamel = (_sym) => (_str) => {
  if (_sym === false) return _str

  const str = _str[0].toLowerCase() + _str.substr(1)
  return str.replace(/([A-Z])/g, ($1) => `${_sym}${$1.toLowerCase()}`)
}

export const winPath = (path) => {
  return path.replace(/\\/g, '/')
}

export class Configuration {
  constructor(
    libraryName,
    libraryDirectory,
    style,
    camelSymbol,
    fileName,
    onlyStyle
  ) {
    this.libraryName = libraryName
    this.libraryDirectory = typeof libraryDirectory === 'undefined'
      ? 'lib'
      : libraryDirectory
    this.style = style || false
    this.fileName = fileName || ''
    this.camelSymbol = typeof camelSymbol === 'undefined' ? '-' : camelSymbol
    this.onlyStyle = onlyStyle || false
    this.formatHandler = formatCamel(this.camelSymbol)
  }
}
