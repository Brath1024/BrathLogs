---
date: 2022-02-08 21:28:46

title: redis主从集群-哨兵模式搭建文档
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



准备工作

- ### 三台服务器 

| 服务器ip     | 角色 |
| :----------- | ---- |
| 192.168.20.1 | 主   |
| 192.168.20.2 | 从   |
| 192.168.20.3 | 从   |

2. #### docker安装redis

docker pull redis

3. #### 运行

分别从三台服务器运行redis镜像，注意映射不同外端口

```shell
docker run -p 6380:6379 --name redis -v /mydata/redis/data/redis.conf:/etc/redis/redis.conf  -v /mydata/redis/data:/data -d redis redis-server /etc/redis/redis.conf --appendonly yes --daemonize no --masterauth #如果主节点设置了密码，请输入主服务密码
```

docker exec -it redis_master /bin/bash

4. #### 查看角色

#### 主：

```shell
127.0.0.1:6379> auth #你的密码
OK
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:0
master_failover_state:no-failover
master_replid:f28e9097e4c8cd3f67292181be12955909afd88e
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
127.0.0.1:6379> 
```



#### 从01:

```shell
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:0
master_failover_state:no-failover
master_replid:48a7e3866afc4b6784ef49353b57fbc979ee2935
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
127.0.0.1:6379> 
```



#### 从02：

```shell
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:0
master_failover_state:no-failover
master_replid:de30809041f22f2dd6abc9cb34536f26df97e647
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
127.0.0.1:6379> 
```



4. #### 在两台从服务器上执行命令 replicaof 192.168.20.1 6379

```shell
127.0.0.1:6379> replicaof 192.168.20.1 6379
OK
127.0.0.1:6379> 
```



5. #### 查看主服务信息

```shell
127.0.0.1:6379> info replication
# Replication
role:master
 
###从服务器信息
connected_slaves:2
slave0:ip=172.17.0.3,port=6379,state=online,offset=1456,lag=1
slave1:ip=172.17.0.4,port=6379,state=online,offset=1456,lag=0
###从服务器信息
 
master_failover_state:no-failover
master_replid:9b8c2ef4539809505fa5bc1dd779c4500298011d
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:1456
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:1456
127.0.0.1:6379> 


127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:0
master_failover_state:no-failover
master_replid:f28e9097e4c8cd3f67292181be12955909afd88e
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
127.0.0.1:6379> 

```



6. #### 测试：

主服务器上：

```shell
127.0.0.1:6379> set name zs
OK
127.0.0.1:6379> 
```



### 从服务器也可以查看到信息

```shell
127.0.0.1:6379> replicaof 192.168.20.1 6379
OK
127.0.0.1:6379> get name
"zs"
127.0.0.1:6379> 
```



### 异常统计：

可能遇到的BUG：MASTER aborted replication with an error: NOAUTH Authentication required.

场景：在配置主从后发现两个从节点的info replication中出现：master_link_status:down

原因：大部分原因是因为主节点配置了密码

解决：在从节点的配置文件中加入 masterauth 你的主节点密码 即可

















## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
