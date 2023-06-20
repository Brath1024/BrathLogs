---
date: 2022-02-02 15:16:03

title: Knife4J接口文档
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)





Swagger2 及knife4j使用

最近项目中用到了 Swagger2 和knife4j作为接口文档。所以自己简单搭建了一套环境学习下，总体体验下来，这个框架很方便也很简单易用。

Swagger2 和 Swagger-ui
springFox官方推荐的是Swagger2 和 Swagger-ui配套使用

maven依赖
    <dependencies>
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
            <version>2.9.2</version>
        </dependency>
    <!--生成UI界面-->
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger-ui</artifactId>
        <version>2.9.2</version>
    </dependency>
    </dependencies>

增加配置文件
@Configuration
@EnableSwagger2
public class Swagger2 {

    @Bean
    public Docket controllerApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(new ApiInfoBuilder()
                        .title("文档说明--API接口文档")
                        .description("包括保存、查询等")
                        .version("版本号:1.0")
                        .build())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.example.myswagger.controller"))
                .paths(PathSelectors.any()) // 如果适配所有api，可以改为PathSelectors.any()
                .build();
    }

API接口增加swagger注解
@Controller
@RequestMapping
@Api(tags = "接口服务")
public class HelloController {

    @ApiOperation("根目录")
    @GetMapping("/")
    @ResponseBody
    public  String hello(){
        System.out.println("23123");
        return "hello";
    }


    @ApiOperation("保存用户信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "name", value = "名字", required = true, paramType = "path"),
            @ApiImplicitParam(name = "age", dataType = "int", value = "年龄", required = true, paramType = "query")
    })
    @PostMapping("/save")
    @ResponseBody
    public Boolean save(
            @RequestParam("name") String name,
            @RequestParam("age") Integer age
    ) {
        return true;
    }


效果展示
启动项目访问

http://localhost:8080/swagger-ui.html

测试接口：


项目地址
https://gitee.com/LylYorick/myswagger

swagger注解详解
@Api：用在请求的类上，表示对类的说明
    tags="说明该类的作用，可以在UI界面上看到的注解"
    value="该参数没什么意义，在UI界面上也看到，所以不需要配置"

@ApiOperation：用在请求的方法上，说明方法的用途、作用
    value="说明方法的用途、作用"
    notes="方法的备注说明"

@ApiImplicitParams：用在请求的方法上，表示一组参数说明
    @ApiImplicitParam：用在@ApiImplicitParams注解中，指定一个请求参数的各个方面
        name：参数名
        value：参数的汉字说明、解释
        required：参数是否必须传
        paramType：参数放在哪个地方
            · header --> 请求参数的获取：@RequestHeader
            · query --> 请求参数的获取：@RequestParam
            · path（用于restful接口）--> 请求参数的获取：@PathVariable
            · body（不常用）
            · form（不常用）    
        dataType：参数类型，默认String，其它值dataType="Integer"       
        defaultValue：参数的默认值

@ApiResponses：用在请求的方法上，表示一组响应
    @ApiResponse：用在@ApiResponses中，一般用于表达一个错误的响应信息
        code：数字，例如400
        message：信息，例如"请求参数没填好"
        response：抛出异常的类

@ApiModel：用于响应类上，表示一个返回响应数据的信息
            （这种一般用在post创建的时候，使用@RequestBody这样的场景，
            请求参数无法使用@ApiImplicitParam注解进行描述的时候）
    @ApiModelProperty：用在属性上，描述响应类的属性
Swagger2 和 knife4j
虽然Swagger-ui很好，但是国人还是开发了一个 knife4j的的swaggerui，更加好看和方便使用

maven依赖

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-spring-boot-starter</artifactId>
    <version>2.0.8</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.10.5</version>
</dependency>
```


增加配置类
@Configuration
@EnableSwagger2WebMvc
public class Knife4jConfiguration {

    @Bean(value = "defaultApi2")
    public Docket defaultApi2() {
        Docket docket=new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(new ApiInfoBuilder()
                        //.title("swagger-bootstrap-ui-demo RESTful APIs")
                        .description("# swagger-bootstrap-ui-demo RESTful APIs")
                        .termsOfServiceUrl("http://www.xx.com/")
                        .contact("xx@qq.com")
                        .version("1.0")
                        .build())
                //分组名称
                .groupName("2.X版本")
                .select()
                //这里指定Controller扫描包路径
                .apis(RequestHandlerSelectors.basePackage("com.example.myswaggerknife4j.controller"))
                .paths(PathSelectors.any())
                .build();
        return docket;
    }

API接口增加swagger注解
@Controller
public class HelloController {


    @PostMapping("/save")
    @ResponseBody
    public Boolean save(
            @RequestParam("name") String name,
            @RequestParam("age") Integer age
    ) {
        return true;
    }

效果展示
访问 http://localhost:8080/doc.html

项目地址
https://gitee.com/LylYorick/my-swagger-knife4j
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
