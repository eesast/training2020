# EESAST WEB

[![Build Status](https://travis-ci.com/eesast/web.svg?branch=master)](https://travis-ci.com/eesast/web)

EESAST 网页前端

## 开发

### 环境

- node 12 / npm
- yarn
- TypeScript
- Chrome / Firefox

### 工具

- VSCode 扩展

  - Prettier
  - ESLint

    在 VSCode 设置中添加以下内容，开启 ESLint 插件对 TypeScript 的支持：

    ```json
    "eslint.autoFixOnSave": true,
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        { "language": "typescript", "autoFix": true },
        { "language": "typescriptreact", "autoFix": true }
    ],
    ```

- Chrome 扩展

  - React DevTools
  - Redux DevTools

- Postman

### 脚本

#### `yarn install`

安装所有 `dependencies` 和 `devDependencies`

#### `yarn start`

启动开发服务器，监听源文件更改，并自动刷新网页

#### `yarn build`

使用 `tsc` 编译打包源文件

#### `yarn test`

进行测试

#### `yarn lint`

使用 ESLint 进行代码风格检查

#### `yarn typecheck`

检查类型错误

#### `yarn prettier`

使用 Prettier 进行代码格式修正
