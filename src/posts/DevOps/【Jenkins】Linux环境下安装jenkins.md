---
date: 2023-01-27 19:21:19

title: Linux环境下安装jenkins
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# Linux环境下安装jenkins



### 1、添加存储库

yum的repo中默认没有Jenkins，需要先将Jenkins存储库添加到yum repos，执行下面的命令：

```
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
```

完成界面：

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/20201231171035460.png)

然后执行下面的命令：

```
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
```



### 2、安装jenkins

执行安装命令： yum install jenkins
如下图所示，出现询问是否下载时，输入y，然后点击回车，等待安装完成：
![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/20201231171215646.png)



### **3、修改配置**

[jenkins](https://so.csdn.net/so/search?q=jenkins&spm=1001.2101.3001.7020)安装成功后，默认的用户是jenkins，端口是8080，为了防止冲突，并且给用户赋权限，我们修改用户名和端口。
输入命令，进入jenkins配置文件：

```
vi /etc/sysconfig/jenkins
```

找到如下配置：

```shell
JENKINS_USER="jenkins"

## Type:        string
## Default: "false"
## ServiceRestart: jenkins
#
# Whether to skip potentially long-running chown at the
# $JENKINS_HOME location. Do not enable this, "true", unless
# you know what you're doing. See JENKINS-23273.
#
#JENKINS_INSTALL_SKIP_CHOWN="false"

## Type: string
## Default:     "-Djava.awt.headless=true"
## ServiceRestart: jenkins
#
# Options to pass to java when running Jenkins.
#
JENKINS_JAVA_OPTIONS="-Djava.awt.headless=true"

## Type:        integer(0:65535)
## Default:     8080
## ServiceRestart: jenkins
#
# Port Jenkins is listening on.
# Set to -1 to disable
#
JENKINS_PORT="8080"

## Type:        string
## Default:     ""
## ServiceRestart: jenkins
#
# IP address Jenkins listens on for HTTP requests.
# Default is all interfaces (0.0.0.0).
#

```

#### 修改用户名，端口：

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/20201231171521366.png)

### 若为云服务器，需配置安全组并开放端口才可以正常访问





# 启动jenkins

#### 1.如果是2022年7月以后安装的jekins，需要下载jdk11或者jdk17版本的jdk环境

```shell
 yum install fontconfig java-11-openjdk
```

### 设置自启后启动jenkins服务：systemctl enable --now jenkins

![jenkins在linux下安装（rpm包）_javascript_07](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/01013406_6337288ebae0938355.png)

 

### 查看是否自启动：systemctl is-enabled jenkins

 ![jenkins在linux下安装（rpm包）_java_08](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/01013406_6337288ecdddd6790.png)



### 查看服务状态：systemctl status jenkins.service

![jenkins在linux下安装（rpm包）_java_09](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/01013406_6337288ee068451100.png)

 

### jenkins: failed to find a valid Java installation

![jenkins在linux下安装（rpm包）_javascript_10](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/01013406_6337288eeec5c74170.png)

 

### 使用以下方法启动jenkins

```
cd /etc/init.d

# 启动
./jenkins start
# 停止
./jenkins stop
# 状态
./jenkins status
```



### 提示jdk版本不满足, 可能是jdk11没有配置到jeknins上

#### Jenkins requires Java versions [17, 11] but you are running with Java 1.8 from /usr/local/jdk1.8.0_211/jre

![jenkins在linux下安装（rpm包）_json_13](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/01013407_6337288f30b9997576.png)

#### 将jdk11的环境配置到 /etc/rc.d/init.d/jenkins 的candidates中

![image-20221122105322847](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20221122105322847.png)

#### 重新启动服务，没有报错 

![image-20221122105452465](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20221122105452465.png)



#### 访问 Jenkins，第一次需要输入生成的密码，在 /var/lib/jenkins/secrets 目录下的initialAdminPassword文件中

![image-20221122104907426](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20221122104907426.png)

![image-20221122104919096](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20221122104919096.png)

## 成功

![image-20221122105607288](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20221122105607288.png)







## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
