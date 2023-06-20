---
date: 2022-08-31 07:58:26

title: 【Java】canal服务运行一段时间客户端遍历不到数据
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Java】canal服务运行一段时间客户端遍历不到数据

canal：阿里巴巴的一款开源中间件，用于读取数据库binlog日志，实时发送给客户端。

问题：使用canal后运行一段时间，客户端一直轮询，但是batchId始终为-1，手动改动数据库数据后，仍然还是获取不到。

1.canal 服务读取出错了
检查canal日志关键是 logs\example下的，看是否由报错提示，如报错列不匹配，或者类型转换异常等，可能是你修改了表结构导致，直接配置tsdb数据库，然后删除meta.dat缓存即可。可参考上一篇文章

2.canal读取的binlog已被删除
这里首先要介绍 meta.data
位置位于 conf\example下

{"clientDatas":[{"clientIdentity":{"clientId":1001,"destination":"example","filter":".*\\..*"},"cursor":{"identity":{"slaveId":-1,"sourceAddress":{"address":"rm-m5epj85txc6175on5zo.mysql.rds.aliyuncs.com","port":3306}},"postion":{"gtid":"","included":false,"journalName":"mysql-bin.002943","position":151295060,"serverId":1430559368,"timestamp":1627023747000}}}],"destination":"example"}。

这个主要是用来记录binlog读取位置的。
首先我们找到 journalName，对应的是master数据库binlog日志文件名。
position为读取到binlog的位置。
而数据库的binlog会随着运行越来越多，所以它会自动删除之前的binlog日志。

然后去数据库执行

```shell
show master logs
```

![数据库binlog](https://img-blog.csdnimg.cn/084f87d796084db38bc9f90440fe7005.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI3Mjc1ODUx,size_16,color_FFFFFF,t_70)

log_name 则为现有的binlog日志，查找binlog是否和meta.dat里面记录的一致，若meta.data记录的binlog不在里面，则表示已被删除。
可将 journalName值改为现有的binlog日志，然后把position置为4

为什么canal读取的binlog会被删除呢
1.手动删除，服务器磁盘容易满，所以偶尔会有人手动删除binlog文件。

2.client端报错，客户端读取到canal发过来的数据后进行处理，若处理出错，程序在逻辑上没有ack此batchId，而是去反复执行，那么client端会一直执行此条batchId数据，此时后面数据会进入client，而在后面的batchid数据进来后会报canal的错误，batchId ***，大致意思就是执行的前面的batchId发现后面的batchid了，然后canal就卡在这了，不在读取后面的binlog，当后面的binlog被删除后，就和数据库的binlog对应不上了

首先要检查client端是否有报错，然后检查canal服务是否有报错，在检查binlog是否一致，若不一致再分析原因
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
