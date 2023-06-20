---
date: 2022-02-05 02:43:19

title: Docker安装Jenkins
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# Docker安装Jenkins

# 一、前言

## 1、领头羊

```
作为领先的开源自动化服务器，Jenkins 提供了数百个插件来支持构建、部署和自动化任何项目。
```

## 2、特点

- 持续集成和持续交付：作为可扩展的自动化服务器，Jenkins 可以用作简单的 CI 服务器或变成任何项目的持续交付中心。
- 简易安装：Jenkins 是一个独立的基于 Java 的程序，可以开箱即用，包含适用于 Windows、Linux、macOS 和其他类 Unix 操作系统的软件包。
- 易于配置：Jenkins 可以通过其 Web 界面轻松设置和配置，其中包括即时错误检查和内置帮助。
- 插件：凭借更新中心的数百个插件，Jenkins 与持续集成和持续交付工具链中的几乎所有工具集成。
- 可扩展：Jenkins 可以通过其插件架构进行扩展，为 Jenkins 可以做的事情提供几乎无限的可能性。
- 分散式：Jenkins 可以轻松地在多台机器上分配工作，帮助更快地跨多个平台推动构建、测试和部署。

# 二、[Docker安装Jenkins](https://so.csdn.net/so/search?q=Docker安装Jenkins&spm=1001.2101.3001.7020)

## 1、docker search jenkins查询镜像

### 1.1、正常查询结果

```shell
[root@localhost ~]# docker search jenkins
NAME                               DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
jenkins                            DEPRECATED; use "jenkins/jenkins:lts" instead   5504                [OK]                
jenkins/jenkins                    The leading open source automation server       3087                                    
jenkins/jnlp-slave                 a Jenkins agent which can connect to Jenkins…   150                                     [OK]
jenkins/inbound-agent                                                              65                                      
bitnami/jenkins                    Bitnami Docker Image for Jenkins                53                                      [OK]
jenkins/slave                      base image for a Jenkins Agent, which includ…   48                                      [OK]
jenkins/agent                                                                      39                                      
jenkins/ssh-slave                  A Jenkins slave using SSH to establish conne…   38                                      [OK]
jenkins/ssh-agent                  Docker image for Jenkins agents connected ov…   24                                      
jenkins/jnlp-agent-docker                                                          8                                       
jenkins/jnlp-agent-maven           A JNLP-based agent with Maven 3 built in        7                                       
jenkins/pct                        Plugin Compat Tester                            5                                       [OK]
jenkins/jenkins-experimental       Experimental images of Jenkins. These images…   3                                       [OK]
jenkins/jnlp-agent-python          A JNLP-based agent with Python built in         3                                       
jenkins/jnlp-agent-alpine                                                          2                                       
jenkins/jnlp-agent-node                                                            1                                       
rancher/jenkins-jenkins                                                            1                                       
jenkins/ath                        Jenkins Acceptance Test Harness                 1                                       [OK]
jenkins/core-changelog-generator   Tool for generating Jenkins core changelogs     1                                       
jenkins/jenkinsfile-runner         Jenkinsfile Runner packages                     1                                       
jenkins/core-pr-tester             Docker image for testing pull-requests sent …   1                                       
jenkins/jnlp-agent-ruby                                                            1                                       
jenkins/remoting-kafka-agent       Remoting Kafka Agent                            1                                       [OK]
rancher/jenkins-jnlp-slave                                                         0                                       
rancher/jenkins-slave              Jenkins Build Slave                             0                                       [OK]
[root@localhost ~]# ^C
[root@localhost ~]# 
```

### 1.2、可能异常情况，这个异常解决方法为下面第2点

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/07f347955491462592d6f37cc2394fc6.png)

## 2、上面报这个ERROR解决方法

### 2.1、更新[时间同步](https://so.csdn.net/so/search?q=时间同步&spm=1001.2101.3001.7020)即可：ntpdate cn.pool.ntp.org 

### 2.2、如果提示不存在 [ntpdate](https://so.csdn.net/so/search?q=ntpdate&spm=1001.2101.3001.7020) 命令需要先安装该命令：yum install ntpdate 

### 2.3、date中国时间

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/315167c9692b4ebbad480fdffdf439c0.png)

## 3、***\*docker pull jenkinsci/blueocean\****拉取Jenkins镜像

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/1ef511da220c4ca4bca8143aa55c9e52.png)

## 4、docker images 查看本地镜像

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/d9690427ee344603ac96cfa1a6a5510c.png)

## 5、CentOS7安装JDK安装 已有JDK可以跳过

### 5.1、可以下载linux版本tar.gz压缩包到本地不用解压

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/b413890d2adc4b8ea27f016d215c14e7.png)

### 5.2、***\*cd /usr, mkdir java\****进入usr创建java文件夹

### 5.3、***\*cd java\****进入java文件夹，用***\*rz\****将linux版的jdk压缩包上传到这里

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/32e9bd440462402a80f0aa6a0ef32a18.png)

### 5.4、(将JDK移到java，mv jdk-8u301-linux-x64.tar.gz /usr/java)移动文件命令

### 5.5、***\*tar\**** ***\*-\*******\*zxvf\**** jdk-8u301-linux-x64.tar.gz，解压会有jdk1.8.0_301出现

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/100d06f1ce4e4ee7b4b209cbf37491db.png)

### 5.6、***\*vi /etc/profile\****配置linux系统JDK环境变量

**1)配置内容**

```
export JAVA_HOME=/usr/java/jdk1.8.0_301
export JRE_HOME=${JAVA_HOME}/jre
```

### 5.7、***\*source /etc/profile\****使配置生效

### 5.8、***\*sudo yum install glibc.i686\****，可能报错解决方案、否则会会报找不到

### 5.9、***\*java -version\****测试，出现如下即为成功

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/f3cca3db43c84bf79be1bfa8282c4ba9.png)

## 6、CentOS7安装Maven

### 6.1、***\*cd /usr/local\****

### 6.2、***\*rz\****上传，***\*tar -zxvf apache-maven-3.6.1-bin.tar.gz\****解压

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/1055aa0df0184f6bb28bde13fed60bc5.png)

### 6.3、***\*vi /etc/profile\****

### 6.4、***\*source /etc/profile\****刷新环境变量

### 6.5、***\*mvn -v\****查看版本

```shell
[root@localhost local]# mvn -v
Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
Maven home: /usr/local/apache-maven-3.6.3
Java version: 1.8.0_301, vendor: Oracle Corporation, runtime: /usr/java/jdk1.8.0_301/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "3.10.0-1127.el7.x86_64", arch: "amd64", family: "unix"
[root@localhost local]# 
```

到此JDK、Maven环境准备完成

## 7、***\*启动容器，并\*******\*挂载上面配置的环境\****

```shell
docker run \
-u root \
-d \
--restart=always \
-p 8001:8080 \
-p 50000:50000 \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /var/jenkins_home:/var/jenkins_home \
jenkinsci/blueocean
```

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/172131aa0a9f47b3a15e5bd5d4555986.png)

## 9、访问Jenkins，提示输入密码

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/2b6d909e4c4e46efaa98216f1c33fdf7.png)

## 10、初次可以选择推荐的

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/5e9a6ebdd6954093bf6a23f4f876221a.png)

## 11、 **等待安装**

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/25caae9dae8b49878adca5e32647e915.png)



## 12、如下访问Jenkins成功啦

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/4beeeb654aec4e608a22ce6b49afa1ae.png)

到此就结束Docker安装Jenkins啦，后面的章节将介绍如何配置jenkins，敬请期待！



## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
