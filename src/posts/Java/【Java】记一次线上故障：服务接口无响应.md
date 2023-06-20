---
date: 2023-05-17 16:20:40

title: 【Java】记一次线上故障：服务接口无响应
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



## 事故起因

##### 		中午公众号突然收到消息，很多用户说chatGPT不回复，询问我是不是程序坏掉了



## 排查流程

#### 	1.进入docker查看服务日志，发现日志都正常输出，没有报错

#### 	2.在本地启动程序排查，发现无异常

#### 	3.使用接口工具调用其他接口和网关心跳接口尝试，无响应

#### 	4.查看线上CPU和内存使用率，结果正常

#### 	5.查看线上磁盘：占用100%



## 结果

​	清理掉Nacos的大量日志后，服务恢复正常。





## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！