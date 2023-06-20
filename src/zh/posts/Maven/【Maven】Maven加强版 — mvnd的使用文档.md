---
date: 2023-04-08 06:19:38

title: Maven加强版 — mvnd的使用测试
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# Maven加强版 — mvnd的使用测试

Maven、gradle 作为主流的构建工具，几乎所有的Java项目都使用，但是Maven相对gradle来说，构建还是太慢了。特别是构建十几个子项目的程序。

如果要把项目从Maven转换成gradle，成本也是巨大的。

但是现在有了 maven-mvnd ，可以使构建变得更快。

## **1、maven-mvnd介绍**

`maven-mvnd`是`Apache Maven团队`借鉴了`Gradle`和`Takari`的优点，衍生出来的更快的构建工具，是maven的`强化版`。

github地址：[https://github.com/apache/maven-mvnd](https://link.zhihu.com/?target=https%3A//github.com/apache/maven-mvnd)

maven-mvnd 特性：

- 嵌入 Maven (所以不需要单独安装 Maven)；`maven 过渡到 maven-mvnd`的过程中实现 `无缝切换`！所以不需要再安装maven或进行复杂的配置更改。
- 实际的构建发生在一个长期存在的后台进程中，也就是守护进程。如果没有为构建请求服务的空闲守护进程，则可以并行产生多个守护进程。
- 一个守护进程实例可以处理来自 mvnd 客户机的多个连续请求。
- 使用 GraalVM 构建的本地可执行文件。与传统的 JVM 相比，它启动更快，使用的内存更少。

这种架构带来的优势有：

- 运行实际构建的 JVM 不需要为每个构建重新启动，节省时间。
- JVM 中的实时(JIT)编译器生成的本机代码也保留了下来。与 Maven 相比，JIT 编译花费的时间更少。在重复构建过程中，JIT 优化的代码可以立即使用。这不仅适用于来自 Maven 插件和 Maven Core 的代码，也适用于来自 JDK 本身的所有代码。



## **2、使用步骤**

### **2.1、下载**

下载：[https://github.com/mvndaemon/mvnd/releases](https://link.zhihu.com/?target=https%3A//github.com/mvndaemon/mvnd/releases)



![img](https://brath.cloud/blogImg/v2-a58a6f79a75eeeb834275d74212cacb1_720w.jpg)



我这里是windows，下载 `mvnd-0.7.1-windows-amd64.zip` 版本即可。

### **2.2、安装**

直接解压。

然后配置环境变量：将 bin 目录添加到 PATH

### **2.3、测试**

打开CMD终端，输入 `mvnd -v`

可以看到如下信息表示安装成功：

```text
C:\Users\HaC> mvnd -v
mvnd native client 0.7.1-windows-amd64 (97c587c11383a67b5bd0ff8388bd94c694b91c1e)
Terminal: org.jline.terminal.impl.jansi.win.JansiWinSysTerminal
Apache Maven 3.8.3 (ff8e977a158738155dc465c6a97ffaf31982d739)
Maven home: E:\apache-mvnd-0.7.1-windows-amd64\mvn
Java version: 1.8.0_131, vendor: Oracle Corporation, runtime: E:\JDK1.8\jre
Default locale: zh_CN, platform encoding: GBK
OS name: "windows 10", version: "10.0", arch: "amd64", family: "windows"
```

可以看到 mvnd 集成了 Maven 3.8.3 版本。

### **2.4、使用**

在使用上和Maven一样，参数也一致。

Maven 使用 `mvn clean package` ；使用Maven-mvnd 只需要变成 `mvnd clean package` 即可，其他同理。

### **2.5、配置修改**

为了最小程度的兼容原来的Maven，可以使用原来的 `setting.xml`

打开 Maven-mvnd 安装目录下 的 `/conf/mvnd.properties` 文件，修改：

```properties
maven.settings=E://apache-maven-3.5.4-bin//apache-maven-3.5.4//conf//settings.xml
```

（注意是 `//`）

## **3、打包对比**

由于 mvnd-0.7.1 版本使用了Maven 3.8.3版本，我这里同样使用Maven 3.8.3进行对比。

命令：

```text
# maven 打包命令
mvn clean package -Dmaven.test.skip=true
# mvnd 打包命令
mvnd clean package -Dmaven.test.skip=true
```

电脑配置：

CPU：Intel(R) Core(TM) i7-4790 CPU @ 3.60GHz 3.60 GHz

内存：16GB

结果如下：

- 13个子项目

![img](https://brath.cloud/blogImg/v2-dd0b655c2c27661612a479ef242058c8_720w.jpg)41秒 vs 21秒

可以看到 **mvnd 打包的总时间比 mvn 快了不少**，因为 mvnd 使用了CPU的多核心，可以看到每个子模块打包的时间都差不多，所以在单核的机器，就不要尝试使用 mvnd 了。

- 19个子项目



![img](https://brath.cloud/blogImg/v2-0a301e678b6ebab5577d899b6230ffe5_720w.jpg)32秒 vs 10秒

呈现子项目越多，相对速度更快的趋势。



总的来说：

**如果项目模块很多，可以尝试使用 mvnd 进行辅助打包，比如 测试、生产，可以节省很多时间；**

**开发则可以继续使用 mvn ，毕竟 IDEA 无法集成 mvnd，可以在 terminal 通过命令打包。**
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
