---
date: 2021-09-16 17:21:45

title: 【Npm】npm install时卡住怎么办？
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Npm】npm install时卡住怎么办？

## 方法一：安装cnpm镜像

这个是比较常用的方法，我首先也是使用了这个方法。

cnpm的安装方法，参考http://npm.taobao.org/

```
npm install -g cnpm --registry=https:``//registry.npm.taobao.org
```

在cmd中输入以上命令就可以了，然后再使用cnpm安装

```
cnpm install -g nodemon
```

后面的操作跟不使用镜像的操作是差不多的。



## 方法二：使用代理registry

在网上查阅了一些资料后，决定使用代理的方式，方法也很简单，就是

```
npm config set registry https://registry.npm.taobao.org
```

然后后续的install等命令还是通过npm运作，而不是cnpm。



## 后记补充：

npm install有bug,大家可以安装yarn替代。

**步骤：**

Yarn、React Native 的命令行工具（react-native-cli）

Yarn是 Facebook 提供的替代 npm 的工具，可以加速 node 模块的下载。React Native 的命令行工具用于执行创建、初始化、更新项目、运行打包服务（packager）等任务。

```
npm install -g yarn react-native-cli
```

安装完 yarn 后同理也要设置镜像源：

```
yarn config set registry https:``//registry.npm.taobao.org --global``yarn config set disturl https:``//npm.taobao.org/dist --global
```

如果你遇到EACCES: permission denied权限错误，可以尝试运行下面的命令（限 linux 系统）： sudo npm install -g yarn react-native-cli.

安装完 yarn 之后就可以用 yarn 代替 npm 了，例如用yarn代替npm install命令，用yarn add 某第三方库名代替npm install --save 某第三方库名。

**注意：**目前 npm5（发文时最新版本为 5.0.4）存在安装新库时会删除其他库的问题，导致项目无法正常运行。请尽量使用 yarn 代替 npm 操作。



## 转载与参考

https://blog.csdn.net/WXF_Sir/article/details/112944559

解决npm install总是卡住不动的问题

https://www.cnblogs.com/pijunqi/p/14362901.html

解决npm install卡住不动的小尴尬
https://www.cnblogs.com/wenbinjiang/p/11062959.html
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
