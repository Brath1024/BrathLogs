---
date: 2021-08-15 12:38:35

title: 【MySQL】MySQL删除重复数据只保留一条
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【MySQL】MySQL删除重复数据只保留一条

**（1）以这张表为例：**

```sql
CREATE TABLE `test`  (
  `id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '注解id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '名字',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

INSERT INTO test (id,`name`) VALUES (replace(uuid(),'-',''),'张三'),(replace(uuid(),'-',''),'张三');
```

表里有两条数据，然后名字是相同的，但是id是不同的，现在要求是只留一条数据：

![在这里插入图片描述](https://img-blog.csdnimg.cn/888323c3cc9c4871ac5eeaf2aa7b55a1.png)

**（2）查询name值重复的数据：**

> 现实开发当中可能一个字段无法锁定重复值，可以采取group by多个值！利用多个值来锁定重复的行数据！

```sql
SELECT name FROM test GROUP BY `name` HAVING count( name ) > 1
```

**（3）查询重复数据里面每个最小的id：**

```sql
SELECT  min(id) as id FROM test GROUP BY `name` HAVING count( name ) > 1
```

**（4）查询去掉重复数据最小id的其他数据：也就是要删除的数据！**

```sql
SELECT * FROM test 
WHERE name IN ( SELECT name FROM test GROUP BY `name` HAVING count( name ) > 1 ) 
AND 
id NOT IN (SELECT min( id ) FROM test GROUP BY `name` HAVING count( NAME ) > 1)
```

**（5）删除去掉重复数据最小id的其他数据：**

> 可能这时候有人该说了，有了查询，直接改成delete不就可以了，真的是这样吗？其实不是的，如下运行报错：

![在这里插入图片描述](https://img-blog.csdnimg.cn/917867c90bfc49fdacf3a1f5e45de26d.png)

首先明确一点这个错误只会发生在`delete`语句或者`update`语句，拿update来举例 : `update A表 set A列 = (select B列 from A表)；` 这种写法就会报这个错误，原因：你又要修改A表，然后又要从A表查数据，而且还是同层级。Mysql就会认为是语法错误！

嵌套一层就可以解决，`update A表 set A列 = (select a.B列 from (select * from A表) a);` 当然这个只是个示例，这个示例也存在一定的问题，比如`(select a.B列 from (select * from A表) a)`他会查出来多条，然后赋值的时候会报 `1242 - Subquery returns more than 1 row`。

嵌套一层他就可以和update撇清关系，会优先查括号里面的内容，查询结果出来过后会给存起来，类似临时表，可能有的人该好奇了，`update A表 set A列 = (select B列 from A表)；` 我明明加括号了呀，难道不算嵌套吗，当然不算，那个括号根本没有解决他们之间的层次关系！

详解看这篇文章：https://blog.csdn.net/weixin_43888891/article/details/127000534

**（6）正确的写法：**

方式一：

```sql
DELETE FROM test 
WHERE name IN ( select a.name from (SELECT name FROM test GROUP BY `name` HAVING count( name ) > 1) a) 
AND 
id NOT IN (select a.id from (SELECT  min(id) as id FROM test GROUP BY `name` HAVING count( name ) > 1) a)
```

> **`注意：删除之前一定要先查询，然后再删除，否则一旦语法有问题导致删了不想删除的数据，想要恢复很麻烦！或者删除前备份好数据，不要嫌麻烦，一旦出问题，才是真正的大麻烦！`**

方式二：

```sql
DELETE FROM test 
WHERE
	id NOT IN (
	SELECT
		t.id 
FROM
	( SELECT MIN(id) as id FROM test GROUP BY NAME ) t)

```

**（7）错误的写法：** 这块我吃过一次亏，所以专门写出来，避免踩坑！

> 千万千万不能这么搞，下面这个语法相当于是先按name分组，然后查出来大于1的，这时候假如大于1的有很多，然后外面嵌套的那一层，只取了最小的一条数据，然后再加上使用的是`NOT IN`，最终会导致数据全部被删除！！！

![在这里插入图片描述](https://img-blog.csdnimg.cn/6c67f02195ef4b69b3f896f39f9d8b84.png)

执行前有四条数据，实际上我们要的是张三留下来一条，然后李四留下来一条

![在这里插入图片描述](https://img-blog.csdnimg.cn/9f86345b6b9c4e009a0b596ddbb1c83e.png)

执行结果：只留下了一条！

![在这里插入图片描述](https://img-blog.csdnimg.cn/be5a73336f5e4a26b93314e10231d998.png)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
