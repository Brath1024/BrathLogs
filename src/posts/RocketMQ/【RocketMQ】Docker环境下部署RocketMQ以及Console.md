---
date: 2020-12-16 19:20:47

title: Docker环境下部署RocketMQ以及Console
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# Docker环境下部署RocketMQ以及Console



## 1.docker 安装rocketmq镜像

```
#拉取镜像 
docker pull foxiswho/rocketmq:server-4.7.0
docker pull foxiswho/rocketmq:broker-4.7.0
```



## 2.创建server和broker目录，并在目录/opt下创建broker.conf

```shell
#创建目录
mkdir /opt/rocketmq-server
mkdir /opt/rocketmq-broker/conf -p
[root@localhost opt]# cat /opt/rocketmq-broker/conf/broker.conf 
namesrvAddr=【你的IP地址】:9876
brokerClusterName = DefaultCluster
brokerName = broker-a
brokerId = 0
deleteWhen = 04
fileReservedTime = 48
brokerRole = ASYNC_MASTER
flushDiskType = ASYNC_FLUSH
brokerIP1 = 【你的IP地址】
listenPort=10911
```



## 3.启动容器并在防火墙放行端口 9876 、10911 、11011

```shell
RocketMQ默认使用3个端口：9876 、10911 、11011
如果防火墙没有关闭的话，那么防火墙就必须开放这些端口：
nameserver 默认使用 9876 端口
master 默认使用 10911 端口
slave 默认使用11011 端口

#启动rocketmq-server
docker run -d \
--restart=always \
--name rmqnamesrv \
-p 9876:9876 \
-v /opt/rocketmq-server/logs:/root/logs \
-v /opt/rocketmq-server/store:/root/store \
-e "MAX_POSSIBLE_HEAP=100000000" \
foxiswho/rocketmq:4.7.0 \
sh mqnamesrv

#启动rocketmq-broker
docker run -d  \
--restart=always \
--name rmqbroker \
--link rmqnamesrv:namesrv \
-p 10911:10911 \
-p 10909:10909 \
-v  /opt/rocketmq-broker/logs:/root/logs \
-v  /opt/rocketmq-broker/store:/root/store \
-v /opt/rocketmq-broker/conf/broker.conf:/opt/rocketmq-broker/conf/broker.conf \
-e "NAMESRV_ADDR=【你的IP地址】:9876" \
-e "MAX_POSSIBLE_HEAP=200000000" \
-e "autoCreateTopicEnable=true" \
foxiswho/rocketmq:4.7.0 \
sh mqbroker -c /opt/rocketmq-broker/conf/broker.conf


#启动RocketMQ的管理工具rocketmq-console
docker run -itd -e "JAVA_OPTS=-Drocketmq.namesrv.addr=【你的IP地址】:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false" -p 9877:8080 -t styletang/rocketmq-console-ng:latest
```



## 4.测试访问console控制台

浏览器输入：192.168.1.200:9877

![image-20230104082814121](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20230104082814121.png)





























## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
