---
date: 2022-11-04 12:04:48

title: 腾讯云服务器liux系统下无法通过springBoot内置mail发送邮件的解决方案
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



### 腾讯云服务器liux系统下无法通过springBoot内置mail发送邮件的解决方案

原因

原来是腾讯云基于安全考虑，禁用了端口25。改成465或者解封25就可以发邮件了。

原始配置  本地可发送 

```java
spring:
  mail:
    username: ***********
    password: ***********
    host: smtp.163.com
    port: 25
    default-encoding: UTF-8
    properties:
      mail:
        smtp:
          timeout: 10000
          auth: true
          starttls:
            enable: true
            required: true
          socketFactory:
            port: 25
            class: javax.net.ssl.SSLSocketFactory
            fallback: false
```

修改的配置 测试 部署到服务器上是可以发送的

```java
spring:
  mail:
    username: ***********
    password: ***********
    host: smtp.163.com
    port: 465
    default-encoding: UTF-8
    properties:
      mail:
        smtp:
          timeout: 10000
          auth: true
          starttls:
            enable: true
            required: true
          socketFactory:
            port: 465
            class: javax.net.ssl.SSLSocketFactory
            fallback: false
```

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
