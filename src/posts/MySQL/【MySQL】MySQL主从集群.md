---
date: 2020-12-20 08:42:43

title: MySQL主从集群搭建文档，实现读写分离
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



## MySQL主从集群搭建文档，实现读写分离



​		最近在自己写的项目中需要应对大量的用户查询读写操作，一台服务器当然是不够的，所以在边学边敲的背景下，记录这篇笔记，从0开始搭建主从集群。

#### 下面👇开始操作：

1.分别在两台服务器搭建mysql服务

​		两台服务器的IP地址分别为主服务器（192.168.20.1）和从服务器（192.168.20.2）。
2.配置文件my.cnf的修改

```shell
#根据上一篇文章，编辑my.cnf文件
[root@localhost mysql]# vim /etc/my.cnf
 
#在[mysqld]中添加：
server-id=1
log_bin=master-bin
log_bin_index=master-bin.index
binlog_do_db=test
#备注：
#server-id 服务器唯一标识。
#log_bin 启动MySQL二进制日志，即数据同步语句，从数据库会一条一条的执行这些语句。
#binlog_do_db 指定记录二进制日志的数据库，即需要复制的数据库名，如果复制多个数据库，重复设置这个选项即可。
#binlog_ignore_db 指定不记录二进制日志的数据库，即不需要复制的数据库名，如果有多个数据库，重复设置这个选项即可。
#其中需要注意的是，binlog_do_db和binlog_ignore_db为互斥选项，一般只需要一个即可。
```

3.创建从服务器的用户和权限

```shell
#进入mysql数据库
[root@localhost mysql]# mysql -uroot -p
Enter password:

#创建从数据库的root用户和权限
mysql> grant replication slave on *.* to root@'192.168.20.%' identified by 'Lgq081538';

grant replication slave on *.* to '123456'
#备注
#192.168.20.%通配符，表示0-255的IP都可访问主服务器，正式环境请配置指定从服务器IP
#若将 192.168.20.% 改为 %，则任何ip均可作为其从数据库来访问主服务器

#退出mysql
mysql> exit;
```

4.重启mysql服务

```shell
[root@localhost mysql]# service mysql restart
Shutting down MySQL.... SUCCESS! 
Starting MySQL. SUCCESS! 
```

5.查看主服务器状态

```shell
#进入mysql数据库
[root@localhost mysql]# mysql -uroot -p
Enter password:

#查看主服务器状态
mysql> show master status;
+-------------------+----------+--------------+------------------+-------------------+
| File              | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+-------------------+----------+--------------+------------------+-------------------+
| master-bin.000001 |      154 | test         |                  |                   |
+-------------------+----------+--------------+------------------+-------------------+
1 row in set (0.00 sec)
```

6.slave从服务器的配置

```shell
配置文件my.cnf的修改
#根据上一篇文章，编辑my.cnf文件
[root@localhost mysql]# vim /etc/my.cnf

#在[mysqld]中添加：
server-id=2
relay-log=slave-relay-bin
relay-log-index=slave-relay-bin.index
#replicate-do-db=test
#备注：
#server-id 服务器唯一标识，如果有多个从服务器，每个服务器的server-id不能重复，跟IP一样是唯一标识，如果你没设置server-id或者设置为0，则从服务器不会连接到主服务器。
#relay-log 启动MySQL二进制日志，可以用来做数据备份和崩溃恢复，或主服务器挂掉了，将此从服务器作为其他从服务器的主服务器。
#replicate-do-db 指定同步的数据库，如果复制多个数据库，重复设置这个选项即可。若在master端不指定binlog-do-db，则在slave端可用replication-do-db来过滤。
#replicate-ignore-db 不需要同步的数据库，如果有多个数据库，重复设置这个选项即可。
#其中需要注意的是，replicate-do-db和replicate-ignore-db为互斥选项，一般只需要一个即可。
```

7.重启mysql服务

```shell
[root@localhost mysql]# service mysql restart
Shutting down MySQL.... SUCCESS! 
Starting MySQL. SUCCESS! 
```

