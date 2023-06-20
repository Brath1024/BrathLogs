---
date: 2021-04-02 06:45:39

title: Redis与Mysql | Master与Slave同步：canal教学
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)





## 前言：

​		作者最近在做自己的项目，使用到Redis，需要热更新，修改Mysql后同步Redis缓存，出于对圈子的贡献，也较于当前的canal的博客大多数不是很详细，所以写下这篇文章，时间是2022年6月29日。目的是帮助更多的人，希望能为在祖国的经济发展作出小小的贡献。

​		end

#### 学习Canal基本需要：

​	Linux服务器，性能无大要求

​	Java基础

​	Mysql，Redis基础



### 俗话说，要了解一个东西，先了解他的由来：

## 一、Canal起源

​		阿里巴巴因为业务特性，买家集中在国外，衍生出了杭州美国异地数据同步需求，从2010年开始，阿里巴巴开始开发canal，canal是基于Java开发的数据库增量日志解析，提供增量数据订阅&消费的中间件。Canal主要支持了Mysql和Bilog解析，解析完成后利用canal Client来处理获取相关数据。



了解完canal的起源，再来看看canal的核心业务依赖，也就是mysql的二进制日志：binary_log 简称：Binlog

## 二、Binlog

​		binlog指二进制日志，它记录了数据库上的所有改变，并以二进制的形式保存在磁盘中，它可以用来查看数据库的变更历史、数据库增量备份和恢复、MySQL的复制（主从数据库的复制）。

#### binlog有三种格式：

statement：基于SQL语句的复制（statement-based replication，SBR）
row：基于行的复制（row-based replication，RBR）
mixed：混合模式复制（mixed-based replication，MBR）

#### statement：语句级别

每一条会修改数据的sql都会记录在binlog中。

​		优点：不需要记录每一行的变化，减少了binlog日志量，节约了IO，提高性能。但是注意statement相比于row能节约多少性能与日志量，取决于应用的SQL情况。正常同一条记录修改或者插入row格式所产生的日志量还小于Statement产生的日志量，但是考虑到如果带条件的update操作，以及整表删除，alter表等操作，ROW格式会产生大量日志，因此在考虑是否使用ROW格式日志时应该跟据应用的实际情况，其所产生的日志量会增加多少，以及带来的IO性能问题。

​		缺点：由于记录的只是执行语句，为了这些语句在slave上正确运行，我们还必须记录每条语句在执行时候的一些相关信息，以保证所有语句能在slave得到和在master端执行时相同的结果。另外，一些特定的函数功能如果要在slave和master上保持一致会有很多相关问题。

#### row：行数据级别

5.1.5版本的MySQL才开始支持row level的复制，它不记录sql语句上下文相关信息，仅保存哪条记录被修改。

​		优点：binlog中可以不记录执行的sql语句的上下文相关的信息，仅需要记录那一条记录被修改成什么了。所以row level的日志会非常清楚的记下每一行数据修改的细节。而且不会出现某些特定情况下的存储过程，或function，以及trigger的调用和触发无法被正确复制的问题。

​		缺点：所有的执行的语句当记录到日志中的时候，都将以每行记录的修改来记录，这样可能会产生大量的日志内容。但是新版本的MySQL对row level模式进行了优化，并不是所有的修改都会以row level来记录，像遇到表结构变更的时候就会以statement模式来记录，如果sql语句确实就是update或者delete等修改数据的语句，那么还是会记录所有行的变更。

#### mixed：混合级别

从5.1.8版本开始，MySQL提供了Mixed格式，实际上就是Statement与Row的结合。

​		在Mixed模式下，一般的语句修改使用statment格式保存binlog，如果一些函数，statement无法完成主从复制的操作，则采用row格式保存binlog，MySQL会根据执行的每一条具体的sql语句来区分对待记录的日志形式，也就是在Statement和Row之间选择一种。



##### 		由于 statement 和 mixed 的特殊性，通过sql来备份，总会有数据不一致的情况，比如：now()函数。

##### 		所以绝大多数场景下使用 Row级别，也就是行级别，这样保证我们备份的数据和出口的数据相一致。



### 三、下载和安装Canal工具

下载前，在mysql创建canal用户，因为canal服务端需要连接mysql数据库

```bash
-- 使用命令登录：mysql -u root -p
-- 创建用户 用户名：canal 密码：Canal@123456
create user 'canal'@'%' identified by 'Canal@123456';
-- 授权 *.*表示所有库
grant SELECT, REPLICATION SLAVE, REPLICATION CLIENT on *.* to 'canal'@'%' identified by 'Canal@123456';
```

#### 改了配置文件之后，重启MySQL，使用命令查看是否打开binlog模式：

