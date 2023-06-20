---
date: 2022-06-24 17:14:46

title: Linux下docer部署mysql
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



## Linux下docer部署mysql

部署方法：

```shell
1.首先在Linux系统中启动已经安装好的docker
service docker start

2.查看docker进程，确认docker启动成功
ps -ef|grep docker

3.在docker容器中查询MySQL
docker search mysql

4.在docker中安装MySQL
docker pull mysql

5.查看MySQL镜像
docker images

6.创建MySQL用户并且将root账户密码设置为你需要的密码
docker run --name mysqlserver -v $PWD/conf:/etc/mysql/conf.d -v $PWD/logs:/logs -v $PWD/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=『你的账户密码』 -d -i -p 外网端口:3306 mysql:latest

docker run -p 33001:3306 --name mysqlSlave2 -v /mydata/mysql/log:/var/log/mysql -v /mydata/mysql/data:/var/lib/mysql -v /mydata/mysql/conf:/etc/mysql -e MYSQL_ROOT_PASSWORD=Lgq081538 -d mysql:5.7

#指定配置文件容器
docker run -p 33001:3306 --name mysqlSlave2 \
-v /usr/local/docker/mysql/logs:/var/log/mysql \
-v /usr/local/docker/mysql/data:/var/lib/mysql \
-v /usr/local/docker/mysql/conf/my.cnf:/etc/mysql/mysql.conf.d/mysqld.cnf \
-e MYSQL_ROOT_PASSWORD=Lgq081538 \
-d mysql:5.7

7.在docker中启动MySQL
docker exec -it mysqlSlave2 bash

8.输入用户名和密码
mysql -uroot -p

9.开启MySQL远程访问权限
use mysql;
select host,user from user;
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'Lgq081538';
flush privileges;

一些在docker的常用命令：
1、列出正在运行的容器
docker ps -a

2、列出包括未运行的所有的容器
docker ps

3、查看某进程最近10条运行日志
docker logs -f --tail 10 "所查询的进程ID"

4、关闭docker中运行的进程，以MySQL为例
docker stop mysql

或者
docker stop "要停止的进程ID"

5、重启docker中运行的进程
docker restart "要重启的进程ID"

6、重启docker
systemctl restart docker

7、停止docker
systemctl stop docker
```

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
