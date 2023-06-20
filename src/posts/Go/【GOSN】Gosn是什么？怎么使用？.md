---
date: 2022-11-30 08:17:34

title: 【GOSN】Gosn是什么？怎么使用？
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 

Gson是google开发的一个开源Json解析库，使用十分的方便，在[maven](https://so.csdn.net/so/search?q=maven&spm=1001.2101.3001.7020)当中导入的方式为：

```xml
<dependency>  
    <groupId>com.google.code.gson</groupId>  
    <artifactId>gson</artifactId>  
    <version>2.8.2</version>  
</dependency>  
```

其中2.8.2为版本号，最新版本以及源码可以在官方的github上查看：https://github.com/google/gson

这里给出最简单的Gson的使用方法：

```java
Object obj = new Object();
 
//Object转Json字符串
 
String obstr = new Gson().toJson(object);
 
//Json字符串转Object
 
Object object = new Gson().fromJson(obstr);
```
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