![在这里插入图片描述](https://brath.cloud/blogImg/20200808151606261.png)

#### 查看binlog日志文件列表：

![在这里插入图片描述](https://brath.cloud/blogImg/20200808151715291.png)



### 点此下载Canal👇

https://ghproxy.com/https://github.com/alibaba/canal/releases/download/canal-1.1.2/canal.deployer-1.1.2.tar.gz

此链接为github代理提供连接，仅供参考，此处无广告意义。



![image-20220629152616754](https://brath.cloud/blogImg/image-20220629152616754.png)



下载好后上传至linux服务器，创建canal文件夹并解压到canal文件夹中



![image-20220629153150741](https://brath.cloud/blogImg/image-20220629153150741.png)

完成后会得到以上四个核心文件：bin，conf，lib，logs

需要修改一处配置文件：

​		/canal/conf/example 下的 instance.properties

![image-20220629153511220](https://brath.cloud/blogImg/image-20220629153511220.png)

修改完成后保存退出

接下来进入bin目录 sh startUp.sh 启动 canal 服务端

#### 至此服务端的操作基本完成



Java客户端操作
首先引入maven依赖：

```xml
<dependency>
    <groupId>com.alibaba.otter</groupId>
    <artifactId>canal.client</artifactId>
    <version>1.1.2</version>
</dependency>
```

然后创建一个canal项目，使用SpringBoot构建，如图所示，创建canal包：

![image-20220629153956493](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20220629153956493.png)



canal工具类，仅供参考

```java
package cn.brath.canal;
import java.awt.print.Printable;
import java.time.LocalDateTime;

import cn.brath.common.redis.service.TokenService;
import cn.brath.common.redis.util.RedisKeys;
import cn.brath.common.utils.AssertUtil;
import cn.brath.common.utils.UserTokenManager;
import cn.brath.entity.IvUser;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.otter.canal.client.CanalConnector;
import com.alibaba.otter.canal.client.CanalConnectors;
import com.alibaba.otter.canal.protocol.CanalEntry.*;
import com.alibaba.otter.canal.protocol.Message;
import com.google.protobuf.InvalidProtocolBufferException;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.print.attribute.standard.MediaPrintableArea;
import java.net.InetSocketAddress;
import java.time.ZoneId;
import java.util.List;

@Component
@Data
public class CanalClient {

    /**
     * SLF4J日志
     */
    private static Logger logger = LoggerFactory.getLogger(CanalClient.class);

    private String host = "***.***.***.***";

    private String port = "11111";

    private String destination = "example";

    /**
     * 用户令牌业务接口
     */
    private static TokenService tokenService;

    @Autowired
    public void TokenServiceIn(TokenService tokenService) {
        CanalClient.tokenService = tokenService;
    }

    /**
     * canal启动方法
     */
    public void run() {
        if (!AssertUtil.isEmptys(host, port, destination)) {
            logger.error("canal客户端连接失败，当前服务端host：{}，port：{}，destination：{}", host, port, destination);
            return;
        }
        CanalConnector connector = CanalConnectors.newSingleConnector(
                new InetSocketAddress(host, Integer.valueOf(port)), destination, "", ""
        );
        int batchSize = 1000;
        try {
            //建立连接
            connector.connect();
            //目标为全部表
            connector.subscribe(".*\\..*");
            connector.rollback();
            logger.info("canal客户端连接完成，当前服务端host：{}，port：{}，destination：{}", host, port, destination);
            try {
                while (true) {
                    //尝试从master那边拉去数据batchSize条记录，有多少取多少
                    Message message = connector.getWithoutAck(batchSize);
                    long batchId = message.getId();
                    int size = message.getEntries().size();
                    if (batchId == -1 || size == 0) {
                        Thread.sleep(1000);
                    } else {
                        logger.info("同步任务进行中，检测到修改数据，执行同步Redis");
                        dataHandle(message.getEntries());
                    }
                    connector.ack(batchId);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (InvalidProtocolBufferException e) {
                e.printStackTrace();
            }
        } finally {
            connector.disconnect();
        }
    }

    /**
     * 数据处理
     *
     * @param entrys
     */
    private void dataHandle(List<Entry> entrys) throws InvalidProtocolBufferException {
        JSONObject beforeData = null;
        JSONObject afterData = null;
        for (Entry entry : entrys) {
            if (EntryType.ROWDATA.equals(entry.getEntryType())) {
                //反序列化rowdata
                RowChange rowChange = RowChange.parseFrom(entry.getStoreValue());
                //获取数据集
                List<RowData> rowDataList = rowChange.getRowDatasList();
                //获取数据遍历
                for (RowData rowData : rowDataList) {
                    afterData = new JSONObject();
                    List<Column> afterColumnsList = rowData.getAfterColumnsList();
                    for (Column column : afterColumnsList) {
                        afterData.put(column.getName(), column.getValue());
                    }
                }
                
                //因为作者这里只做同步Redis，不考虑到操作类型，只需要覆盖相同键值数据
                
                //写入Redis
                executeRedisWarehousing(afterData);
            }
        }
    }

    /**
     * 执行Redis用户数据入库
     *
     * @param afterData
     */
    public static void executeRedisWarehousing(JSONObject afterData) {
        logger.info("开始执行Redis热更新入库同步Mysql -- ");
		
        do...
        
        logger.info("入库完成");
    }

}

```



### 启动类使用：

```java
@SpringBootApplication
@Slf4j
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(InterviewUserServiceApplication.class, args);
        //项目启动，执行canal客户端监听
        try {
            new CanalClient().run();
        } catch (Exception e) {
            e.printStackTrace();
            log.error(" canal客户端监听 启动失败，原因可能是：{}", e.getMessage());
        }
    }
}

```





接下来启动项目运行，成功连接canal后我们尝试修改一个mysql的数据，发现在客户端成功完成了与Redis的同步操作

![image-20220629154454409](https://brath.cloud/blogImg/image-20220629154454409.png)









### 相关异常：

Canal异常：

dump address /124.222.106.122:3306 has an error, retrying. caused by java.la

解决办法：重启Mysql，删除example下的 dat 后缀文件后重启canal

其他：

​	是否开放端口 11111 

​	mysql是否连接成功，查看logs/example/example.log

​	服务端与客户端是否连接成功，查看当前项目日志即可





## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
