# babel-plugin-import-separation

此`plugin`为了按需引入库里面的文件和内容

---

## 在哪里去添加 babel-plugin-import-separation

- [babelrc](https://babeljs.io/docs/usage/babelrc/)
- [babel-loader](https://github.com/babel/babel-loader)

## 为什么要用 babel-plugin-import-separation

此插件参考[babel-plugin-import](https://github.com/ant-design/babel-plugin-import)相关思路，在使用`babel-plugin-import`中有一些无法解决的问题，这里用另一种思路去解决问题，解决打包过程中一些问题。

- 应用`cdn`资源时候可以按需引入样式文件
- 不改写代码内部变量，只重新定义了引入变量

在`babel-plugin-import`中，作者重写了引入内容，以新变量代替了原来引入的内容，并且在后续代码中修改了使用到的变量为修改后的名字，效果如下

```javascript
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓
      
var _button = require('antd/lib/button');
ReactDOM.render(<_button>xxxx</_button>);
```

本插件只改变`import`相关内容，用相同变量名覆盖之前引入的内容，不该写后续代码逻辑，转换后代码如下
```javascript
import Button from 'antd/lib/button';
ReactDOM.render(<Button>xxxx</Button>);
```

而且相关配置支持只引入样式文件，不该写其他内容，满足了`cdn`引入相关资源又自定义样式的业务需求。


## 实例

#### `{ "libraryName": "antd" }`

```javascript
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓

import Button from 'antd/lib/button';
ReactDOM.render(<Button>xxxx</Button>);
```

#### `{ "libraryName": "antd", style: true }`

```javascript
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓

import 'antd/lib/button/style';
import Button from 'antd/lib/button';
ReactDOM.render(<Button>xxxx</Button>);
```

## 使用

```bash
npm install babel-plugin-import-separation --save-dev
```

在`babelrc`或者`babel-loader`中写入配置

```js
{
  "plugins": [["import-separation", options]]
}
```

### 支持多个库 

#### `babel6` 及以下版本如下

```js
{
  "plugins": [
        ["import-separation", 
            [ {...option1}, {...option2} ]
        ]
      ]
}
```
#### `babel7` Options 不能为数组，但是你可以添加多次用不同的名字

```js
{
  "plugins": [
        ["import-separation", options1, 'antd'],
        ["import-separation", options2, 'lodash']
      ]
}
```

