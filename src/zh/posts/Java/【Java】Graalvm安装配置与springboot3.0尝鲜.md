---
date: 2022-12-14 03:48:47

title: 【Java】Graalvm安装配置与springboot3.0尝鲜
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Java】Graalvm安装配置与springboot3.0尝鲜



# Graalvm安装配置与springboot3.0尝鲜

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/86f178bacbb241fbb89957a4ec07dc4c.png)

Spring 团队一直致力于 Spring 应用程序的原生映像支持已有一段时间了。经过3 +年的孵化春季原生Spring Boot 2 的实验性项目，原生支持将在 Spring Framework 6 和 Spring Boot 3 中正式发布！

## 安装Graalvm

由于spring-boot3.0仅支持22.3版本,此处我们选择这个版本作为演示

[Release GraalVM Community Edition 22.3.0 · graalvm/graalvm-ce-builds (github.com)](https://github.com/graalvm/graalvm-ce-builds/releases/tag/vm-22.3.0)

![image-20221130150340996](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/116216a0cb89f2e8d4d8cd93614085c8.png)

选择对应版本下载即可,此处我选择的是windows 的java 17版本

解压之后我们可以得到这样的目录结构

```
前置路径\graalvm-ce-java17-22.3.0
```

![image-20221130150524482](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/f225ca202a944dae1dd06a3a563b1fea.png)

### 配置Graalvm环境变量

配置变量到`GRAALVM_HOME``你的解压路径`

![image-20221130150648155](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/ccf60d657a19858f117ee7a8b0e26e14.png)

在中添加`Path``%GRAALVM_HOME%\bin`

![image-20221130150848751](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/29f6283edc68019a2c2f636b6c386f55.png)

确定保存

### 安装成功

打开控制面板输入命令`Java -version`

![image-20221130151006878](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/df38d21d0c27961cbf6614398c132fb0.png)

可以看到显示了我们刚刚安装的GraalVM的信息

输入命令`gu`

![image-20221130151120759](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/fbe1fb9e9f76f77443a70f5b5549c938.png)

可以看见命令也能正常使用`gu`

## 安装native-image

控制台输入命令即可`gu install native-image`

但是可能会出现以下错误

![image-20221130151315638](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/7eb4811880054f31d3f0790532fbe1ef.png)

解决方案

在github上下载对应版本的native-image安装包进行本地安装

还是熟悉的地址:

[Release GraalVM Community Edition 22.3.0 · graalvm/graalvm-ce-builds (github.com)](https://github.com/graalvm/graalvm-ce-builds/releases/tag/vm-22.3.0)

下拉,找到与你版本对应的安装包`native-image`

![image-20221130151500003](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/96c58414392622bdd809119771dcab5e.png)

控制台输入命令如图所示`gu install -L 你的下载位置`

![image-20221130151626018](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/9126351a5c945baeb19d939758c2edf3.png)

### 安装成功

控制台输入如图所示`gu list`

![image-20221130151715833](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/4c3e2b3452ad8ddfe4e21f8e6ff6b4f3.png)

可以看见native-image的版本信息,说明安装成功

## 配置msvc环境

安装[vs2019](https://so.csdn.net/so/search?q=vs2019&spm=1001.2101.3001.7020)及以上版本

![image-20221130152533185](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/2b952909c1da82f0ba1e2b7d855a9e0a.png)

安装时确保勾选了以上两个选项

### 环境变量

在Path中配置`D:\vs2022\VC\Tools\MSVC\14.29.30133\bin\HostX64\x64D:\vs2022\VC\Tools\MSVC\14.29.30133\bin\HostX64\x64`

![image-20221130160020916](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/12176a3ba33ba9c41d39e3287154d27f.png)

配置环境变量`INCLUDE`

![image-20221130160604371](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/fe59d4cf1f0c49b86d33e1772a7663ba.png)

> C:\Program Files (x86)\Windows Kits\10\Include\10.0.18362.0\ucrt;
>
> C:\Program Files (x86)\Windows Kits\10\Include\10.0.18362.0\um;
>
> C:\Program Files (x86)\Windows Kits\10\Include\10.0.18362.0\shared;
>
> D:\vs2022\VC\Tools\MSVC\14.29.30133\include;

(vs2022是我的安装路径)

配置环境变量`LIB`

![image-20221130161557414](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/0788873945abfe68181d41739e6351ea.png)

> D:\vs2022\VC\Tools\MSVC\14.29.30133\lib\x64;
>
> C:\Program Files (x86)\Windows Kits\10\Lib\10.0.18362.0\um\x64;
>
> C:\Program Files (x86)\Windows Kits\10\Lib\10.0.18362.0\ucrt\x64;

## 运行spring-boot3.0测试项目

### 构建项目

引入GraalVM Native依赖,此次我们引入Web依赖用于测试

![image-20221130190451952](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/c43b798d6c0c094edb5dcf686e364adb.png)

pom文件如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.0.0</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.fate</groupId>
    <artifactId>boot3</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>boot3</name>
    <description>boot3</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.graalvm.buildtools</groupId>
                <artifactId>native-maven-plugin</artifactId>
                <extensions>true</extensions>
                <executions>
                    <execution>
                        <id>build-native</id>
                        <goals>
                            <goal>compile-no-fork</goal>
                        </goals>
                        <phase>package</phase>
                    </execution>
                    <execution>
                        <id>test-native</id>
                        <goals>
                            <goal>test</goal>
                        </goals>
                        <phase>test</phase>
                    </execution>
                </executions>
                <configuration>
<!--                    此处是入口类,必须与实际代码一致,否则无法打包成功-->
                    <mainClass>com.fate.boot3.Boot3Application</mainClass>
<!--                    生成的exe文件名-->
                    <imageName>boot-test</imageName>
                    <buildArgs>
                        <buildArg>--verbose</buildArg>
                    </buildArgs>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

### 测试代码

```java
package com.fate.boot3.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author fate
 * @date 2022/11/30
 * @Description
 */
@RestController
@RequestMapping("test")
public class TestController {
    @GetMapping
    public String test(){
        return "test boot3.0";
    }
}
```

### 测试运行

![image-20221130190851328](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/96434a0202f521ec03261bdd8639fa47.png)

### 打包编译

点击maven侧边栏插件,如图所示

![image-20221130191339227](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/af4a56844461e7eafcae3f2a7dc4454b.png)

或者直接运行maven命令`mvn -Pnative package`

开始漫长的编译打包,即使是这样简单的项目也需要好几分钟,并且期间你的电脑也会很卡,

![image-20221130191604020](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/5eae08313dc451657aefefe528b2ae06.png)

![image-20221130191900654](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/76f867095d399da66dfe2483d46c2eaf.png)

可以看见,耗时近三分钟,编译之后我们发现,target目录下变得不一样了,生成了exe可执行文件,当然你也可能注意到了spring-aot这个文件夹,虽然我还不是很了解aot,但是很明显,大的来了

![image-20221130193829658](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/faf46922b0ba3218bde339d62810d27d.png)

直接在cmd中运行

![image-20221130193741304](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/0739d467ae2c5f370874bfa40ddfed6c.png)

![image-20221130193757182](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/a777d81bb6de25ed99c134372e03e00e.png)

# 大功告成
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