8.连接master主服务器

```shell
#进入mysql数据库
[root@localhost mysql]# mysql -uroot -p
Enter password:

#连接master主服务器
mysql> change master to master_host='192.168.20.1',master_port=3306,master_user='root',master_password='123456',master_log_file='master-bin.000009',master_log_pos=473127;

#备注：
#master_host对应主服务器的IP地址。
#master_port对应主服务器的端口。
#master_log_file对应show master status显示的File列：master-bin.000001。
#master_log_pos对应show master status显示的Position列：154。
```

9.启动slave数据同步

```shell
#启动slave数据同步
mysql> start slave;
#停止slave数据同步（若有需要）
mysql> stop slave;
3.5 查看slave信息
mysql> show slave status\G;
Slave_IO_Running和Slave_SQL_Running都为yes，则表示同步成功。
```

10.测试

```shell
（1）在主服务器上登陆mysql，且进入test数据库，创建test表，且插入一条数据
提示：这里最好用数据库管理工具（如nacicat）来操作。
#创建tb_test表
create table tb_test(ID varchar(36) primary key comment '主键ID',MEMO varchar(500) not null comment '信息');
#插入一条数据
insert into tb_test(ID,MEMO) values('1','one test');
#提交
commit;
（2）在从服务器上登陆mysql，且进入test数据库
你会发现从数据库中，也出现了tb_test表，且表中还有one test数据存在，证明同步数据成功。
```



### 至此Mysql主从读写分离搭建完成



下面开始搭建Spring Boot项目中的相关配置以及实现👇

​		读写分离要做的事情就是对于一条SQL该选择哪个数据库去执行，至于谁来做选择数据库这件事，主要有两种实现方式，分别为：
1.使用中间件，比如Atlas，cobar，TDDL，mycat，heisenberg，Oceanus，vitess，OneProxy等
2.使用程序自己实现，利用Spring Boot提供的路由数据源以及AOP，实现起来简单快捷
​		

​		我们使用第二种方式Spring Boot数据源路由+AOP ，这样能更好的控制流程，也便于后期提升性能；

代码实现
1.首先配置下pom.[xml](https://so.csdn.net/so/search?q=xml&spm=1001.2101.3001.7020) 因为我们使用 aop实现，所以需要aop依赖

```xml
<dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

2.数据源路由类功能RoutingDataSource.java

```java
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * @Auther: Brath
 * Create By Administrator on 2022/6/24 12:05
 * Strive to create higher performance code
 * @My wechat: 17604868415
 * @My QQ: 2634490675
 * @My email 1: email_ guoqing@163.com
 * 数据源路由类功能
 */
public class RoutingDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return DBContext.get();
    }
}
```

3.数据源上下文类DBContext.java

```java
import lombok.extern.slf4j.Slf4j;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @Auther: Brath
 * Create By Administrator on 2022/6/24 12:05
 * Strive to create higher performance code
 * @My wechat: 17604868415
 * @My QQ: 2634490675
 * @My email 1: email_ guoqing@163.com
 * 数据源上下文类
 */
@Slf4j
public class DBContext {
    private static final ThreadLocal<DBTypeEnum> dbContext = new ThreadLocal<>();

    private static final AtomicInteger counter = new AtomicInteger(-1);

    public static void set(DBTypeEnum dbType) {
        dbContext.set(dbType);
    }

    public static DBTypeEnum get() {
        return dbContext.get();
    }

    public static void master() {
        set(DBTypeEnum.MASTER);
        log.info("切换到master库");
    }

    public static void slave() {
        //  读库负载均衡(轮询方式)
        int index = counter.getAndIncrement() % 2;
        log.info("slave库访问线程数==>{}", counter.get());
        if (index == 0) {
            set(DBTypeEnum.SLAVE1);
            log.info("切换到slave1库");
        } else {
            set(DBTypeEnum.SLAVE2);
            log.info("切换到slave2库");
        }
    }
}
```

4.数据库枚举类DBTypeEnum.java

```java
package com.example.demo.databases;

