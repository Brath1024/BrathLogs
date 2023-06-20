---
date: 2021-05-01 06:47:21

title: docker简单部署rocketMQ
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# docker简单部署rocketMQ

1.创建namesrv服务
拉取镜像

```
docker pull rocketmqinc/rocketmq
```



### 创建namesrv数据存储路径

```
mkdir -p  /docker/rocketmq/data/namesrv/logs   /docker/rocketmq/data/namesrv/store
```



### 构建namesrv容器

```
docker run -d \
--restart=always \
--name rmqnamesrv \
-p 9876:9876 \
-v /docker/rocketmq/data/namesrv/logs:/root/logs \
-v /docker/rocketmq/data/namesrv/store:/root/store \
-e "MAX_POSSIBLE_HEAP=100000000" \
rocketmqinc/rocketmq \
sh mqnamesrv 
```

# 2.创建broker节点



## 创建broker数据存储路径

```bash
mkdir -p  /docker/rocketmq/data/broker/logs   /docker/rocketmq/data/broker/store /docker/rocketmq/conf
```



## 创建配置文件

```
vi /docker/rocketmq/conf/broker.conf
# 所属集群名称，如果节点较多可以配置多个
brokerClusterName = DefaultCluster
#broker名称，master和slave使用相同的名称，表明他们的主从关系
brokerName = broker-a
#0表示Master，大于0表示不同的slave
brokerId = 0
#表示几点做消息删除动作，默认是凌晨4点
deleteWhen = 04
#在磁盘上保留消息的时长，单位是小时
fileReservedTime = 48
#有三个值：SYNC_MASTER，ASYNC_MASTER，SLAVE；同步和异步表示Master和Slave之间同步数据的机制；
brokerRole = ASYNC_MASTER
#刷盘策略，取值为：ASYNC_FLUSH，SYNC_FLUSH表示同步刷盘和异步刷盘；SYNC_FLUSH消息写入磁盘后才返回成功状态，ASYNC_FLUSH不需要；
flushDiskType = ASYNC_FLUSH
# 磁盘使用达到95%之后,生产者再写入消息会报错 CODE: 14 DESC: service not available now, maybe disk full
diskMaxUsedSpaceRatio=95

namesrvAddr=【IP】:9876
brokerIP1 = 【IP】
```



## 构建broker容器

```
docker run -d  \
--restart=always \
--name rmqbroker \
--link rmqnamesrv:namesrv \
-p 10911:10911 \
-p 10912:10912 \
-p 10909:10909 \
-v  /docker/rocketmq/data/broker/logs:/root/logs \
-v  /docker/rocketmq/data/broker/store:/root/store \
-v /docker/rocketmq/conf/broker.conf:/opt/rocketmq-4.4.0/conf/broker.conf \
-e "NAMESRV_ADDR= 【你的IP地址】:9876" \
-e "MAX_POSSIBLE_HEAP=200000000" \
rocketmqinc/rocketmq \
sh mqbroker -c /opt/rocketmq-4.4.0/conf/broker.conf  


```



# 3.创建rockermq-console服务

## 拉取镜像

```bash
docker pull pangliang/rocketmq-console-ng
```



## 构建rockermq-console容器

```
docker run -d \
--restart=always \
--name rmqadmin \
-e "JAVA_OPTS=-Drocketmq.namesrv.addr=【你的IP地址】:9876 \
-Dcom.rocketmq.sendMessageWithVIPChannel=false" \
-p 9877:8080 \
pangliang/rocketmq-console-ng

```



### 关闭防火墙

```bash
systemctl stop firewalld.service
```



### 开放指定端口

```
firewall-cmd --permanent --zone=public --add-port=9876/tcp
firewall-cmd --permanent --zone=public --add-port=10911/tcp
firewall-cmd --permanent --zone=public --add-port=10912/tcp
# 立即生效
firewall-cmd --reload

```



## 访问控制台

网页访问http://【IP】:9999/查看控制台信息

![在这里插入图片描述](https://brath.cloud/blogImg/20201013235856206.png)

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
