---
date: 2022-02-22 00:11:02

title: 阿里巴巴Java开发手册中的DO、DTO、BO、AO、VO、POJO定义
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



分层领域模型规约：

DO（ Data Object）：与数据库表结构一一对应，通过DAO层向上传输数据源对象。
DTO（ Data Transfer Object）：数据传输对象，Service或Manager向外传输的对象。
BO（ Business Object）：业务对象。 由Service层输出的封装业务逻辑的对象。
AO（ Application Object）：应用对象。 在Web层与Service层之间抽象的复用对象模型，极为贴近展示层，复用度不高。
VO（ View Object）：显示层对象，通常是Web向模板渲染引擎层传输的对象。
POJO（ Plain Ordinary Java Object）：在本手册中， POJO专指只有setter/getter/toString的简单类，包括DO/DTO/BO/VO等。
Query：数据查询对象，各层接收上层的查询请求。 注意超过2个参数的查询封装，禁止使用Map类来传输。
领域模型命名规约：

数据对象：xxxDO，xxx即为数据表名。
数据传输对象：xxxDTO，xxx为业务领域相关的名称。
展示对象：xxxVO，xxx一般为网页名称。
POJO是DO/DTO/BO/VO的统称，禁止命名成xxxPOJO。
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
