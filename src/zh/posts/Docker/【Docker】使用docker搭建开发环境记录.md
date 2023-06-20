---
date: 2023-01-17 22:35:27

title: 使用docker搭建开发环境记录
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 使用docker搭建开发环境记录

```shell
docker start 容器名
docker stop 容器名
docker restart 容器名

docker run = docker create + docker start
```

### mysql

```shell
# 拉取镜像
docker pull mysql:5.7

# 创建实例并启动
# -p 映射端口
# --name 名称
# -v 映射文件
# -e MYSQL_ROOT_PASSWORD mysql密码
# -d 后台运行并运行
docker run -p 3306:3306 --name mysql -v /mydata/mysql/log:/var/log/mysql -v /mydata/mysql/data:/var/lib/mysql -v /mydata/mysql/conf:/etc/mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7

# 进入容器
docker exec -it mysql /bin/bash
# 退出容器
exit

# 配置my.conf
## 1.在容器外编辑配置文件
vi /mydata/mysql/conf/my.cnf

[client]
default-character-set=utf8
[mysql]
default-character-set=utf8
[mysqld]
init_connect='SET conllation_connection = utf8_unicode_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
skip-name-resolve
## 2. 重启mysql容器
docker restart mysql
## 3. 进入mysql容器验证
docker exec -it mysql /bin/bash 
cat /etc/mysql/my.cnf
```

### Redis

```shell
# 拉取镜像
docker pull redis

# 配置文件
本地：/mydata/redis/data/redis.conf 提前准备好
主要配置
bind 127.0.0.1 #注释掉这部分，使redis可以外部访问
daemonize no#用守护线程的方式启动
requirepass 你的密码#给redis设置密码
appendonly yes#redis持久化　　默认是no
tcp-keepalive 300 #防止出现远程主机强迫关闭了一个现有的连接的错误 默认是300

# 创建实例并启动
docker run -p 6379:6379 --name redis -v /mydata/redis/data/redis.conf:/etc/redis/redis.conf  -v /mydata/redis/data:/data -d redis redis-server /etc/redis/redis.conf --appendonly yes

```

### Rabbitmq

```shell
# 拉取镜像management带控制台
docker pull rabbitmq:management

# 创建实例并启动
docker run -d --hostname my-rabbit --name rabbit -v /mydata/rabbitmq:/var/lib/rabbitmq -e RABBITMQ_DEFAULT_USER=root -e RABBITMQ_DEFAULT_PASS=Mm_123456 -p 15672:15672 -p 5672:5672 rabbitmq:management
```

### mongo

```shell
# 拉取镜像
docker pull mongo

# 创建实例并启动
docker run -p 27017:27017 -v /mydata/mongo:/data/db --name mongodb -d mongo
```

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
