# 东北吃大

app 文件夹为小程序文件，server 文件夹为服务器端文件。

> 由于小程序已经全面采用 Typescript，请确保阅读[**安装步骤**](#安装)

## TODO

- 收藏栏添加搜索功能
- 收藏栏添加编辑功能
- 卡片页面增加引导提示
- 卡片页面增加收藏栏按钮
- 优化搜索
- 通知页面的进一步制作
- 水果页面重构
- 将价格页面变成水果页面里的弹窗，并对样式做进一步优化
- 在合适的位置加入水果价格输入，并做优化

## 安装

1. 确保本机已经安装 node 与 yarn。

    测试方式: 打开终端，运行 `node -v` 和 `yarn -v` 应该输出两者的版本号 `v12.16.1` 和 `1.22.4`。

    如果提示找不到命令或版本号偏低，请到群里找 node 与 yarn 的安装包进行安装。

2. 确保本机拥有最新的开发者工具，版本号为 `1.02.2004020`，如果版本号偏低请到群文件下载安装。

3. 使用 Git 克隆本项目。( `git clone git@github.com:nenuyouth/QQmini.git` )

4. 使用 VSCode 打开本项目文件夹，执行 `yarn install` 命令。

## TS 代码

Typescript 是微软开发的针对 Javascript 的超集，由于小程序不能直接运行 TS 文件，所以每次修改 TS 文件后，需要使用 `tsc` 命令将 `*.ts` 文件编译为 `*.js` 文件。

所以，每当你**更改了 ts 文件中的代码**、或者 **拉取了新的代码**，请在左下角的 **NPM 脚本** 找到 `ts:compile` 命令运行它。

## 工作流程

### 代码编写

1. **注意代码格式**

    在你使用 `yarn install` 命令安装相应依赖后，VSCode 会为本项目启用 `eslint` 代码提示与格式化处理器。

    在编写中，您需要全程注意注意 Linter 的提示。如 eslint 报错或 VSCode 在问题面板给出了其他问题，请务必消除你的错误再进行提交。

2. **合理的变量名与注释**

    请着重注意选择合理的变量名，同时添加合理注释，让其他人能够看懂你写的代码。

    - 建议遵循 JSDoc 规范添加注释，如果你不清楚，请仿照其他文件中的注释进行添加。

    - 永远使用 camelCase 规范的变量名，让变量名有意义，如 `secendInOneDay` `foodListLength` `myFavorList` 等，不要使用 `i`、`j`、`k` 等。

    - 选择合适的函数名，如果函数名不能够让人明白此函数的作用，请务必在函数名上面的一行添加注释，说明函数作用。

    - 当函数逻辑过于复杂的时候，添加注释说明这些函数语句的作用。

### 打包版本

**所有人都不应该直接向 Master 分支推送代码，必须使用 PR。**

> 另外，所有 2019级成员没有向 Master 推送的权限，故直接向 Master 分支推送会提示错误。

1. **分支名称**

    请新建一个 `人员/功能` 的分支，在其之上完成代码。并推送到该远程库。

    请使用规范的分支名称，如 `lin/dice` `yao/mainPage` 等。保证与其他人的分支，和你的其他功能分支相区分。

2. **完成 commit**

    **不要在 VSCode 的 Git 面板直接提交 Commit。**

    永远在终端输入 `git cz` 命令(或在左下角 **NPM 脚本** 运行 `commit` 命令) 来完成 commit。

    `git cz` 命令会要求你输入一个规范的 commit 信息，并在打包前运行 Linter 检查。

    如果你始终无法完成打包，一定是因为你的代码中包含了一些编译错误或格式错误。请运行 `yarn run lint`， 并修复其中的错误。

3. 在向自己的分支推送代码后，请使用 Github 网页上的 Pull Request 功能，向主分支发起提交请求。

   > PR 测试会检查代码的格式，如果 PR 测试不通过，请自行寻找原因。
