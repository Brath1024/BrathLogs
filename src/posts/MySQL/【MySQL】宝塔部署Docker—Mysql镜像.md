---
date: 2022-05-11 08:07:55

title: 宝塔部署Docker—Mysql镜像
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



转自 https://blog.csdn.net/u011630259/article/details/124497343

## 宝塔部署Docker—Mysql镜像

如何在面板上使用Docker项目管理器快速创建多个版本的MySQL？手把手的教你如何创建多个版本的MySQL服务
环境介绍：
宿主机：CentOS7.9
配置：2核4G（测试机器，生产环境建议配置高点）
面板版本：7.9.26（测试版）
Docker项目管理器：3.9

![img](https://brath.cloud/blogImg/90825147a852493a8feea8efc0220deb.png)

Docker版本：Docker version 20.10.14, build a224086
测试MySQL版本：
MySQL5.7.37
MySQL8.0.28
1、获取MySQL版本

![img](https://brath.cloud/blogImg/0241ca9c68d545819f8f100b33b2d8b9.png)

 

 ![](https://brath.cloud/blogImg/90825147a852493a8feea8efc0220deb.png)

默认情况下，直接输入mysql名，会拉取 mysql:latest镜像，就是最新版本的镜像，指定版本后拉取的是指定版本的MySQL镜像，如 mysql:5.7.37

![img](https://brath.cloud/blogImg/2418dbfa7fac47bbac12fd3abe9e7229.png)



2、创建容器：

指定容器中数据库的密码：

 ![img](https://brath.cloud/blogImg/5d2c09a1667744fd9538381efd7b67b0.png)

 

 

MYSQL_ROOT_PASSWORD=dapaotest1

![img](https://brath.cloud/blogImg/241882e051fd4940bd09e98f61369215.png)

3、容器创建成功后，进入终端命令行查看数据库

![img](https://brath.cloud/blogImg/f6245e7abacc4d768dd616d4067c3a4a.png)

4、创建数据库表

 

 

```
查看数据库的命令
show databases;
创建数据库的命令
create database dapaodocker;
创建用户的命令
create user 'dapaodocker'@'%' identified by 'dapao666!';
授权
grant all on dapaodocker.* to dapaodocker@'%';

查看用户权限
select host,user from user;
测试数据库是否可以连接
```

![img](https://brath.cloud/blogImg/ee582242679c4da1b2fc04db16bad384.png)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
