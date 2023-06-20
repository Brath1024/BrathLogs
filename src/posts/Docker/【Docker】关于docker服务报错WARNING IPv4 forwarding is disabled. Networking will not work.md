---
date: 2023-03-14 23:49:50

title: 【Docker】关于docker服务报错WARNING IPv4 forwarding is disabled. Networking will not work
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



### 【Docker】关于docker服务报错WARNING IPv4 forwarding is disabled. Networking will not work



**注意：在这里强调，强制进入或者进入镜像，进入后会引起yum install和wget等不能使用**

## **一，docker 运行直接报错**

**报错：**

[root@localhost /]# docker run -it ubuntu /bin/bash

*WARNING: IPv4 forwarding is disabled. Networking will not work.*

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/05472c924858164c6df96734a709fd3b.png)

1.解决方式：

第一步：在宿主机上执行echo "net.[ipv4](https://so.csdn.net/so/search?q=ipv4&spm=1001.2101.3001.7020).ip_forward=1" >>/usr/lib/sysctl.d/00-system.conf

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/56fe262e97ffdd8fb3992692af566dd2.png)

2.第二步：重启network和docker服务

[root@localhost /]# systemctl restart network && systemctl restart docker

3.第三步：验证是否成功

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/fe9d3a924773707b13542350b4f77b2e.png)

可见完美解决问题。

## 二，如果你是docker容器运行镜像的时候也是报这种错误，相对应得也是重启一下docker就可以完美解决了了。
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
