---
date: 2022-06-01 22:51:43

title: 充满可能的新一代辅助编程神器：Cursor
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【ChatGPT】充满可能的新一代辅助编程神器：Cursor

### 随着技术的不断进步，人工智能已经逐渐成为了编程领域中不可或缺的一部分。而今天我们要为大家介绍的，就是一款基于 GPT4 智能引擎，由 OpenAI 开发出来的全新辅助编程神器 — **Cursor**。

![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dca5b19a0af44e72aa859b914d729ec0~tplv-k3u1fbpfcp-zoom-1.image)

### **1、Cursor 编辑器**

Cursor 作为一款智能代码编辑器，为程序员们提供了惊人的编程体验。它支持多种常见编程语言，可以轻松的处理各种程序代码，同时还支持多种文件类型和格式化文本，让编辑代码变得更加轻松和舒适。除此之外，Cursor 还拥有许多强大的辅助功能，例如多种主题、多语言语法高亮，在编辑代码时可以根据不同的语言给出不同的颜色提示，让代码阅读变得更加清晰明了。同时，Cursor 还支持快捷键设置、代码折叠、括号匹配、自动缩进等功能，这让程序员们不仅可以在编写代码时更快捷地完成任务，同时也让整个编写过程变得更加高效，透彻地展现出“智能、便捷、高效”等的特性。总之，如果你正在寻找一款能够让你的编程体验更加高效、便捷、舒适的工具，那么 Cursor 绝对是一个不错的选择。无论是初学者还是已经经验丰富的程序员们，都可以从中得到惊人的帮助，成为更加专业和出色的编程专家。

### **2、Cursor 下载**

可以直接官方网站下载：www.cursor.so/

我这里也整理了最新Mac和Windows版本，提供网盘下载：

公众号发送 “Cursor”



## **3、IDE功能介绍**

首先，Cursor目前是一款独立的应用，你可以理解为是一个更精简版的sublime或vim,仅仅是一个编辑器,IDE的功能上也明显弱于VS Code。不过能够它能够借助chatgpt的能力，极大的加速我们的编程效率。

**核心功能其实只用到了两个快捷键，一个是Ctrl+K（⌘+K），一个是Ctrl+L（⌘+L）**

界面上就三个菜单栏：File、Edit、View，然后就是右上角的4个图标了。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b05dcf4354842f99cc9e8f6b082b2de~tplv-k3u1fbpfcp-watermark.image?)

点击setting按钮，出现一个设置的配置，需要注意的就是Cursor编辑器支持vim、emacs；支持绑定Copilot；支持安装不同语言的server。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1260ea24788942caa155604618eb11fb~tplv-k3u1fbpfcp-watermark.image?)
### Generate(⌘+K)

在输入框里面输入你需要让它帮助你写什么代码，回车后它就开始自动帮助你写代码了。举个例子，接到个需求要写一个H5的登录页面，可以通以快捷键输入：

```
请用hooks编写一个H5登录界面
复制代码
```

一个简单的页面架构就大致生成了：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/334408cbdc6641e19e4e24596f3ab43c~tplv-k3u1fbpfcp-watermark.image?)
### Edit Selection(⌘+K)

可以选择一段代码，然后针对这段代码提出一些修改要求，比如：

```
登录界面添加手机号校验和密码规则校验：
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e88a1664fc454606a7822a5d5f039857~tplv-k3u1fbpfcp-watermark.image?)

`根据上下文，模拟接口调用：`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a9e5234d8f5474d8cc27949fd5c4ee6~tplv-k3u1fbpfcp-watermark.image?)

### Chat(⌘+L)

类似于集成了 chatGPT，你可以在 Cursor 里面使用 chatGPT 去问任何问题，相当于不需要专门去 官网 了或者搜索引擎就可以找到答案。

上面的例子里，在生成代码后，用户还可以按下 Ctrl+L 针对生成的代码进行提问：

![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a41908066ebb43ebb361b62aed815959~tplv-k3u1fbpfcp-zoom-1.image)

### Chat Selection(⌘+L)

可以选择一段代码，然后针对这段代码提出一些问题。例如你最近想了解下react中的diff算法是怎么实现的，你可以借助Cursor找到具体的位置并得到解释：

![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/898a00e82c174f479c1d1ae0afe1f751~tplv-k3u1fbpfcp-zoom-1.image)

  


## 对比GitHub Copilot

-   用Copilot也可以实现上述功能，但是Copilot更侧重于代码的补全，想要实现以上登录页例子，需要一行一行的补全，体验上差了点。
-   目前而言相比Copilot，最大的优势当然是免费，目前任处于体验期间，后续正式版应该也会收费。
-   一个字，快！能处理很长的代码，选中了让给你分析还能定位到关键代码行。

## 缺陷

可以从issues很直观的看到，每天都会新增大量的反馈意见（当然从侧面也反映了Cursor当前的火热程度）

-   体验了两天，感觉工作流比较割裂，在vsCode 和 cursor 之间疯狂切换
-   比较遗憾的是，Cursor作者没有添加vsCode插件的计划
-   chatgpt通病，有字数限制，但可以通过提示继续（这个也能理解，毕竟免费）
-   官网上说是和openai有官方合作，模型用的是GPT4，但不少用户反馈还是基于3.5，大家可以自己去测试一下
-   没有找到修改快捷键的入口，导致一按⌘+Q（代码格式化）就退出系统，很难受

  


## 总结

客观评价，目前这个IDE是一个非常初级的产品，功能非常少，现阶段肯定无法取代vscode，看它后续的发展了，大家更关注的可能还是GPT4的功能。过阵子等多模态开放了，比较期待图片视频识别等功能。不过我认为Cursor亦或是ChatGPT，现在依然还是个大黑盒，你不去开箱永远不知道能带给你什么惊喜，就像是你以前只能读懂你认知以内的代码，但是AIGC的出现的确能加快影响你的认知。

## 关于我




Brath是一个热爱技术的`Java`程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa31569d28cd4d5baa3a7168d4021f37~tplv-k3u1fbpfcp-zoom-1.image)

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！