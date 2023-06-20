---
date: 2021-12-18 14:55:06

title: Canal数据同步，接收不到Rowdata类型
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# Canal数据同步，接收不到Rowdata类型

> 问题描述如下图，只能接收到TRANSACTIONBEGIN和TRANSACTIONEND日志，收不到ROWDATA类型数据，所以问题还是出在[正则表达式](https://so.csdn.net/so/search?q=正则表达式&spm=1001.2101.3001.7020)身上。由于我本身客户端也有一份订阅正则表达式，覆盖了本身的正则表达式，一度改为`.*\\..*`也不好使，所以一开始被迷惑掉了。我们再回顾一下他的规范
> `常见例子：`
> `1. 所有表：.* or .*\\..*`
> `2. canal schema下所有表： canal\\..*`
> `3. canal下的以canal打头的表：canal\\.canal.*`
> `4. canal schema下的一张表：canal\\.test1`
> `5. 多个规则组合使用：canal\\..*,mysql.test1,mysql.test2 (逗号分隔)`
> 我们在覆盖客户端的订阅的时候，他在有的Issue上或者很多博客中也有回复使用`.*\\..*`会覆盖服务端配置，这样确实会，但是这样会所有的表都不能匹配到该正则上。

![被过滤的表DML语句日志将不会被分析](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/20200925100828242.png)

### 问题发现

> 发现问题是在修改了五六个小时之后回家睡觉的第二个早上，静下心来又分析了一次日志发现了问题所在。
> 下面图表示我的服务器端配置正则(没有问题正确的),客户端的正则(有问题的)。昨天心态崩了没有发现这一点细节。Cananl文档中是有提的库和表中间有两个\，其中一个就是用来转义的作用(毕竟服务器端读取配置需要读取文件并进行编码)。
> ![注意看两个订阅正则](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/20200925101906176.png)

> 在客户端订阅的时候[官方文档](https://github.com/alibaba/canal/wiki/ClientExample)示例也是两个\，如下图。所以理所当然的就将两个\的订阅配置加入客户端配置中。但是，就会出现上面的日志，客户端的错误订阅(多了一个\)正则刷新掉了服务端的正确正则导致所有的表都被过滤掉了，就发生了只会出现事务日志的问题。
> ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/20200925102551553.png)

### 正确客户端配置

> 声明环境，我的配置都是在nacos上，所以转义符对我来说没有意义，所以我的正则为`.*\..*`也就是去掉一个\。比如我监控的monitor库中monitor开头的表就是`monitor\.monitor.*`即可。下面成功。
> 还有一个注意点就是`如果你直接写到代码中的订阅也不需要加转义符，请忽略官方文档的那行代码示例`

![正则匹配到的表DML日志被分析传递](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/20200925100948374.png)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
