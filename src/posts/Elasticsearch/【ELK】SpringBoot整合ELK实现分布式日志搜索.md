---
date: 2022-07-17 13:00:43

title: 【ELK】SpringBoot整合ELK实现分布式日志搜索
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【ELK】SpringBoot整合ELK实现分布式日志搜索



# 一.环境准备：

### 安装[ElasticSearch](https://so.csdn.net/so/search?q=ElasticSearch&spm=1001.2101.3001.7020)、Kibana、LogStash。

docker内，下载需要的镜像。然后启动一个镜像。

### 1.Es创建

**创建并运行一个ElasticSearch容器：**

```shell
#7.6.2 启动需要增加discovery.type=single-node
docker run -e ES_JAVA_OPTS="-Xms256m -Xmx256m" -e discovery.type=single-node  -d -p 9200:9200 -p 9300:9300 --name MyES elasticsearch:7.6.2
```

> **浏览器访问测试：http://127.0.0.1:9200，应输出如下结果：**

```json
{
    "name": "WQawbNC",
    "cluster_name": "docker-cluster",
    "cluster_uuid": "f6QviESlT_e5u3kaZFHoWA",
    "version": {
        "number": "7.6.2",
        "build_flavor": "default",
        "build_type": "docker",
        "build_hash": "2f4c224",
        "build_date": "2020-03-18T23:22:18.622755Z",
        "build_snapshot": false,
        "lucene_version": "7.7.2",
        "minimum_wire_compatibility_version": "5.6.0",
        "minimum_index_compatibility_version": "5.0.0"
    },
    "tagline": "You Know, for Search"
}
```



## 2.Kibana创建

**创建并运行运行一个Kibana容器：**
创建之前，先查看ES在docker中的ip地址，因为我们的[kibana](https://so.csdn.net/so/search?q=kibana&spm=1001.2101.3001.7020)在启动的时候需要连接到ES。

```shell
#先使用命令 docker ps 查看ES容器ID
docker ps
#输出如下:
CONTAINER ID   IMAGE                   COMMAND      CREATED        STATUS        PORTS      NAMES
a266d1ff5c1b  elasticsearch:7.6.2   "/usr/local/bin/dock…"   19 hours ago   Up 18 hours   0.0.0.0:9200->9200/tcp, 0.0.0.0:9300->9300/tcp   MyES

#通过容器ID，查看容器IP地址。以上的a266d1ff5c1b就是我们ES的容器ID
docker inspect --format '{{ .NetworkSettings.IPAddress }}' a266d1ff5c1b
#输出如下:
172.17.0.3
```

**得到了ES容器IP地址之后，创建并运行一个Kibana容器。**

```shell
#注意，此处的ELASTICSEARCH_URL需替换成上面ES容器的IP地址，否则Kibana连接不到ES
docker run -d --name MyKibana -p 5601:5601 -e ELASTICSEARCH_URL=http://172.17.0.3:9200 kibana:7.6.2
```

> **浏览器访问测试：http://127.0.0.1:5601：**

![image.png](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/2584c6896d84d3290cc097f47766912c.png)



## 3.LogStash创建

**创建并运行运行一个LogStash容器：**

```shell
docker run -d -p 9600:9600 -p 4560:4560 --name MyLogStash logstash:7.6.2
```

运行后，进入容器内部。修改logstash.yml配置文件：

```shell
docker exec -it 容器ID bash
```

```shell
cd config
```

```shell
vi logstash.yml
```

```shell
# 改成如下配置
http.host: "0.0.0.0"
xpack.monitoring.elasticsearch.hosts: [ "http://esIP地址:9200" ]
xpack.monitoring.elasticsearch.username: elastic
xpack.monitoring.elasticsearch.password: your password
```

修改 pipeline 下的 logstash.conf 文件

```
input {
  tcp {
    #模式选择为server
    mode => "server"
    #ip和端口对应docker对外暴露logstash的地址可以使用下面命令查看
    #docker inspect logstash | grep IPAddress
    host => "172.17.0.3"
    port => 4560
    codec => json_lines
  }
}
output {
  elasticsearch {
        action => "index"
    #这里是es的地址，多个es要写成数组的形式
    hosts  => "http://你的esIP:9200"
    user => elastic #如果es配置了账号密码，要配置账号密码
    password => password #如果es配置了账号密码，要配置账号密码
    manage_template => true
    #用于kibana过滤，可以填项目名称 必须必须必须小写。
    index  => "demologs"
  }
}

```

最后重启我们的logstash

```shell
docker restart MyLogStash
```



# 二、 使ELK与SpringBoot集成

maven相关依赖：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.2</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.elk</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
        <ch.qos.logback.version>1.2.3</ch.qos.logback.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-core</artifactId>
            <version>${ch.qos.logback.version}</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>${ch.qos.logback.version}</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-access</artifactId>
            <version>${ch.qos.logback.version}</version>
        </dependency>
        <dependency>
        <groupId>net.logstash.logback</groupId>
        <artifactId>logstash-logback-encoder</artifactId>
        <version>5.1</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

logback配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false" scan="true" scanPeriod="1 seconds">
    <include resource="org/springframework/boot/logging/logback/base.xml" />
    <contextName>logback</contextName>

    <appender name="stash" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>你的LogStashIP地址:4560</destination>
        <!-- encoder必须配置,有多种可选 -->
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LogstashEncoder" />
    </appender>

    <root level="info">
        <appender-ref ref="stash" />
    </root>
</configuration>
```

日志记录：

```java
@RestController
@RequestMapping("/test")
public class ElkController {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @RequestMapping("/test")
    public String elkAdd(){
        logger.info("日志记录"+System.currentTimeMillis());
        return "1";
    }
}
```



在Kibana中查看创建索引及查看日志：
![image.png](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/2e66ba8d0e361daf4654481b328828bb.png)

![image.png](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/937b6241405ccbedc5aca43fc79fdbbc.png)



#### 可以看到我们的elk已经走通了，后面就可以根据自己的实际业务需求去进行修改配置。



## 总结

本次通过docker搭建elk+springboot的过程还是花费了不少的时间的，还是有所收获的。碰到问题的话尽量去百度查资料，耐心点基本上都是可以解决的。有感兴趣的小伙伴可以一起交流学习呀。
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
