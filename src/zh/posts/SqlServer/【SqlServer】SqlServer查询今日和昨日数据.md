---
date: 2023-03-29 12:21:33

title: 【SqlServer】SqlServer查询今日和昨日数据
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【SqlServer】SqlServer查询今日和昨日数据

在where后加入以下[sql语句](https://so.csdn.net/so/search?q=sql语句&spm=1001.2101.3001.7020)

今天：

```vbscript
where DateDiff(dd,时间字段,getdate())=0
```

昨天：

```vbscript
where DateDiff(dd,时间字段,getdate())=1
```



# 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！

