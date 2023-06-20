---
date: 2022-01-07 00:41:39

title: SpringBoot整合knife4j框架(可生成离线接口文档)，并设置接口请求头token默认值
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# SpringBoot整合knife4j框架(可生成离线接口文档)，并设置接口请求头token默认值



功能和swagger类似

官网地址：https://doc.xiaominfo.com/knife4j/

引入依赖

```xml
<dependency>
     <groupId>com.github.xiaoymin</groupId>
     <artifactId>knife4j-spring-boot-starter</artifactId>
     <version>2.0.7</version>
</dependency>
```

Knife4jConfig .java

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.Parameter;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2; import java.util.ArrayList;
import java.util.List; /**
 * @author yvioo。
 */
@Configuration
@EnableSwagger2  //开启Swagger2
public class Knife4jConfig {     /**
     * 配置Swagger的Docket的bean实例
     * @return
     */
    @Bean
    public Docket docket(Environment environment) {         //设置只在开发中环境中启动swagger
        Profiles profiles=Profiles.of("dev");         //表示如果现在是dev环境，则返回true 开启swagger
        boolean flag=environment.acceptsProfiles(profiles);         /*添加接口请求头参数配置 没有的话 可以忽略*/
        ParameterBuilder tokenPar = new ParameterBuilder();
        List<Parameter> pars = new ArrayList<>();
        tokenPar.name("token").description("令牌").defaultValue("设置token默认值").modelRef(new ModelRef("string")).parameterType("header").required(false).build();
        pars.add(tokenPar.build());         return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                //是否启动swagger 默认启动
                .enable(flag)
                //所在分组
                .groupName("yvioo")
                .select()
                //指定扫描的包路径
                .apis(RequestHandlerSelectors.basePackage("com.example.demo.controller"))
                //指定扫描的请求，这里表示扫描 /hello/ 的请求
                //.paths(PathSelectors.ant("/hello/**"))
                .build()
                .globalOperationParameters(pars);
    }     /**
     * 配置ApiInfo信息
     * @return
     */
    private ApiInfo apiInfo() {         //作者信息
        Contact author = new Contact("yvioo", "https://www.cnblogs.com/pxblog/", "111@qq.com");         return new ApiInfo(
                "Knife4j测试",
                "Knife4j描述",
                "1.0",
                "urn:tos",
                author,
                "Apache 2.0",
                "http://www.apache.org/licenses/LICENSE-2.0",
                new ArrayList()
        );     }
}
```

控制器的写法和swagger基本类似

```java
@Api(tags = "首页模块")
@RestController
public class IndexController {     @ApiImplicitParam(name = "name",value = "姓名",required = true)
    @ApiOperation(value = "向客人问好")
    @GetMapping("/sayHi")
    public ResponseEntity<String> sayHi(@RequestParam(value = "name")String name){
        return ResponseEntity.ok("Hi:"+name);
    }
}
```

但是如果有其他配置继承了 WebMvcConfigurationSupport 就需要增加资源映射 不然会失效

```java
@Configuration
public class WebMvcConfigurer extends WebMvcConfigurationSupport {     /**
     * 发现如果继承了WebMvcConfigurationSupport， 需要重新指定静态资源
     *
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations(
                "classpath:/static/");
        registry.addResourceHandler("doc.html").addResourceLocations(
                "classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations(
                "classpath:/META-INF/resources/webjars/");
        super.addResourceHandlers(registry);
    }
}
```

效果





![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/1092624-20210531140148243-852424753.png)



离线接口文档

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/1092624-20210531141839463-1322211712.png)

浏览器访问

使用dev环境 启动项目后 浏览器打开http://localhost:8081/doc.html#/  我这里用的端口是8081

整合swagger框架参考：https://www.cnblogs.com/pxblog/p/12942825.html

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
