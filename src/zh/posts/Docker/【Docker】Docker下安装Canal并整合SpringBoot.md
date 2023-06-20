---
date: 2022-02-03 14:20:27

title: 【Docker】Docker下安装Canal并整合SpringBoot
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# [Canal](https://so.csdn.net/so/search?q=Canal&spm=1001.2101.3001.7020) 是一个同步增量数据的一个工具

### 目录

- [概念](#_2)
- [Mysql开启binlog](#Mysqlbinlog_5)
- - [是否开启binlog](#binlog_9)
  - [开启binlog日志](#binlog_16)
  - [创建授权用户](#_30)
- [部署Canal](#Canal_41)
- - [拉取镜像](#_43)
  - [挂载properties配置文件](#properties_47)
  - [创建容器](#_68)



# 概念

canal是阿里巴巴旗下的一款[开源项目](https://so.csdn.net/so/search?q=开源项目&spm=1001.2101.3001.7020)，纯Java开发。基于数据库增量日志解析，提供增量数据订阅&消费，目前主要支持了MySQL（也支持mariaDB）

# Mysql开启binlog

在部署Canal之前，需要先安装Mysql。

> 我用的是5.7.27的mysql

## 是否开启binlog

输入以下命令，查看是否开启binlog
为**OFF**则表示**未开启**binlog

```sql
show variables like 'log_bin';
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/cd4194a978a544b59e40d7c342d8683d.png)

## 开启binlog日志

修改mysql的配置文件，在[mysqld]下添加以下内容

```cnf
# server_id不重复即可，不要和canal的slaveId重复
server_id=1
# 开启binlog
log_bin = mysql-bin
# 选择row模式
binlog_format = ROW
```

------

修改完毕，重启mysql
查看是否开启
![在这里插入图片描述](https://img-blog.csdnimg.cn/df9f1104c79c42b3bd3cc2461f593f40.png)

## 创建授权用户

创建授权用户canal用于cannal服务监听mysql的binlog

```sql
# 新建用户 用户名：canal  密码：canal 
CREATE USER canal IDENTIFIED by 'canal';
# 授权
GRANT SELECT, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'canal'@'%';
# 刷新MySQL的系统权限相关表
FLUSH PRIVILEGES;
```

# 部署Canal

如果没有部署过docker，看我之前写的[Linux部署Docker](https://brath.top/2023/03/16/【Docker】Linux部署Docker/)

## 拉取镜像

```shell
docker pull canal/canal-server:latest
```

## 挂载properties配置文件

先进行第一次运行，拷贝properties配置文件

```shell
docker run -p 11111:11111 --name canal -d canal/canal-server:latest
```

拷贝运行后的容器中配置文件，用来文件挂载

```shell
# 创建canal宿主机挂载目录
mkdir -p /opt/canal/conf
# 查看docker运行情况，复制容器id
docker ps
# 拷贝配置文件
docker cp 容器id:/home/admin/canal-server/conf/example/instance.properties  /opt/canal/conf/
```

移除当前容器

```shell
docker stop canal
docker rm canal
```

修改配置文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/c51d4265e36e4e3d862f103eb0367a42.png)

## 创建容器

运行新的容器，同时挂载修改后的配置文件

```shell
docker run -p 11111:11111 --name canal -v /opt/canal/conf/instance.properties:/home/admin/canal-server/conf/example/instance.properties -d canal/canal-server:latest
```

开放端口

```shell
firewall-cmd --zone=public --add-port=11111/tcp --permanent && firewall-cmd --reload
```
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
