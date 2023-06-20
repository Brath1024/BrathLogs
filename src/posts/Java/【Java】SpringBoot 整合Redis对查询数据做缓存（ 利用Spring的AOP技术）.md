---
date: 2022-07-03 04:20:04

title: 【Java】SpringBoot 整合Redis对查询数据做缓存（ 利用Spring的AOP技术）
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Java】SpringBoot 整合Redis对查询数据做缓存（ 利用Spring的AOP技术）



### 本篇主要介绍 SpringBoot 整合Redis做数据缓存，利用的是 Spring[Aop](https://so.csdn.net/so/search?q=aop&spm=1001.2101.3001.7020) 切面编程技术，利用注解标识切面。



#### 这里不再介绍spring boot操作数据库，有兴趣的话，我最后会给出源码链接

# 一，引入依赖

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-redis</artifactId>
            <version>1.3.2.RELEASE</version>
        </dependency>12345678910
```

# 二，配置redis连接

配置文件我里这用的是yml格式的，tab缩进，如果是properties格式的，请自己改造
redis 安装请参考 [Redis安装](http://blog.csdn.net/mzh1992/article/details/70805823)
windows管理工具可以用RedisDesktopManager，测试的时候，可以直接删除缓存。

```yml
spring:
  redis:
    database: 0
    ## Redis服务器地址
    host: 127.0.0.1.128
    ## Redis服务器连接端口
    port: 6379
    ## Redis服务器连接密码（默认为空）
    password:
    ## 连接超时时间（毫秒）
    timeout: 0
    ## 连接池最大连接数（使用负值表示没有限制）
    pool:
      max-active: 8
      ## 连接池最大阻塞等待时间（使用负值表示没有限制）
      max-wait: -1
      ## 连接池中的最大空闲连接
      max-idle: 8
      ## 连接池中的最小空闲连接
      min-idle: 01234567891011121314151617181920
```

# 三，注解

注解 QueryCache 用来标识查询数据库的方法，参数nameSpace用来区分应用的，后面会用来添加到缓存的key中。比如，登陆应用缓存的数据key值全部都是sso开头。

```java
package com.example.common.annotation;

import com.example.common.CacheNameSpace;

import java.lang.annotation.*;

/**
 * @author Brath
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
@Documented
public @interface QueryCache {
    CacheNameSpace nameSpace();
}
```

注解 QueryCacheKey 是方法级别的注解，用来标注要查询数据的主键，会和上面的nameSpace组合做缓存的key值

```java
package com.example.common.annotation;

import java.lang.annotation.*;

/**
 * @author Brath
 */

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PARAMETER})
@Documented
public @interface QueryCacheKey {
}
```

枚举 CacheNameSpace 用来保存nameSpace的

```java
package com.example.common;

/**
 * @author Brath
 */
public enum CacheNameSpace {
    SSO_USER
}
```

下面就是组合起来的用法，userMapper.findById(id)是用来查询数据库的方法

```java
    @QueryCache(nameSpace = CacheNameSpace.SSO_USER)
    public UserInfo findUserById(@QueryCacheKey Long id) {

        UserInfo userInfo = userMapper.findById(id);

        return userInfo;
    }
```

# 四，Aop切面

下面是重点，代码中的注释已经很多了，应该能看的懂，如有问题，可以留言。

```java
package com.example.common.aspect;

import com.example.common.CacheNameSpace;
import com.example.common.annotation.QueryCache;
import com.example.common.annotation.QueryCacheKey;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.MethodParameter;
import org.springframework.core.annotation.SynthesizingMethodParameter;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.concurrent.TimeUnit;

/**
 * @author Brath
 */
@Aspect
@Service
public class DBCacheAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(DBCacheAspect.class);

    @Resource
    private RedisTemplate redisTemplate;

    /**
     * 定义拦截规则：拦截所有@QueryCache注解的方法。
     */
    /*@Pointcut("execution(* com.example.service.impl..*(..)) , @annotation(com.example.common.annotation.QueryCache)")
    public void queryCachePointcut(){}*/
    @Pointcut("@annotation(com.example.common.annotation.QueryCache)")
    public void queryCachePointcut(){}

    /**
     * 拦截器具体实现
     * @param pjp
     * @return
     * @throws Throwable
     */
    @Around("queryCachePointcut()")
    public Object Interceptor(ProceedingJoinPoint pjp) throws Throwable {
        long beginTime = System.currentTimeMillis();
        LOGGER.info("AOP 缓存切面处理 >>>> start ");
        MethodSignature signature = (MethodSignature) pjp.getSignature();
        Method method = signature.getMethod(); //获取被拦截的方法
        CacheNameSpace cacheType = method.getAnnotation(QueryCache.class).nameSpace();
        String key = null;
        int i = 0;

        // 循环所有的参数
        for (Object value : pjp.getArgs()) {
            MethodParameter methodParam = new SynthesizingMethodParameter(method, i);
            Annotation[] paramAnns = methodParam.getParameterAnnotations();

            // 循环参数上所有的注解
            for (Annotation paramAnn : paramAnns) {
                if ( paramAnn instanceof QueryCacheKey) { //
                    QueryCacheKey requestParam = (QueryCacheKey) paramAnn;
                    key = cacheType.name() + "_" + value;   // 取到QueryCacheKey的标识参数的值
                }
            }
            i++;
        }

        // 获取不到key值，抛异常
        if (StringUtils.isBlank(key)) throw new Exception("缓存key值不存在");

        LOGGER.info("获取到缓存key值 >>>> " + key);
        ValueOperations<String, Object> operations = redisTemplate.opsForValue();
        boolean hasKey = redisTemplate.hasKey(key);
        if (hasKey) {

            // 缓存中获取到数据，直接返回。
            Object object = operations.get(key);
            LOGGER.info("从缓存中获取到数据 >>>> " + object.toString());
            LOGGER.info("AOP 缓存切面处理 >>>> end 耗时：" + (System.currentTimeMillis() - beginTime));

            return object;
        }

        // 缓存中没有数据，调用原始方法查询数据库
        Object object = pjp.proceed();
        operations.set(key, object, 30, TimeUnit.MINUTES); // 设置超时时间30分钟

        LOGGER.info("DB取到数据并存入缓存 >>>> " + object.toString());
        LOGGER.info("AOP 缓存切面处理 >>>> end 耗时：" + (System.currentTimeMillis() - beginTime));
        return object;
    }


}
```

# 五，测试

```java
    @Test
    public void testFindById(){
        UserInfo userInfo = userService.findUserById(210001L);
    }
```

# 六，执行结果

![这里写图片描述](https://img-blog.csdn.net/20170504161114508?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbXpoMTk5Mg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![这里写图片描述](https://img-blog.csdn.net/20170504161129996?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbXpoMTk5Mg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

两张图对比一下很明显，从redis缓存中取数据耗时要少的多。
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
