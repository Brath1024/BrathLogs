---
date: 2023-02-24 22:08:51

title: 【Docker】Linux部署Docker
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Docker】Linux部署Docker

接触一段时间docker，这个工具大大提高了开发者打包应用的效率。

一直都是直接把镜像扔到到docker里构建容器启动，并没有深入了解。

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/3eca951ddd044e9d9e1e6f2fcd5c680b.png)
本文由[alpha0808](https://blog.csdn.net/alpha0808?type=blog)大佬指导，如果要了解docker的概念以及命令，请去看大佬这篇[DOCKER之入门篇](https://blog.csdn.net/alpha0808/article/details/125699252?spm=1001.2014.3001.5502)

本篇文章集中于linux系统下对docker及相关组件的部署。

### 目录

- [一、安装docker](#docker_9)
- [二、镜像加速](#_47)
- - [获取阿里云镜像地址](#_50)
  - [添加加速器地址](#_56)
- [三、可视化管理工具Portainer](#Portainer_75)
- - [简介](#_76)
  - [展示](#_79)
  - [安装](#_90)
  - - [镜像下载](#_92)
    - [容器运行](#_105)
    - [创建用户](#_113)
    - [docker连接管理](#docker_116)
- [四、补充](#_134)
- - [docker开机自启](#docker_135)
  - [容器开机自启](#_139)



# 一、安装docker

按照官网 https://docs.docker.com/engine/install/centos/执行命令即可

```c
#1.yum检查更新
sudo yum check-update
#2.删除旧版本
sudo yum remove docker docker-client docker-client-latest  docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
#3.安装gcc环境
yum -y install gcc
yum -y install gcc-c++
#4.安装依赖项
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
#5.将 Docker 存储库添加到 CentOS
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
#使用阿里服务器下载
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
#如果没有执行命令1更新，那么此时执行命令即可
yum makecache fast
#6.下载docker
sudo yum install -y docker #注意这样下载需要接受GPG秘钥，相当于一个数字指纹，指纹格式：060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35
#或者社区版本
yum -y install docker-ce
#7.检查版本
docker version
#或者
docker -v
#8.查看docker进程
docker ps
```

执行第8步，如果报错
“**Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemo**”
是因为docker还没启动

解决方案：

```c
systemctl start docker.service
```

# 二、镜像加速

使用[阿里云镜像](https://so.csdn.net/so/search?q=阿里云镜像&spm=1001.2101.3001.7020)地址来加速镜像下载的速度

## 获取阿里云镜像地址

点击[容器镜像服务](https://cr.console.aliyun.com/cn-hangzhou/instances)
**镜像工具**→**镜像加速器**，生成[加速器](https://so.csdn.net/so/search?q=加速器&spm=1001.2101.3001.7020)地址

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/644a2eab2b884c86874988c992891308.png)

## 添加加速器地址

切换目录至/etc/docker

```c
cd /etc/docker
```

编辑daemon.js文件

```js
{
	"registry-mirrors": ["加速器地址"]
}
```

[重启docker](https://so.csdn.net/so/search?q=重启docker&spm=1001.2101.3001.7020)的伴随线程

```c
systemctl daemon-reload
```

重启docker服务

```c
systemctl restart docker
```

# 三、可视化管理工具Portainer

## 简介

Portainer是Docker的**图形化**管理工具，提供状态显示面板、应用模板快速部署、容器镜像网络数据卷的基本操作（包括上传下载镜像，创建容器等操作）、事件日志显示、容器控制台操作、Swarm集群和服务等集中管理和操作、登录用户管理和控制等功能

## 展示

- 首页
  包含docker-compose、容器、镜像、卷、网络总体概况
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/a02aadfe750448a2b68d3af149c24a3a.png)
- 容器
  包含容器的启动、暂停、杀死进程、重启、新增，监控，日志查看，容器控制台等功能。
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/906ebda299ae49dab32718dbd0519d2f.png)
- 镜像
  包含镜像详细查看、删除、导入、导出等功能
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/14cc4c0cbaea403f895b07bbc006474a.png)

## 安装

采用docker安装

### 镜像下载

查询portainer镜像

```c
docker search portainer
```

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/52a91f8890aa4618999620689636e6ce.png)

下载portainer镜像

```c
docker pull portainer/portainer
```

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/15a7b2b883bd41c78d66d8f391e791eb.png)

### 容器运行

```c
docker run -p 9000:9000 --name portainer -v /var/run/docker.sock:/var/run/docker.sock -d portainer/portainer
```

开放9000端口

```shell
firewall-cmd --zone=public --add-port=9000/tcp --permanent && firewall-cmd --reload
```

### 创建用户

访问9000端口，第一次登录设置管理员账号和密码
![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/90ff15efcc5e44f38105bf45c4a10faa.png)

### docker连接管理

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/e0730e684e3c407fba300d41ad5dff7e.png)
可以选择管理本地Local和远程Remote的Docker两个选项，我们安装在本机，直接选择Local，然后Connect进入管理界面
![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/50e22542b48144a7bebcc9c2cc194dfc.png)
点击connect，报错

> Failure dial unix /var/run/docker.sock: connect: permission denied

可以猜测是SElinux的问题，看SELinux状态：sestatus 命令进行查看

```c
/usr/sbin/sestatus -v      ##如果SELinux status参数为enabled即为开启状态
SELinux status:                 enabled
```

修改/etc/selinux/config 文件，保存后重启机器

> 将**SELINUX=enforcing**改为**SELINUX=disabled**

再次访问9000，连接local，成功
![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/e2756cc7d9154993992f2c3a00d5ca58.png)



# 四、补充

## docker开机自启

```c
sudo systemctl enable docker
```

## 容器开机自启

以上面的docker可视化管理工具portainer为例，希望开机的时候，自动启动镜像

启动命令加–restart=always

```c
docker run -p 9000:9000 --name portainer --restart=always  -v /var/run/docker.sock:/var/run/docker.sock -d portainer/portainer
```

如果已经在运行的镜像

```c
docker update --restart=always portainer
```
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
