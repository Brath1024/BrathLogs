---
date: 2022-08-08 20:29:38

title: RocketMQ - 十年双十一并发神器，最好的消息队列 Linux下安装与部署&SpringBoot简单应用
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



## RocketMQ 4.4.0 下载

作者已经在自己的服务器挂载了RocketMQ 4.4.0 的安装包和控制台，点击链接下载

rocketMQ 4.4.0 安装包http://124.222.229.230:8080/rocketmq-all-4.4.0-bin-release.zip

rocketMQ 控制台 安装包http://124.222.229.230:8080/rocketmq-externals-rocketmq-console-1.0.0.zip

在使用前如果整合微服务，请注意SpringCloudAliabba与各组件之间的版本对应关系

![image-20220630110604813](https://brath.cloud/blogImg/image-20220630110604813.png)

作者使用SpringCloudAlibaba 2.2.5 RELEASE 版本，所以对应使用RocketMQ 4.4.0 版本



将下载好的安装包上传至Linux服务器

![image-20220701120747236](https://brath.cloud/blogImg/image-20220701120747236.png)



将压缩包解压至创建好的rocketMQ文件夹下

```
unzip rocketmq-all-4.4.0-bin-release.zip rocketMQ
```



按照官网流程，启动nameServer，brokerServer服务

### 启动nameServer 

```shell
#启动服务
nohup ./mqnamesrv -n 124.222.229.230:9876 &
#查看日志
tail -f ~/logs/rocketmqlogs/namesrv.log
```

### 启动brokerServer 

```shell
#启动服务
nohup ./mqbroker -n 124.222.229.230:9876 -c ../conf/broker.conf autoCreateTopicEnable=true &
#查看日志
tail -f ~/logs/rocketmqlogs/broker.log
```

### 发送消息测试

```shell
sh bin/tools.sh org.apache.rocketmq.example.quickstart.Producer
```

#### 消费消息测试

```shell
sh bin/tools.sh org.apache.rocketmq.example.quickstart.Consumer
```





## SpringBoot整合

pom.xml 添加

```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-spring-boot</artifactId>
    <version>2.0.4</version>
    <scope>compile</scope>
</dependency>
```



### 封装工具：

```java
package cn.brath.common.rocketmq;

import org.apache.rocketmq.client.producer.SendCallback;
import org.apache.rocketmq.client.producer.SendResult;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

/**
 * @Auther: Brath
 * Create By Administrator on 2022/3/31 13:59
 * Strive to create higher performance code
 * @My wechat: 17604868415
 * @My QQ: 2634490675
 * @My email 1: email_ guoqing@163.com
 * @My email 2: enjoy_ light_ sports@163.com
 * @PPseudonym: enjoy sports nutrition
 * @Program body: enjoy notes
 */
@Component
public class RocketMQUtil {

    /**
     * SLF4J日志
     */
    private static final Logger logger = LoggerFactory.getLogger(RocketMQUtil.class);

    /**
     * rocketmq模板注入
     */
    @Autowired
    private RocketMQTemplate rocketMQTemplate;

    @PostConstruct
    public void init() {
        logger.info("---RocketMq工具初始化---");
    }

    /**
     * 发送异步消息
     *
     * @param topic   消息Topic
     * @param message 消息实体
     */
    public void asyncSend(Enum topic, Message<?> message) {
        asyncSend(topic.name(), message, getDefaultSendCallBack());
    }


    /**
     * 发送异步消息
     *
     * @param topic        消息Topic
     * @param message      消息实体
     * @param sendCallback 回调函数
     */
    public void asyncSend(Enum topic, Message<?> message, SendCallback sendCallback) {
        asyncSend(topic.name(), message, sendCallback);
    }

    /**
     * 发送异步消息
     *
     * @param topic   消息Topic
     * @param message 消息实体
     */
    public void asyncSend(String topic, Message<?> message) {
        rocketMQTemplate.asyncSend(topic, message, getDefaultSendCallBack());
    }

    /**
     * 发送异步消息
     *
     * @param topic        消息Topic
     * @param message      消息实体
     * @param sendCallback 回调函数
     */
    public void asyncSend(String topic, Message<?> message, SendCallback sendCallback) {
        rocketMQTemplate.asyncSend(topic, message, sendCallback);
    }

    /**
     * 发送异步消息
     *
     * @param topic        消息Topic
     * @param message      消息实体
     * @param sendCallback 回调函数
     * @param timeout      超时时间
     */
    public void asyncSend(String topic, Message<?> message, SendCallback sendCallback, long timeout) {
        rocketMQTemplate.asyncSend(topic, message, sendCallback, timeout);
    }

    /**
     * 发送异步消息
     *
     * @param topic        消息Topic
     * @param message      消息实体
     * @param sendCallback 回调函数
     * @param timeout      超时时间
     * @param delayLevel   延迟消息的级别
     */
    public void asyncSend(String topic, Message<?> message, SendCallback sendCallback, long timeout, int delayLevel) {
        rocketMQTemplate.asyncSend(topic, message, sendCallback, timeout, delayLevel);
    }

    /**
     * 发送顺序消息
     *
     * @param message
     * @param topic
     * @param hashKey
     */
    public void syncSendOrderly(Enum topic, Message<?> message, String hashKey) {
        syncSendOrderly(topic.name(), message, hashKey);
    }


    /**
     * 发送顺序消息
     *
     * @param message
     * @param topic
     * @param hashKey
     */
    public void syncSendOrderly(String topic, Message<?> message, String hashKey) {
        logger.info("发送顺序消息，topic:" + topic + ",hashKey:" + hashKey);
        rocketMQTemplate.syncSendOrderly(topic, message, hashKey);
    }

    /**
     * 发送顺序消息
     *
     * @param message
     * @param topic
     * @param hashKey
     * @param timeout
     */
    public void syncSendOrderly(String topic, Message<?> message, String hashKey, long timeout) {
        logger.info("发送顺序消息，topic:" + topic + ",hashKey:" + hashKey + ",timeout:" + timeout);
        rocketMQTemplate.syncSendOrderly(topic, message, hashKey, timeout);
    }

    /**
     * 默认CallBack函数
     *
     * @return
     */
    private SendCallback getDefaultSendCallBack() {
        return new SendCallback() {
            @Override
            public void onSuccess(SendResult sendResult) {
                logger.info("---发送MQ成功---");
            }

            @Override
            public void onException(Throwable throwable) {
                throwable.printStackTrace();
                logger.error("---发送MQ失败---"+throwable.getMessage(), throwable.getMessage());
            }
        };
    }


    @PreDestroy
    public void destroy() {
        logger.info("---RocketMq工具注销---");
    }

}

```



测试发送消息

```java
@Autowired
    private RocketMqUtil rocketMqutil;

    @Test
    public void Producter() {
        User user = new User();
        user.setName("brath");
        user.setAge(10);
        rocketMqHelper.asyncSend("REGIST_USER", MessageBuilder.withPayload(user).build());
       
}
```



测试消费消息

```java
package com.hyh.core.listener;

import com.hyh.core.po.Person;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.stereotype.Component;

/**
 * @Auther: Brath
 * Create By Administrator on 2022/3/31 13:59
 * Strive to create higher performance code
 * @My wechat: 17604868415
 * @My QQ: 2634490675
 * @My email 1: email_ guoqing@163.com
 * @My email 2: enjoy_ light_ sports@163.com
 * @PPseudonym: enjoy sports nutrition
 * @Program body: enjoy notes
 */
@Component
@RocketMQMessageListener(consumerGroup = "${rocketmq.producer.groupName}", topic = "REGIST_USER")
public class PersonMqListener implements RocketMQListener<Person> {
    @Override
    public void onMessage(User user) {
        System.out.println("接收到消息，开始消费..name:" + user.getName() + ",age:" + user.getAge());
    }
}
```

















```
IvUserloginLog
IvUserOperateLog
```

























## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