/**
 * @Auther: Brath
 * Create By Administrator on 2022/6/24 12:05
 * Strive to create higher performance code
 * @My wechat: 17604868415
 * @My QQ: 2634490675
 * @My email 1: email_ guoqing@163.com
 * 数据库枚举类
 */
public enum DBTypeEnum {
    MASTER, //主库
    SLAVE1, //从库1
    SLAVE2  //从库2
}

```

这里我们配置三个库，分别是一个写库Master，2个读库slave1,slave2

```java
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

/**
 * @Auther: Brath
 * Create By Administrator on 2022/6/24 12:05
 * Strive to create higher performance code
 * @My wechat: 17604868415
 * @My QQ: 2634490675
 * @My email 1: email_ guoqing@163.com
 * 数据库配置类
 */
@Configuration
public class DataSourceConfigs {

    @Bean
    @ConfigurationProperties("spring.datasource.master")
    public DataSource masterDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    @ConfigurationProperties("spring.datasource.slave1")
    public DataSource slave1DataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    @ConfigurationProperties("spring.datasource.slave2")
    public DataSource slave2DataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    public DataSource myRoutingDataSource(@Qualifier("masterDataSource") DataSource masterDataSource,
                                          @Qualifier("slave1DataSource") DataSource slave1DataSource,
                                          @Qualifier("slave2DataSource") DataSource slave2DataSource) {
        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put(DBTypeEnum.MASTER, masterDataSource);
        targetDataSources.put(DBTypeEnum.SLAVE1, slave1DataSource);
        targetDataSources.put(DBTypeEnum.SLAVE2, slave2DataSource);
        RoutingDataSource routingDataSource = new RoutingDataSource();
        routingDataSource.setDefaultTargetDataSource(masterDataSource);
        routingDataSource.setTargetDataSources(targetDataSources);
        return routingDataSource;
    }
}
```

6.切面类DataSourceAop.java

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * @Auther: Brath
 * Create By Administrator on 2022/6/24 12:05
 * Strive to create higher performance code
 * @My wechat: 17604868415
 * @My QQ: 2634490675
 * @My email 1: email_ guoqing@163.com
 * 切面类DataSourceAop
 */
@Aspect
@Component
public class DataSourceAop {
    @Pointcut("@annotation(com.example.demo.databases.Master) " +
            "|| execution(* com.example.demo.*.service..*.insert*(..)) " +
            "|| execution(* com.example.demo.*.service..*.create*(..)) " +
            "|| execution(* com.example.demo.*.service..*.save*(..)) " +
            "|| execution(* com.example.demo.*.service..*.add*(..)) " +
            "|| execution(* com.example.demo.*.service..*.update*(..)) " +
            "|| execution(* com.example.demo.*.service..*.edit*(..)) " +
            "|| execution(* com.example.demo.*.service..*.delete*(..)) " +
            "|| execution(* com.example.demo.*.service..*.remove*(..))")
    public void writePointcut() {

    }

    @Pointcut("!@annotation(com.example.demo.databases.Master) " +
            "&& (execution(* com.example.demo.*.service..*.select*(..)) " +
            "|| execution(* com.example.demo.*.service..*.list*(..))" +
            "|| execution(* com.example.demo.*.service..*.count*(..))" +
            "|| execution(* com.example.demo.*.service..*.get*(..)))"

    )
    public void readPointcut() {

    }

    @Before("writePointcut()")
    public void write() {
        DBContext.master();
    }

    @Before("readPointcut()")
    public void read() {
        DBContext.slave();
    }
}

```

7.注解类Master.java

```java
package com.example.demo.databases;

/**
 * @Auther: Brath
 * Create By Administrator on 2022/6/24 12:05
 * Strive to create higher performance code
 * @My wechat: 17604868415
 * @My QQ: 2634490675
 * @My email 1: email_ guoqing@163.com
 * 注解类Master 主库，可读写
 */
public @interface Master {
}

```

































## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
