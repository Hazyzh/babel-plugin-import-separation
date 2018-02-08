# babel-plugin-import-separation

a plugin for babel to load on demand from import.

---

## Where to add babel-plugin-import

- [babelrc](https://babeljs.io/docs/usage/babelrc/)
- [babel-loader](https://github.com/babel/babel-loader)

## Example

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
ReactDOM.render(<_button>xxxx</_button>);
```

## Usage

```bash
npm install babel-plugin-import-separation --save-dev
```

Via `.babelrc` or babel-loader.

```js
{
  "plugins": [["import-separation", options]]
}
```
