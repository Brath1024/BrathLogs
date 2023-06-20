---
date: 2020-12-06 18:46:26

title: 【MYSQL】水平分表、分库和垂直分表、分库和公共表的代码实现和讲解
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)





### 文章目录

- [一、教学讲解视频](#_1)
- [二、环境准备](#_3)
- [三、水平分表](#_99)
- - [1.概念](#1_100)
  - [2.代码](#2_114)
- [四、水平分库](#_221)
- - [1.概念](#1_223)
  - [2.代码](#2_229)
- [五、垂直分表](#_351)
- - [1.概念](#1_352)
  - [2.代码](#2_356)
- [六、垂直分库](#_358)
- - [1.概念](#1_359)
  - [2.代码](#2_362)
- [七、公共表](#_364)
- - [1.概念](#1_365)
  - [2.代码](#2_367)



# 一、教学讲解视频

教学讲解视频地址：[视频地址](https://www.bilibili.com/video/BV1tx4y1371w)

# 二、环境准备

- 操作系统：Win10

- 数据库：MySQL5.7

- JDK：64位 jdk1.8.0_202

- 应用框架：spring-boot-2.1.3.RELEASE

- Sharding-JDBC：sharding-jdbc-spring-boot-starter-4.0.0-RC1

  

对应的pom.xml依赖代码

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.1.3.RELEASE</version>
    <relativePath/> <!-- lookup parent from repository -->
  </parent>


  <groupId>com.yjq.programmer</groupId>
  <artifactId>ShardingJDBC</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>ShardingJDBC</name>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <!-- 引入mysql连接依赖 -->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>5.1.6</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- 引入sharding-jdbc连接依赖 -->
    <dependency>
      <groupId>org.apache.shardingsphere</groupId>
      <artifactId>sharding-jdbc-spring-boot-starter</artifactId>
      <version>4.0.0-RC1</version>
    </dependency>
    <!--引入阿里巴巴druid连接池-->
    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>1.1.19</version>
    </dependency>
    <!-- 引入测试依赖 -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <!-- 集成mybatis -->
    <dependency>
      <groupId>org.mybatis.spring.boot</groupId>
      <artifactId>mybatis-spring-boot-starter</artifactId>
      <version>1.3.2</version>
    </dependency>
    <!-- 集成junit测试 -->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
      <plugins>

        <plugin>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>

      </plugins>
    </pluginManagement>
  </build>
</project>
```

# 三、水平分表

## 1.概念

水平分表是在`同一个`数据库内，把同一个表的数据`按一定规则`拆分到多个`表`中。
因此，目前我在一个数据库中准备了两个表，`t_user_1`和`t_user_2`，如下图。
![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/b9b8ccb2a36e4028bb013590fc3e84ea.png)
表结构：

```bash
CREATE TABLE `t_user_1` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `sex` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## 2.代码

①我们先来看下我们的SpringBoot的`配置文件`代码。

```bash
server.port=8081
#1800s
server.servlet.session.timeout=1800
spring.jackson.time-zone=GMT+8
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss

#定义数据源
spring.shardingsphere.datasource.names=m1

spring.shardingsphere.datasource.m1.url=jdbc:mysql://127.0.0.1:3306/db_user1?serverTimezone=GMT%2b8&useUnicode=true&characterEncoding=utf8
spring.shardingsphere.datasource.m1.username=root
spring.shardingsphere.datasource.m1.password=
spring.shardingsphere.datasource.m1.driver‐class‐name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.m1.type=com.alibaba.druid.pool.DruidDataSource

# 指定t_user表的数据分布情况，配置数据节点
spring.shardingsphere.sharding.tables.t_user.actual‐data‐nodes=m1.t_user_$->{1..2}

# 指定t_user表的主键生成策略为SNOWFLAKE
spring.shardingsphere.sharding.tables.t_user.key‐generator.column=id
spring.shardingsphere.sharding.tables.t_user.key‐generator.type=SNOWFLAKE

# 指定t_user表的分表策略，分表策略包括分片键和分片算法
spring.shardingsphere.sharding.tables.t_user.table‐strategy.inline.sharding‐column=id
spring.shardingsphere.sharding.tables.t_user.table‐strategy.inline.algorithm‐expression=t_user_$->{id % 2 + 1}


# 控制台日志配置
logging.level.root=info
logging.level.com.yjq.programmer.dao=debug

# 打开sql输出日志
spring.shardingsphere.props.sql.show=true

#mapper文件扫描路径
mybatis.mapper-locations=classpath*:mappers/**/*.xml
```

- 首先定义数据源m1，并对m1进行实际的参数配置。
- 指定t_user表的数据分布情况，他分布在m1.t_user_1，m1.t_user_2。
- 指定t_user表的主键生成策略为SNOWFLAKE，SNOWFLAKE是一种分布式自增算法，保证id全局唯一。
- 定义t_user分表策略，id为偶数的数据落在t_user_1，为奇数的落在t_user_2，所以分表策略的表达式为t_user_$->{id% 2 + 1}。

**踩坑注意！** 如果启动项目有如下报错，可能是配置文件中的`->`没有用英文类型的。
![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/1b3e0aca06df43c4bb2671eabc7a2e9d.png)
![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/9a9e406ab2bd4e3db3c55aac18a9b178.png)

②然后接下来就写我们的`dao`层、`mapper`层和`单元测试`的代码，去测试我们的水平分表情况下`插入`和`查询`的结果。

`dao`层

```bash
public interface UserDao {

    int insertUser(User user);

    List<User> selectUser();
}
```

`mapper`层

```bash
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.yjq.programmer.dao.UserDao">

    <insert id="insertUser" parameterType="com.yjq.programmer.entity.User">
        insert into t_user(name) values (#{name})
    </insert>


    <select id="selectUser" resultType="com.yjq.programmer.entity.User">
        select * from t_user
    </select>
</mapper>
12345678910111213
单元测试
@Test
public void testShardingJDBCInsert() {
    User user = new User();
    for(int i=0; i<10; i++) {
        user.setName("小明" + i);
        if(userDao.insertUser(user) == 1) {
            logger.info("插入成功！");
        } else {
            logger.info("插入失败！");
        }
    }
}


@Test
public void testShardingJDBCSelect() {
    List<User> userList = userDao.selectUser();
    logger.info("查询结果：{}", JSONObject.toJSONString(userList));
}
```

③结果说明
`插入`
id为奇数的被插入到t_user_2表，为偶数的被插入到t_user_1表，达到预期目标。
`查询`
[sharding-jdbc](https://so.csdn.net/so/search?q=sharding-jdbc&spm=1001.2101.3001.7020)分别去不同的表检索数据，达到预期目标；**如果有传入id进行查询，sharding-jdbc也会根据t_user的分表策略去不同的表检索数据**。

# 四、水平分库

## 1.概念

水平分库是把同一个表的数据按`一定规则`拆分到不同的`数据库`中，每个库可以放在不同的服务器上。
现在，我在`水平分表`的基础上多加了一个db_user2的数据库。
![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/80d1a3af2700414b9a0850ae9172034a.png)
然后两个数据库中的表结构是一致的，表结构和上面水平分表用的保持一样。
![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/9354ea1b1af043238412581e0769b3dd.png)

## 2.代码

①我们先来看下我们的SpringBoot的`配置文件`代码。

```bash
server.port=8081
#1800s
server.servlet.session.timeout=1800
spring.jackson.time-zone=GMT+8
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss

#定义数据源
spring.shardingsphere.datasource.names=m1,m2

spring.shardingsphere.datasource.m1.url=jdbc:mysql://127.0.0.1:3306/db_user1?serverTimezone=GMT%2b8&useUnicode=true&characterEncoding=utf8
spring.shardingsphere.datasource.m1.username=root
spring.shardingsphere.datasource.m1.password=
spring.shardingsphere.datasource.m1.driver‐class‐name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.m1.type=com.alibaba.druid.pool.DruidDataSource

spring.shardingsphere.datasource.m2.url=jdbc:mysql://127.0.0.1:3306/db_user2?serverTimezone=GMT%2b8&useUnicode=true&characterEncoding=utf8
spring.shardingsphere.datasource.m2.username=root
spring.shardingsphere.datasource.m2.password=
spring.shardingsphere.datasource.m2.driver‐class‐name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.m2.type=com.alibaba.druid.pool.DruidDataSource

# 分库策略
spring.shardingsphere.sharding.tables.t_user.database‐strategy.inline.sharding‐column=sex
spring.shardingsphere.sharding.tables.t_user.database‐strategy.inline.algorithm‐expression=m$->{sex % 2 + 1}

# 指定t_user表的数据分布情况，配置数据节点
spring.shardingsphere.sharding.tables.t_user.actual‐data‐nodes=m$->{1..2}.t_user_$->{1..2}

# 指定t_user表的主键生成策略为SNOWFLAKE
spring.shardingsphere.sharding.tables.t_user.key‐generator.column=id
spring.shardingsphere.sharding.tables.t_user.key‐generator.type=SNOWFLAKE

# 指定t_user表的分表策略，分表策略包括分片键和分片算法
spring.shardingsphere.sharding.tables.t_user.table‐strategy.inline.sharding‐column=id
spring.shardingsphere.sharding.tables.t_user.table‐strategy.inline.algorithm‐expression=t_user_$->{id % 2 + 1}


# 控制台日志配置
logging.level.root=info
logging.level.com.yjq.programmer.dao=debug

# 打开sql输出日志
spring.shardingsphere.props.sql.show=true

#mapper文件扫描路径
mybatis.mapper-locations=classpath*:mappers/**/*.xml
```

- 配置了两个数据源，分配指向两个不同的数据库db_user1和db_user2。
- 配置分库策略，sex字段为偶数的数据落在m1数据源，为奇数的落在m2数据源，所以分库策略的表达式为m$->{sex % 2 + 1}。
- 配置分表策略，分表策略和上面水平分表保持一致。
- 也就是当有数据来时，先根据sex字段判断落入哪个数据源，然后再根据id字段来判断落入哪个表中。

②然后接下来就写我们的`dao`层、`mapper`层和`单元测试`的代码，去测试我们的水平分表情况下`插入`和`查询`的结果。

`dao`层

```bash
public interface UserDao {

    int insertUser(User user);

    List<User> selectUser(User user);
}
```

`mapper`层

```bash
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.yjq.programmer.dao.UserDao">

    <insert id="insertUser" parameterType="com.yjq.programmer.entity.User">
        insert into t_user(name, sex) values (#{name}, #{sex})
    </insert>


    <select id="selectUser" parameterType="com.yjq.programmer.entity.User" resultType="com.yjq.programmer.entity.User">
        select * from t_user t where t.sex = #{sex} and t.id = #{id}
    </select>
</mapper>
12345678910111213
单元测试
@Test
public void testShardingJDBCInsert() {
    User user = new User();
    for(int i=0; i<10; i++) {
        user.setName("小明" + i);
        user.setSex(1);
        if(userDao.insertUser(user) == 1) {
            logger.info("插入成功！");
        } else {
            logger.info("插入失败！");
        }
    }
}


@Test
public void testShardingJDBCSelect() {
    User user = new User();
    user.setSex(1);
    user.setId(821357967667363840L);
    List<User> userList = userDao.selectUser(user);
    logger.info("查询结果：{}", JSONObject.toJSONString(userList));
}
```

③结果说明
`插入`
sex字段为奇数的数据落入m2数据源，为偶数的落入m1数据源。同时id字段值为奇数的，插入t_user_2表中，为偶数的插入t_user_1表中，达到预期目标。
`查询`
sharding-jdbc分别去不同的表检索数据，达到预期目标；**如果有传入sex进行查询，sharding-jdbc会根据t_user的分库策略去锁定查哪个库，如果有传入id进行查询，sharding-jdbc会根据t_user的分表策略去锁定查哪个表**。

# 五、垂直分表

## 1.概念

垂直分表一般就是把表的结构进行改造，关于如何改造，可以浏览我的另一篇博客：
[分库分表：垂直分库、垂直分表、水平分库、水平分表四个概念](https://blog.csdn.net/dgfdhgghd/article/details/128426013)
**大致的思路就是：将一个表按照字段分成多表，每个表存储其中一部分字段。**

## 2.代码

无代码，垂直分表属于表结构设计层面。

# 六、垂直分库

## 1.概念

垂直分库就是在`垂直分表`把表进行分类后，放到`不同的数据库`中。每个库可以放在不同的服务器上，它的核心理念是`专库专用`。关于如何改造，同样可以浏览我的另一篇博客：
[分库分表：垂直分库、垂直分表、水平分库、水平分表四个概念](https://blog.csdn.net/dgfdhgghd/article/details/128426013)

## 2.代码

无代码，垂直分库属于数据库设计层面。

# 七、公共表

## 1.概念

公共表属于系统中数据量较小，变动少，而且属于高频联合查询的依赖表。参数表、数据字典表等属于此类型。`可以将这类表在每个数据库都保存一份`，所有更新操作都同时发送到所有分库执行。

## 2.代码

①只需要在SpringBoot的`配置文件`中加入下面这行来指明公共表就行。
`如果有多个公共表，用逗号拼接就行`

```bash
#公共表设置
spring.shardingsphere.sharding.broadcast‐tables=t_dict
12
```

②然后接下来就写我们的`dao`层、`mapper`层和`单元测试`的代码，去测试我们的公共表的`插入`的结果。
`dao`层

```bash
public interface DictDao {

    int insertDict(Dict dict);
}
```

`mapper`层

```bash
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.yjq.programmer.dao.DictDao">

    <insert id="insertDict" parameterType="com.yjq.programmer.entity.Dict">
        insert into t_dict(id, name) values (#{id}, #{name})
    </insert>
</mapper>

单元测试
@Test
public void testShardingJDBCInsertDict() {
    Dict dict = new Dict();
    dict.setId(1);
    dict.setName("字典名称");
    if(dictDao.insertDict(dict) == 1) {
        logger.info("插入成功！");
    } else {
        logger.info("插入失败！");
    }
}
```

③结果说明
`插入`
插入的数据在`每个库中的对应的公共表`中都能看到，达到预期目标。
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
