---
date: 2023-06-6 1:10:41

title: 【Sentinel】Docker搭建Sentinel
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【Sentinel】Docker搭建Sentinel

# 1、概述

[Sentinel](https://so.csdn.net/so/search?q=Sentinel&spm=1001.2101.3001.7020)提供一个轻量级的开源控制台，它提供机器发现以及健康情况管理、监控（单机和集群），规则管理和推送的功能。

Sentinel 控制台包含如下功能:

**查看机器列表以及健康情况：** 收集 Sentinel 客户端发送的[心跳包](https://so.csdn.net/so/search?q=心跳包&spm=1001.2101.3001.7020)，用于判断机器是否在线。
**监控 (单机和集群聚合)：** 通过 Sentinel 客户端暴露的监控 API，定期拉取并且聚合应用监控信息，最终可以实现秒级的实时监控。
**规则管理和推送：** 统一管理推送规则。
**鉴权：** 生产环境中[鉴权](https://so.csdn.net/so/search?q=鉴权&spm=1001.2101.3001.7020)非常重要。这里每个开发者需要根据自己的实际情况进行定制。

# 2、制作镜像

sentinel-dashboard就是一个SpringBoot项目，直接使用命令启动即可，所有自定义配置docker启动。

如果没有特殊需要可以直接下载jar，需要修改源码则下载源码包即可，下载地址：https://github.com/alibaba/Sentinel/releases，下载相应版本的jar包，比如sentinel-dashboard-1.8.1.jar

![image-20230606131018352](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230606131018352.png)

**1、创建工作目录：**

```cobol
mkdir /home/soft/sentinel -p
```

**2、拷贝文件：**

 将从官网下载的或者是自定义编译好的`jar`包，拷贝到`/home/soft/sentinel`目录下

**3、Dockerfile：**

```cobol
vim /home/soft/sentinel/Dockerfile
```

 内容如下：

```cobol
#java 版本
FROM openkbs/jdk11-mvn-py3
#root用户
USER root
#设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
#设置工作目录集
WORKDIR /root/sentinel
#复制jars和命令
ADD *.jar /root/sentinel/
EXPOSE 8858
```

 **4、制作镜像：**

保证`jar`和`Dockerfile`在同一个目录下，执行命令： 

```shell
docker build -t sentinel-server .
```

启动容器：

```shell
docker run -dit -p 8858:8858 --privileged=true -P --name sentinel sentinel /bin/bash -c 'tail -f /dev/null' -g 'daemon off;'
```

进入容器启动：

```shell
java -Dserver.port=8858 -Dsentinel.dashboard.auth.username=sentinel -Dsentinel.dashboard.auth.password=sentinel -jar  sentinel-dashboard-1.8.0.jar
```

**3、启动测试** 

 [http://127.0.0.1:8858/](http://192.168.31.128:8858/) ；默认账户密码：sentinel/sentinel

**鉴权：**
从 Sentinel 1.6.0 起，Sentinel 控制台引入基本的登录功能，默认用户名和密码都是 sentinel。该鉴权能力非常基础，生产环境使用建议根据安全需要自行改造。

可以在Dockerfile文件中，通过如下JVM参数进行配置：

   -Dsentinel.dashboard.auth.username=sentinel 用于指定控制台的登录用户名为 sentinel；
   --Dsentinel.dashboard.auth.password=123456 用于指定控制台的登录密码为 123456；如果省    略这两个参数，默认用户和密码均为 sentinel；
  -Dserver.servlet.session.timeout=7200 用于指定 Spring Boot 服务端 session 的过期时间，如    7200 表示 7200 秒；60m 表示 60 分钟，默认为 30 分钟；
除了修改JVM启动参数的形式，还是源码中通过application.properties文件进行配置.

# 4、配置项目说明

控制台的一些特性可以通过配置项来进行配置

![image-20230606112448778](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230606112448778.png)

通过JVM方式为：在`配置Dockerfiel`的`ENTRYPOINT`中加入相应配置就行。
比如：`ENTRYPOINT [ "java" ,"-jar","-Dsentinel.dashboard.app.hideAppNoMachineMillis=60000"` 

# 5、镜像保存与加载

```bash
# 保存iamge到home目录下
docker save -o /home/sentinel-server.tar iamgeName
 
# 仓home目录下导入image
docker load --input /home/sentinel-server.tar
 
# 测试：
# 1、save成功以后，删除原有images中的sentinel-server
# 2、导入成功后，重新启动容器，并且成功访问
```

# 6、控制台介绍

**查看机器列表以及健康情况：**

在机器列表中看到的连接到`sentinel`的机器，并且展示监控状况

![image-20230606131048872](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230606131048872.png)

**簇点链路：**
簇点链路（单机调用链路）页面实时的去拉取指定客户端资源的运行情况。它一共提供两种展示模式：一种用树状结构展示资源的调用链路，另外一种则不区分调用链路展示资源的实时情况。

**注意:** 簇点链路监控是内存态的信息，它仅展示启动后调用过的资源。

![image-20230606131057100](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230606131057100.png)

**实时监控：**
同一个服务下的所有机器的簇点信息会被汇总，并且秒级地展示在"实时监控"下。需要确保 Sentinel 控制台所在的机器时间与自己应用的机器时间保持一致，否则会导致拉不到实时的监控数据。

注意: 实时监控仅存储 5 分钟以内的数据，如果需要持久化，需要通过调用实时监控接口来定制。

![image-20230606131105294](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230606131105294.png)

 **规则管理：**
Sentinel规则分为：流控、降级、热点、 系统、授权，通过控制台可以对各个`资源`配置相应的规则

![image-20230606131111772](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230606131111772.png)

 **7、整合SpringCloud使用**

```bash
spring:
 cloud:
  sentinel:
   transport:
     port: 9999 #跟控制台交流的端口,随意指定一个未使用的端口即可
	 dashboard: 127.0.0.1:8858 # 指定控制台服务的地址
   log:
     dir: logs/sentinel #日志输出地址
```

**验证：**
Sentinel 会在客户端首次调用的时候进行初始化，开始向控制台发送心跳包，我们启动服务后，请求任意一个接口后，即可成功注册。

![image-20230606131122702](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230606131122702.png)

 

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！