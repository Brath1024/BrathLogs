---
date: 2021-02-04 00:20:23

title: 【Redis】SpringBoot整合Redis，缓存批量删除  redisTemplate.keys(pattern)模糊查询找不到keys，“  “ 通配符无效
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Redis】SpringBoot整合Redis，缓存批量删除  redisTemplate.keys(pattern)模糊查询找不到keys，“  “ 通配符无效



### 引言

最近，在学习 Spring Boot 整合 Redis 的知识，在业务中需要删除某个前缀的所有[Redis缓存](https://so.csdn.net/so/search?q=Redis缓存&spm=1001.2101.3001.7020)，首先使用 **RedisTemplate.keys() 模糊查询**出所有合适的 keys，再使用 [redisTemplate](https://so.csdn.net/so/search?q=redisTemplate&spm=1001.2101.3001.7020).delete() 方法进行批量删除。参考代码：

```java
Set<String> keys = redisTemplate.keys(prefix + "*");
redisTemplate.delete(pageKeys);
```

然而，发现 redisTemplate.keys( prefix + "*" ) 模糊查询，总是返回一个空的集合，找不到 key。

在日志中打印查询的 keys 集合，一直为空集合：

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/e157868f134c4420b9989e3d3e41365a.png)

### **1、问题分析：**

首先，确保查询字符串正确。

然后，尝试 redisTemplate.keys( key ) ，用完整的一个 key 进行查询，发现能正常返回只有一个 key 的集合。

说明模糊查询 的 通配符 **" \* "** 没有发挥作用，可能只是被当作一个普通的字符了。

### **2、问题解决：**

为 redis 添加配置文件 RedisConfig，重新定义 RedisTemplate 的 key 为 String 类型：

```java
@Configuration
public class RedisConfig {

    @Bean(name = "redisTemplate")
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory){
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        StringRedisSerializer redisSerializer = new StringRedisSerializer();
        // key采用String的序列化方式
        redisTemplate.setKeySerializer(redisSerializer);
        // hash的key也采用String的序列化方式
        redisTemplate.setHashKeySerializer(redisSerializer);
        return redisTemplate;
    }
}
```

再次测试 redisTemplate.keys( prefix + "*" ) 模糊查询，可以正常返回缓存中的 keys 集合！！！
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
