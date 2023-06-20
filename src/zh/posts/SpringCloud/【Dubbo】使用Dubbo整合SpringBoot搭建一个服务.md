---
date: 2023-04-26 12:58:33

title: 【Dubbo】使用Dubbo整合SpringBoot搭建一个服务
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【Dubbo】使用Dubbo整合SpringBoot搭建一个服务

### 文章目录

- [开发前提](#_1)
- [构建Springboot项目](#Springboot_3)
- [开发api模块](#api_101)
- [开发生产者模块](#_145)
- - [第一步：导入依赖](#_147)
  - [第二步：添加配置](#_234)
  - [第三步：编写启动类](#_274)
  - [第四步：添加mapper接口](#mapper_301)
  - [第五步：实现接口：](#_330)
  - [第六步：编写controller层接口](#controller_359)
- [开发消费者模块](#_389)
- - [第一步：导入依赖](#_390)
  - [第二步：添加配置](#_433)
  - [第三步：编写启动类：](#_451)
  - [第四步：编写调用生产者接口](#_471)
- [测试](#_505)



# 开发前提

由于dubbo的注册中心用的是zookeeper，所以首先需要[安装zookeeper](https://blog.csdn.net/xzkwuli/article/details/120077241)。

# 构建Springboot项目

第一步：选择新建project或者module，在界面中选择maven点击next:
![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/9d940f3148f2466e8baaf9e1ca0ee2da.jpeg)

第二步：填上项目的基本信息点击Finish：

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/0b67f36ca88c4c39a359cc8702ead495.jpeg)

第三步：右击项目new -> Module:

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/96b98e7493684f6982c64e242049a21c.jpeg)

第四步：在界面中选择maven点击next:

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/8c10cd3965b542bfa3e5a9208359ea6a.jpeg)

第五步：填上项目的基本信息点击Finish：

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/ab0158e03109413bb7ad0267943b386d.jpeg)

第六步：重复第三，四，五步，分别创建项目需要的dubbo-api,dubbo-provider,dubbo-customer几个模块，如下：

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/9739ea601cbf4730b9a1430e6edfdf44.jpeg)

第七步：导入父工程依赖：

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.demo</groupId>
    <artifactId>dubbo-demo</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>
    <modules>
        <module>dubbo-provider</module>
        <module>dubbo-customer</module>
        <module>dubbo-api</module>
    </modules>

    <properties>
        <java.version>1.8</java.version>
        <source.level>1.8</source.level>
        <target.level>1.8</target.level>
        <lombok.version>1.18.16</lombok.version>
        <skip_maven_deploy>true</skip_maven_deploy>
        <spring-boot-dependencies.version>2.4.1</spring-boot-dependencies.version>
        <spring-cloud-dependencies.version>Dalston.SR4</spring-cloud-dependencies.version>
        <junit.version>4.12</junit.version>
        <dubbo.version>3.0.2.1</dubbo.version>
        <spring-dubbo.version>2.0.0</spring-dubbo.version>
        <lombok.version>1.18.16</lombok.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- 统一jar版本管理，避免使用 spring-boot-parent -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot-dependencies.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.apache.dubbo</groupId>
                <artifactId>dubbo-bom</artifactId>
                <version>${dubbo.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!--dubbo 和  springboot 整合的包-->
            <dependency>
                <groupId>org.apache.dubbo</groupId>
                <artifactId>dubbo-spring-boot-starter</artifactId>
                <version>${dubbo.version}</version>
            </dependency>

            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
                <scope>compile</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```

# 开发api模块

user实体类：

```java
package com.demo.api.entity;


import lombok.Data;

import java.io.Serializable;

/**
 * @Author: laz
 * @CreateTime: 2022-10-26  10:56
 * @Version: 1.0
 */
@Data
public class User implements Serializable {
    

    private Long id;

    private String username;

    private String password;

}
```

创建本次测试的接口：

```java
package com.demo.api.service;

import com.demo.api.entity.User;

public interface IUserService {

    User selectUserById(Long id);
}
```

# 开发生产者模块

## 第一步：导入依赖

```java
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>dubbo-demo</artifactId>
        <groupId>com.demo</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>dubbo-provider</artifactId>
    <dependencies>
        <dependency>
            <groupId>com.demo</groupId>
            <artifactId>dubbo-api</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>

        <!--dubbo 与 spring-boot 整合包-->
        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-spring-boot-starter</artifactId>
        </dependency>
        <!--springboot 启动核心包-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <!--springboot rest -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-registry-zookeeper</artifactId>
        </dependency>

        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>1.3.0</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>1.3.1</version>
        </dependency>

        <!--mysql  的驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>


    <build>
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.yml</include>
                    <include>**/*.xml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>
</project>
```

## 第二步：添加配置

```yaml
server:
  port: 8081

spring:
  application:
    name: dubbo-samples-privider-springCloud
    #配置数据源信息
  datasource:
    #配置连接数据库的各个信息
    driver-class-name: com.mysql.cj.jdbc.Driver
    #设置字符集
    url: jdbc:mysql://8.142.127.37:3306/test?useSSL=false&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&transformedBitIsBoolean=true&serverTimezone=GMT%2B8&nullCatalogMeansCurrent=true&allowPublicKeyRetrieval=true
    username: root
    password: 123456


mybatis-plus:
  #配置类型别名所对应的包
  type-aliases-package: com.demo.provider.entity
  #配置SQL输出语句com.winsun.dataclean.mapper
  mapper-locations: com/demo/provider/mapper/*.xml


dubbo:
  application:
    name: ${spring.application.name}
  registry:
    address: zookeeper://43.139.86.193:2181
    timeout: 2000
  protocol:
    name: dubbo
    port: 20890
  # 扫描 @DubboService 注解
  scan:
    base-packages: com.demo.provider.service.impl
```

## 第三步：编写启动类

```java
package com.demo.provider;

import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @Author: laz
 * @CreateTime: 2022-10-26  11:05
 * @Version: 1.0
 */
@EnableDubbo
@SpringBootApplication
@MapperScan("com.demo.provider.mapper")
public class ProviderApp {

    public static void main(String[] args) {
        SpringApplication.run(ProviderApp.class,args);
        System.out.println("生产者启动完毕");
    }
}
```

## 第四步：添加mapper接口

```java
package com.demo.provider.mapper;

import com.demo.api.entity.User;

/**
 * @Author: laz
 * @CreateTime: 2022-10-26  11:01
 * @Version: 1.0
 */
public interface UserMapper {

    User selectUserById(Long id);
}
```

**xml:**

```java
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.demo.provider.mapper.UserMapper">
    <select id="selectUserById" resultType="com.demo.api.entity.User">
        select * from user where id = #{id}
    </select>
</mapper>
```

## 第五步：实现接口：

```java
package com.demo.provider.service.impl;

import com.demo.api.entity.User;
import com.demo.api.service.IUserService;
import com.demo.provider.mapper.UserMapper;
import lombok.AllArgsConstructor;
import org.apache.dubbo.config.annotation.DubboService;

/**
 * @Author: laz
 * @CreateTime: 2022-10-26  11:00
 * @Version: 1.0
 */
@DubboService
@AllArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserMapper userMapper;

    public User selectUserById(Long id) {
        User user = userMapper.selectUserById(id);
        return user;
    }
}
```

## 第六步：编写[controller层](https://so.csdn.net/so/search?q=controller层&spm=1001.2101.3001.7020)接口

```java
 package com.demo.provider.controller;

import com.demo.api.entity.User;
import com.demo.api.service.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: laz
 * @CreateTime: 2022-10-26  11:53
 * @Version: 1.0
 */
@RestController
@RequestMapping("/provider")
@AllArgsConstructor
public class UserController {

    private final IUserService userService;

    @RequestMapping("/selectUserById/{id}")
    public User selectUserById(@PathVariable("id")Long id){
        return userService.selectUserById(id);
    }
}
```

# 开发消费者模块

## 第一步：导入依赖

```java
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>dubbo-demo</artifactId>
        <groupId>com.demo</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>dubbo-customer</artifactId>
    <dependencies>
        <!--dubbo-samples-springcloud-api 项目 依赖-->
        <dependency>
            <groupId>com.demo</groupId>
            <artifactId>dubbo-api</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-registry-zookeeper</artifactId>
        </dependency>
    </dependencies>

</project>
```

## 第二步：添加配置

```java
server:
  port: 8082

spring:
  application:
    name: dubbo-samples-consumer-springCloud

dubbo:
  registry:
    address: zookeeper://43.139.86.193:2181
    timeout: 2000
  protocol:
    name: dubbo
```

## 第三步：编写启动类：

```java
package com.demo.customer;

import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDubbo
public class ConsumerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class, args);
        System.out.println("消费者启动完毕!");
    }
}
```

## 第四步：编写调用生产者接口

```java
package com.demo.customer.controller;

import com.demo.api.entity.User;
import com.demo.api.service.IUserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/consumer")
@Slf4j
public class ConsumerUserController {

    @DubboReference( protocol = "dubbo", loadbalance = "random")
    private IUserService userService;

    @RequestMapping("/selectUserById/{id}")
    public User getUser(@PathVariable("id") Long id) {
        User user = userService.selectUserById(id);
        log.info("response from provider: {}", user);
        return user;
    }
}
```

**整个项目结构如下：**

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/f302fc0e1073496084b5288ab609d158.jpeg)

# 测试

分别启动生产者和消费者，在浏览器分别调用以下接口：

```
http://localhost:8081/provider/selectUserById/1`
`http://localhost:8082/consumer/selectUserById/1
```

**结果：**
![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/6bc844eb01ac4dfc9aa12b8c6ef6d622.jpeg)



## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！