---
date: 2022-06-05 13:37:11

title: RequestParam 和 PathVariable的区别
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



RequestParam 和 PathVariable 注解是用于从request中接收请求的，两个都可以接收参数，关键点不同的是RequestParam 是从request里面拿取值，而 PathVariable 是从一个URI模板里面来填充

PathVariable
主要用于接收http://host:port/path/{参数值}数据:

http://localhost:8887/test1/id1/name1

根据上面的这个url，你可以用这样的方式来进行获取:

    RequestMapping("test1/{id}/{name}")
    public String testPathVariable(PathVariable String id, PathVariable String name) {
        return "id=" + id + ", name=" + name;
    }
    PathVariable 支持下面三种参数：
name 绑定本次参数的名称，要跟URL上面的一样
required 这个参数是否必须的
value 跟name一样的作用，是name属性的一个别名
RequestParam
主要用于接收http://host:port/path?参数名=参数值数据，这里后面也可以不跟参数值；

http://localhost:8887/test2?id=id2&name=name2

根据上面的这个url，你可以用这样的方式来进行获取:

    RequestMapping("test2")
    public String testRequestParam(RequestParam("id") String id, RequestParam("name") String name) {
        return "id=" + id + ", name=" + name;
    }
    RequestParam 支持下面四种参数：
defaultValue 如果本次请求没有携带这个参数，或者参数为空，那么就会启用默认值
name 绑定本次参数的名称，要跟URL上面的一样
required 这个参数是否必须的
value 跟name一样的作用，是name属性的一个别名
PathVariable和RequestParam混合使用
http://localhost:8887/test3/id3?name=name3

根据上面的这个url，你可以用这样的方式来进行获取:

    RequestMapping("test3/{id}")
    public String test3(PathVariable String id, RequestParam("name") String name) {
        return "id=" + id + ", name=" + name;
    }
    对比
    1.用法上的不同：
    PathVariable只能用于接收url路径上的参数，而RequestParam只能用于接收请求带的params
    2.内部参数不同：
    PathVariable有value，name，required这三个参数，而RequestParam也有这三个参数，并且比PathVariable多一个参数defaultValue（该参数用于当请求体中不包含对应的参数变量时，参数变量使用defaultValue指定的默认值）
    3.PathVariable一般用于get和delete请求，RequestParam一般用于post请求。
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
