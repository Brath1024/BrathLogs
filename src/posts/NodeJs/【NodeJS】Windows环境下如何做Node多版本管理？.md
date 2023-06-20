---
date: 2022-03-28 14:44:03

title: 【NodeJS】Windows环境下如何做Node多版本管理？
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【NodeJS】Windows环境下如何做Node多版本管理？

# 前言

​		在多个不同的前端项目中，总会遇到nodeJs需求版本不一致的情况，例如，项目A需要node12版本，项目B要求不能小于node16版本，此时就产生了冲突，因此我们需要使用一个Node版本控制来解决这一系列的问题。



# nvm-windows

​		在 Windows 环境下，可以使用 `nvm-windows` 工具来管理多个 Node.js 版本。与 `nvm` 相似，`nvm-windows` 也是一个 Node.js 版本管理器，可以让你在同一台计算机上安装和管理多个 Node.js 版本。

以下是使用 `nvm-windows` 工具的步骤：

1. 下载安装包

   ```shell
   https://github.com/coreybutler/nvm-windows/releases/tag/1.1.11
   ```

首先需要下载并安装 `nvm-windows` 工具。可以从 GitHub 上下载最新版本的安装包。下载后，直接运行安装程序按照提示进行安装即可。

1. 安装 Node.js 版本

安装完成后，在命令行中输入以下命令来安装 Node.js 的不同版本：

```
nvm install 14.17.5
```

这将安装 Node.js v14.17.5 版本。如果要安装其他版本，只需将 `14.17.5` 替换为所需的版本即可。安装完成后，可以使用以下命令查看已安装的 Node.js 版本：

```
nvm list
```

1. 切换 Node.js 版本

要切换到已安装的特定版本，可以使用以下命令：

```
nvm use 14.17.5
```

这将使当前命令行窗口使用 Node.js v14.17.5 版本。如果要设置默认版本，请使用以下命令：

```
nvm alias default 14.17.5
```

这将将 Node.js v14.17.5 设置为默认版本。每次打开一个新的命令行窗口时，都会自动将其设置为默认版本。

1. 其他命令

除了上述命令外，`nvm-windows` 还提供了其他有用的命令，例如：

- `nvm on`：启用 `nvm` 环境变量。
- `nvm off`：禁用 `nvm` 环境变量。
- `nvm uninstall 14.17.5`：卸载 Node.js v14.17.5 版本。

以上是在 Windows 环境下使用 `nvm-windows` 工具管理多个 Node.js 版本的基本步骤。



## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
