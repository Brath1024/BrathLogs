---
date: 2021-06-16 07:57:34

title: Linux以及Windows部署Seata服务
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



   1.确保linux有Nacos正常启动，并知晓正确的端口 用户名 密码

2. https://github.com/seata/seata.git 克隆seata项目到本地
3. 在Github下载对应你项目SpringCloudAlibaba建议版本的Seata，我的版本是2.5.5，建议Seata版本1.3.0
4. 下载好后进入seata/conf 配置目录，修改file.conf

```json

## transaction log store, only used in seata-server
store {
  ## store mode: file、db、redis
  mode = "db" #如果单机：file 如果是集群：db  并在下方配置你的Mysql数据源

  ## file store property
  file {
    ## store location dir
    dir = "sessionStore"
    # branch session size , if exceeded first try compress lockkey, still exceeded throws exceptions
    maxBranchSessionSize = 16384
    # globe session size , if exceeded throws exceptions
    maxGlobalSessionSize = 512
    # file buffer size , if exceeded allocate new buffer
    fileWriteBufferCacheSize = 16384
    # when recover batch read size
    sessionReloadReadSize = 100
    # async, sync
    flushDiskMode = async
  }

  ## database store property
  db {
    ## the implement of javax.sql.DataSource, such as DruidDataSource(druid)/BasicDataSource(dbcp)/HikariDataSource(hikari) etc.
    datasource = "druid"
    ## mysql/oracle/postgresql/h2/oceanbase etc.
    dbType = "mysql"
    driverClassName = "com.mysql.jdbc.Driver"
    url = "jdbc:mysql://sh-cynosdbmysql-grp-o5n8fbw2.sql.tencentcdb.com:20345/seata_server"
    user = "brath"
    password = "Lgq081538"
    minConn = 5
    maxConn = 30
    globalTable = "global_table"
    branchTable = "branch_table"
    lockTable = "lock_table"
    queryLimit = 100
    maxWait = 5000
  }

}
```

5.修改registry.conf

```json
registry {
  type = "nacos"  //配置nacos

  nacos {
    application = "seata-server"
    serverAddr = "nacosip+端口" //nacosip+端口
    group = "SEATA_GROUP"
    namespace = "命名空间" //如果默认可以不填
    cluster = "default" //如果是集群请填写集群名
    username = "账号"
    password = "密码"
  }
  file {
    name = "file.conf"
  }
}

config {
  type = "nacos"

  nacos {
    serverAddr = "nacosip+端口" //nacosip+端口
    namespace = "命名空间" //如果默认可以不填
    group = "SEATA_GROUP"
    username = "账号"
    password = "密码"
  }
  
  file {
    name = "file.conf"
  }
}

```

6.在克隆好的项目中找到 script/confing-center 找到config.txt文件

修改

```
 store.mode=db
```

修改数据源

```
store.db.url=localhost:3306/seata_server?useUnicode=true&rewriteBatchedStatements=true
store.db.user=****
store.db.password=****
```

进入 script\config-center\nacos

如果是windows系统请确保安装了GIT 以及 GIT bash

点击nacos-config.sh 会自动把config.txt配置文件，配置到你的Nacos客户端中指定命名空间的配置中心供你的Seata使用

7.进入Seata/bin 

```shell
sh seata-server.sh #启动seata服务
```

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
