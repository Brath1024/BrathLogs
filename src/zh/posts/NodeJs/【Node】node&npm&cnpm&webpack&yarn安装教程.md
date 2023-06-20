---
date: 2022-04-10 21:17:57

title: node&npm&cnpm&webpack&yarn安装教程
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



### Node.js	

​		nodejs 是一个让 JavaScript 运行在服务端的开发平台，它让 JavaScript 成为与PHP、Python、Perl、Ruby 等服务端语言平起平坐的脚本语言

​		nodejs能做web开发，REST开发，小程序开发等等，它就是使用JavaScript进行开发的，也就是说，基本上每个web开发的人员都可以比较轻松的转到nodejs平台，nodejs就像是JavaScript抛弃window,document等这些dom对象后的东西的一个封装

　　nodejs下载地址：https://nodejs.org/en/

##### Node.js安装：

​		1 . 首先要查看本机是否已安装nodeJs，打开命令提示符，输入node&node -v查看。

​		2 . 打开Node.js Setup文件执行安装    选择安装路径，全部下一步。

​		3 . 安装完毕之后，重新打开一个命令提示符窗口，出入node -v



现在，我们来Hello World一下，开启命令行窗口，输入node，进入node的命令行，我们可以输入console.log("hello world")![img](https://img2018.cnblogs.com/blog/1033563/201906/1033563-20190604153223076-1028024327.png)

```json
或者，我们可以创建一个web服务，进入node命令行后，输入
View Code
回车后，在浏览器输入：http://localhost:8000就输出了hello world
```



---



### npm：

##### npm安装：

Nodejs下的包管理器。

下载Node后自带一个旧版本的npm。



---



### cnpm:

Nodejs下的包管理器，国内淘宝镜像版本。

##### cnpm安装：

首先要有node环境和npm环境--

1、安装cnpm，输入以下命令：

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

如图所示：

![img](https://img-blog.csdnimg.cn/img_convert/a5fada1c44e9cba82055d5c6db8ea69a.png)

2、输入`cnpm -v` ，检测是否正常

![img](https://img-blog.csdnimg.cn/img_convert/374a7ba6c4e04cdb785a5dca12536ad1.png)



---



### webpack: 

它主要的用途是通过CommonJS的语法把所有浏览器端需要发布的静态资源做相应的准备，比如资源的合并和打包。

##### webpack安装：

首先需要安装好nodeJs&npm的环境~

```json
node -v   // 查看node的版本 不能太高
npm -v   //查看npm的版本
```

全局安装:

打开命令行（win+R    输入cmd）

![img](https://img-blog.csdn.net/20180809221529512?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3MTMwOTgz/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

```json
npm install webpack webpack-cli -g --save-dev #输入并执行下载webpack 
-g #全局安装 
--save-dev #信息写入package.json的devDependencies中
```


![img](https://img-blog.csdn.net/20180809222148241?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3MTMwOTgz/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

下载好后在命令行执行 webpack -v 查看webpack的版本号，正常显示说明安装好了



---



### yarn：

​	**Yarn是facebook发布的一款取代npm的包管理工具。**
​	Yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快，在执行代码之前，Yarn 会通过算法校验每个安装包的完整性，使用详细、简洁的锁文件格式和明确的安装算法，Yarn 能够保证在不同系统上无差异的工作。

##### yarn安装:

首先需要node.js & npm环境
	输入命令： npm install -g yarn
查看版本：yarn -V & --version

```
Yarn 淘宝源安装，分别复制粘贴以下代码行到黑窗口运行即可
yarn config set registry https://registry.npm.taobao.org -g
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
```

---

```json
yarn的常用命令：
安装yarn：npm install -g yarn
安装成功后，查看版本号：yarn --version
创建文件夹 ：md yarn
进入yarn文件夹：cd yarn
初始化项目：yarn init // 同npm init，执行输入信息后，会生成package.json文件

yarn的配置项：
yarn config list // 显示所有配置项
yarn config get <key> //显示某配置项
yarn config delete <key> //删除某配置项
yarn config set <key> <value> [-g|--global] //设置配置项

安装包：
yarn install //安装package.json里所有包，并将包及它的所有依赖项保存进yarn.lock
yarn install --flat //安装一个包的单一版本
yarn install --force //强制重新下载所有包
yarn install --production //只安装dependencies里的包
yarn install --no-lockfile //不读取或生成yarn.lock
yarn install --pure-lockfile //不生成yarn.lock

添加包（会更新package.json和yarn.lock）：
yarn add [package] // 在当前的项目中添加一个依赖包，会自动更新到package.json和yarn.lock文件中
yarn add [package]@[version] // 安装指定版本，这里指的是主要版本，如果需要精确到小版本，使用-E参数
yarn add [package]@[tag] // 安装某个tag（比如beta,next或者latest）
//不指定依赖类型默认安装到dependencies里，你也可以指定依赖类型：

yarn add --dev/-D // 加到 devDependencies
yarn add --peer/-P // 加到 peerDependencies
yarn add --optional/-O // 加到 optionalDependencies
//默认安装包的主要版本里的最新版本，下面两个命令可以指定版本：

yarn add --exact/-E // 安装包的精确版本。例如yarn add foo@1.2.3会接受1.9.1版，但是yarn add foo@1.2.3 --exact只会接受1.2.3版
yarn add --tilde/-T // 安装包的次要版本里的最新版。例如yarn add foo@1.2.3 --tilde会接受1.2.9，但不接受1.3.0

发布包
yarn publish

移除一个包
yarn remove <packageName>：移除一个包，会自动更新package.json和yarn.lock

更新一个依赖
yarn upgrade 用于更新包到基于规范范围的最新版本

运行脚本
yarn run 用来执行在 package.json 中 scripts 属性下定义的脚本

显示某个包的信息
yarn info <packageName> 可以用来查看某个模块的最新版本信息

缓存
yarn cache
yarn cache list # 列出已缓存的每个包 yarn cache dir # 返回 全局缓存位置 yarn cache clean # 清除缓存

```

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
