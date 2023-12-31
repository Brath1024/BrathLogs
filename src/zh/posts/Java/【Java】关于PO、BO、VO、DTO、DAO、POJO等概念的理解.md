---
date: 2023-04-26 16:51:33

title: 【Java】关于PO、BO、VO、DTO、DAO、POJO等概念的理解
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【Java】关于PO、BO、VO、DTO、DAO、POJO等概念的理解



## PO（Persistant Object）持久对象

PO是持久化对象，用于表示数据库中的一条记录映射成的Java对象，类中应该都是基本数据类型和String，而不是更复杂的类型，因为要和数据库表字段对应。PO仅仅用于表示数据，不对数据进行操作，拥有get和set方法。对象类中的属性对应数据库表中的字段，有多少个字段就有多少个属性，完全匹配。遵循JavaBean规范，拥有get和set方法。如下图所示：

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/20210725154038992.png)

## DO（Data Object）数据对象

数据对象，与数据库表结构一一对应，通过dao层向上传输数据对象，属性和PO中的基本一致。

## AO（Application Object）应用对象

在Web层与Service层之间抽象的复用对象模型，极为贴近展示层，复用度不高。

##  BO（Business Object）业务对象

 BO是实际的业务对象，会参与业务逻辑的处理操作，里面可能会包含多个类，用于表示一个业务对象。例如用户可以拥有宠物，在这里把用户对应一个PO、宠物对应一个PO，那么建立一个对应的BO对象来处理用户和宠物的关系，每个BO都包含用户PO和宠物PO，而处理逻辑时针对BO去处理。遵循JavaBean规范，拥有get和set方法。例如：（注：User和Pet都是PO对象，但会放进BO中，形成一个复杂的业务对象。）

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/20210725155328378.png)

但注意，BO又包括了业务逻辑，通常在service层，封装了对DAO层的调用，可以进行PO与VO/DTO之间的转换。

## VO（Value Object）表现对象

VO对象主要用于前端界面显示的数据，是与前端进行交互的Java对象，但这里是不用PO传递数据的，因为PO包括数据库表中的所有字段，对于前端来说我们只需要显示一部分字段就可以了，例如我们的用户表user中的password（密码）字段、phone（电话）字段、insert_time（插入时间）字段是没有必要也不能显示在前端界面的。遵循JavaBean规范，拥有get和set方法。

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/20210725155929945.png)

 ![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/20210725160415980.png)

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/20210725160406410.png)

##  DTO（Data Transfer Object）数据传输对象

数据传输对象是在传递给前端时使用的，如一张表有100个字段，那么对应的PO就有100个属性，但是我们的前端界面只需要显示10个字段，所以我们没必要把所有字段的PO对象传递到客户端，我们只需要把只有这10个属性的DTO对象传递到客户端，不会暴露服务端的表结构，到达客户端后，如果这个对象用于界面表示，那么它的身份就是VO对象。

DTO和VO概念相似，通常情况下字段也基本一致。但有所不同，DTO表示一个数据传输对象，是在服务端用于不同服务或不同层之间的数据传输，例如dao层到service层，service层到web层；而VO是在客户端浏览器显示的表现对象，用于在浏览器界面数据的显示。

## DAO（Data Access Object）数据访问对象

DAO是主要封装对数据库的访问，例如UserDao封装的就是对user表的增删改查操作。

通过它可以把POJO持久化为PO，用PO组装出VO和DTO。

DAO一般在持久层，完全封装数据库操作，对外暴露的方法的使得上层不需要关注数据库的相关信息，只需要插入、删除、更新、查询即可。

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/2021072516452423.png)

##  POJO（Plain Ordinary Java Object）简单Java对象

表示一个个简单的Java对象，而PO、VO、DTO都是典型的POJO，而DAO和BO一般不是POJO，只是提供了一些调用方法。

POJO是DO、DTO、BO、VO的统称。

## 实例

有一个博客系统，数据库中存储了很多篇博客。我们会做如下设计：

- 数据库表：表中的博客包括编号、博客标题、博客内容、博客标签、博客分类、博客状态、创建时间、修改时间等。
- PO：包括编号、博客标题、博客内容、博客标签、博客分类、博客状态、创建时间、修改时间等。（与数据库表中的字段一样。）
- VO：在客户端浏览器展示的页面数据，博客标题、博客内容、博客标签、博客分类、创建时间、上一篇博客URL、下一篇博客URL。
- DTO：在服务端数据传输的对象，编号、博客标题、博客内容、博客标签、博客分类、创建时间、上一篇博客编号、下一篇博客编号。
- DAO：数据库增删改查的方法，例如新增博客、删除博客、查询所有博客、更新博客。
- BO：基本业务操作，如管理分类、管理标签、修改博客状态等，是我们常说的service层操作。



参考链接：

- [Java中常见的对象类型简述(DO、BO、DTO、VO、AO、PO)](https://blog.csdn.net/uestcyms/article/details/80244407)
- [PO BO VO DTO POJO DAO DO这些Java中的概念分别指一些什么？](https://www.zhihu.com/question/39651928)



## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！