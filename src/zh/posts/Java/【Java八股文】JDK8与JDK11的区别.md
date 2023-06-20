---
date: 2023-04-27 16:40:25

title: 【Java八股文】JDK8与JDK11的区别
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【Java八股文】JDK8与JDK11的区别

### 文章目录

- [前言](#_5)
- [一、Java8的新特性](#Java8_11)
- - - [Lambda 表达式](#Lambda__12)
    - [方法引用](#_14)
    - [函数式接口实例](#_16)
    - [Java 8 默认方法](#Java_8__18)
    - [Stream](#Stream_20)
    - [Optional 类](#Optional__22)
    - [Nashorn JavaScript](#Nashorn_JavaScript_24)
    - [日期时间 API](#_API_26)
    - [Base64](#Base64_36)
- [二、Java11的新特性](#Java11_46)
- - - [ZGC](#ZGC_48)
    - [Flight Recorder（JFR）](#Flight_RecorderJFR_50)
    - [Low-Overhead Heap Profiling](#LowOverhead_Heap_Profiling_53)
    - [HTTP/2 Client API](#HTTP2_Client_API_55)
    - [Transport Layer Security (TLS) 1.3](#Transport_Layer_Security_TLS_13_57)
    - [Improve Aarch64 Intrinsics](#Improve_Aarch64_Intrinsics_61)
    - [Epsilon: A No-Op Garbage Collector(Experimental)](#Epsilon_A_NoOp_Garbage_CollectorExperimental_63)
    - [Launch Single-File Source-Code Programs](#Launch_SingleFile_SourceCode_Programs_65)
    - [Unicode 10](#Unicode_10_67)
    - [Nest-Based Access Control](#NestBased_Access_Control_69)
    - [Dynamic Class-File Constants](#Dynamic_ClassFile_Constants_71)
    - [Remove the Java EE and CORBA Modules](#Remove_the_Java_EE_and_CORBA_Modules_73)
    - [Deprecate the Nashorn JavaScript Engine](#Deprecate_the_Nashorn_JavaScript_Engine_75)
    - [Deprecate the Pack200 Tools and API](#Deprecate_the_Pack200_Tools_and_API_77)
- [总结](#_80)



------

# 前言

目前市场上主流的稳定版主要是Java 8和Java 11。

------

# 一、Java8的新特性

### [Lambda](https://so.csdn.net/so/search?q=Lambda&spm=1001.2101.3001.7020) 表达式

Lambda 表达式，也可称为闭包，它是推动 Java 8 发布的最重要新特性，Lambda 允许把函数作为一个方法的参数（函数作为参数传递进方法中），使用Lambda 表达式可以使代码变的更加简洁紧凑。

### 方法引用

方法引用通过方法的名字来指向一个方法，方法引用可以使语言的构造更紧凑简洁，减少冗余代码，方法引用使用一对冒号 :: 。

### [函数式接口](https://so.csdn.net/so/search?q=函数式接口&spm=1001.2101.3001.7020)实例

Predicate 接口是一个函数式接口，它接受一个输入参数 T，返回一个布尔值结果。该接口包含多种默认方法来将Predicate组合成其他复杂的逻辑（比如：与，或，非）。该接口用于测试对象是 true 或 false。

### Java 8 默认方法

Java 8 新增了接口的默认方法。简单说，默认方法就是接口可以有实现方法，而且不需要实现类去实现其方法。我们只需在方法名前面加个default关键字即可实现默认方法。

### [Stream](https://so.csdn.net/so/search?q=Stream&spm=1001.2101.3001.7020)

Stream使用一种类似用SQL语句从数据库查询数据的直观方式来提供一种对Java集合运算和表达的高阶抽象。Stream API可以极大提高Java程序员的生产力，让程序员写出高效率、干净、简洁的代码。这种风格将要处理的元素集合看作一种流，流在管道中传输，并且可以在管道的节点上进行处理，比如筛选，排序，聚合等。元素流在管道中经过中间操作（intermediate operation）的处理，最后由最终操作(terminal operation)得到前面处理的结果。

### Optional 类

Optional 类是一个可以为null的容器对象。如果值存在则isPresent()方法会返回true，调用get()方法会返回该对象。Optional 是个容器：它可以保存类型T的值，或者仅仅保存null。Optional提供很多有用的方法，这样我们就不用显式进行空值检测。Optional 类的引入很好的解决空指针异常。

### Nashorn JavaScript

Nashorn 一个 javascript 引擎。从JDK1.8开始，Nashorn取代Rhino(JDK 1.6, JDK1.7)成为Java的嵌入式JavaScript引擎。Nashorn完全支持ECMAScript 5.1规范以及一些扩展。它使用基于JSR292的新语言特性，其中包含在JDK 7中引入的 invokedynamic，将JavaScript编译成Java字节码。与先前的Rhino实现相比，这带来了2到10倍的性能提升。

### 日期时间 API

Java 8通过发布新的Date-Time API (JSR 310)来进一步加强对日期与时间的处理。
在旧版的Java 中，日期时间API 存在诸多问题，其中有：

1. 非线程安全 − java.util.Date 是非线程安全的，所有的日期类都是可变的，这是Java日期类最大的问题之一。
2. 设计很差 − Java的日期/时间类的定义并不一致，在java.util和java.sql的包中都有日期类，此外用于格式化和解析的类在java.text包中定义。java.util.Date同时包含日期和时间，而java.sql.Date仅包含日期，将其纳入java.sql包并不合理。另外这两个类都有相同的名字，这本身就是一个非常糟糕的设计。
3. 时区处理麻烦 − 日期类并不提供国际化，没有时区支持，因此Java引入了java.util.Calendar和java.util.TimeZone类，但他们同样存在上述所有的问题。
   Java 8 在 java.time 包下提供了很多新的 API。以下为两个比较重要的 API：
4. Local(本地) − 简化了日期时间的处理，没有时区的问题。
5. Zoned(时区) − 通过制定的时区处理日期时间。
   新的java.time包涵盖了所有处理日期，时间，日期/时间，时区，时刻（instants），过程（during）与时钟（clock）的操作。

### [Base64](https://so.csdn.net/so/search?q=Base64&spm=1001.2101.3001.7020)

在Java8中，Base64编码已经成为Java类库的标准。
Java 8 内置了 Base64 编码的编码器和解码器。
Base64工具类提供了一套静态方法获取下面三种BASE64编解码器：

1. 基本：输出被映射到一组字符A-Za-z0-9+/，编码不添加任何行标，输出的解码仅支持A-Za-z0-9+/。
2. URL：输出映射到一组字符A-Za-z0-9+_，输出是URL和文件。
3. MIME：输出隐射到MIME友好格式。输出每行不超过76字符，并且使用’\r’并跟随’\n’作为分割。编码输出最后没有行分割。

# 二、Java11的新特性

### ZGC

JDK11 引入了两种新的 GC，其中包括也许是划时代意义的 ZGC，虽然其目前还是实验特性，但是从能力上来看，这是 JDK 的一个巨大突破，为特定生产环境的苛刻需求提供了一个可能的选择。例如，对部分企业核心存储等产品，如果能够保证不超过 10ms 的 GC 暂停，可靠性会上一个大的台阶，这是过去我们进行 GC 调优几乎做不到的，是能与不能的问题。对于 G1 GC，相比于 JDK 8，升级到 JDK 11 即可享受到：并行的 Full GC，快速的 CardTable 扫描，自适应的堆占用比例调整（IHOP），在并发标记阶段的类型卸载等等。这些都是针对 G1 的不断增强，其中串行 Full GC 等甚至是曾经被广泛诟病的短板，你会发现 GC 配置和调优在 JDK11 中越来越方便。

### Flight Recorder（JFR）

Flight Recorder（JFR）是 Oracle 刚刚开源的强大特性。JFR 是一套集成进入 JDK、JVM 内部的事件机制框架，通过良好架构和设计的框架，硬件层面的极致优化，生产环境的广泛验证，它可以做到极致的可靠和低开销。在 SPECjbb2015 等基准测试中，JFR 的性能开销最大不超过 1%，所以，工程师可以基本没有心理负担地在大规模分布式的生产系统使用，这意味着，我们既可以随时主动开启 JFR 进行特定诊断，也可以让系统长期运行 JFR，用以在复杂环境中进行“After-the-fact”分析。
在保证低开销的基础上，JFR 提供的能力可以应用在对锁竞争、阻塞、延迟，JVM GC、SafePoint 等领域，进行非常细粒度分析。甚至深入 JIT Compiler 内部，全面把握热点方法、内联、逆优化等等。JFR 提供了标准的 Java、C++ 等扩展 API，可以与各种层面的应用进行定制、集成，为复杂的企业应用栈或者复杂的分布式应用，提供 All-in-One 解决方案。而这一切都是内建在 JDK 和 JVM 内部的，并不需要额外的依赖，开箱即用。

### Low-Overhead Heap Profiling

它来源于 Google 等业界前沿厂商的一线实践，通过获取对象分配细节，为 JDK 补足了对象分配诊断方面的一些短板，工程师可以通过 JVMTI 使用这个能力增强自身的工具。

### HTTP/2 Client API

新的 HTTP API 提供了对 HTTP/2 等业界前沿标准的支持，精简而又友好的 API 接口，与主流开源 API（如，Apache HttpClient， Jetty， OkHttp 等）对等甚至更高的性能。与此同时它是 JDK 在 Reactive-Stream 方面的第一个生产实践，广泛使用了 Java Flow API 等，终于让 Java 标准 HTTP 类库在扩展能力等方面，满足了现代互联网的需求。

### Transport [Layer](https://so.csdn.net/so/search?q=Layer&spm=1001.2101.3001.7020) Security (TLS) 1.3

就是安全类库、标准等方面的大范围升级，它还是中国安全专家范学雷所领导的 JDK 项目，完全不同于以往的修修补补，是个非常大规模的工程。
Dynamic Class-File Constants
动态 class 文件常量。扩展了 Java class 文件格式，支持一种新的常量池形式：CONSTANT_Dynamic。

### Improve Aarch64 Intrinsics

主要是针对 ARM Aarch64 架构的优化，比如提供优化的 sin、cos 等函数。

### Epsilon: A No-Op Garbage Collector(Experimental)

无操作的垃圾收集器。Epsilon 是一个特殊的垃圾收集器，只处理内存分配，不负责回收。一旦堆耗尽，就关闭 JVM。听上去这个收集器好像没什么意义。不过它还是有不少用处的。比如：性能测试。GC 会影响性能，有了这么一个几乎什么都不干的 GC，我们可以过滤掉 GC 带来的影响因素。还有些性能因素不是 GC 引入的，比如编译器变换，利用 Epsilon GC，我们可以对比。就像生物学里做实验，我们可以用它做一个对照组。另外还有内存压力测试、VM接口测试等。

### Launch Single-File Source-Code Programs

支持运行单个文件中的源代码。在刚学习 Java 或者编写小的工具程序时，我们一般要先用 javac 编译源文件，再用 java 命令运行。有了这个功能，我们可以直接用 java 命令运行源程序。

### Unicode 10

升级现有 API 支持 Unicode 10。Java SE 10 实现的是 Unicode 8.0。与 Java 10 相比，Java 11 多支持 16 018 个新字符，10 种新的文字类型。

### Nest-Based Access Control

基于嵌套的访问控制。Java 11 引入了 nest 的概念，这是一个新的访问控制上下文（context），逻辑上处于同一代码实体中的类，尽管会被编译为不同的 class 文件，但是可以访问彼此的 private 成员，不再需要编译器插入辅助访问的桥方法。

### Dynamic Class-File Constants

动态 class 文件常量。扩展了 Java class 文件格式，支持一种新的常量池形式：CONSTANT_Dynamic。

### Remove the Java EE and CORBA Modules

将 Java SE 9 中标记为废弃的 Java EE 和 CORBA 正式从 Java SE 平台中删除。

### Deprecate the Nashorn JavaScript Engine

废弃 Nashorn JavaScript 脚本引擎、API 和 jjs 工具。Nashorn 是在 JDK 8 中引入的，当时完整实现了 ECMAScript-262 5.1。不过随着 ECMAScript 的演进加快，Nashorn 维护越来越困难。

### Deprecate the Pack200 Tools and API

废弃了 pack200 和 unpack200 工具，以及 java.util.jar 包中的 Pack200 API。

# 总结

1. G1 GC平均速度通过Java 8切换到 Java 11 就有 16％ 的改进，但是大部分项目都用不到，一些高实时性的游戏可以用；
2. Java 11支持源文件直接运行；
3. 已完成项目不建议升级jdk11，或者新项目需要依赖现有代码，不建议升级jdk11，因为升级版本涉及到大量的旧代码移植，代码重写，架构重构，全量测试；
4. 如果jdk8满足开发需求,并且需依赖现有以JDK8开发的代码，建议还是以jdk8进行开发，否则如果选用jdk11可能面临旧代码重写，架构重构，以及一些不知道的隐形依赖；
5. 系统追求的是稳定并非技术，jdk8已被广泛验证非常稳定，而且目前主流开发版本确实也是8，技术还是要服务于业务，稳定大于一切；
6. 从jdk8往上升级会出现一些jar依赖的改变，模块化带来的反射问题，classload的变化导致某些问题；
7. Spring，Spring Boot，Spring Cloud，Dubbo，Guava，Jackson，Tomcat，JUnit等等项目都适配了JDK11，并且经历了生产环境的检验，才可以考虑是否将JDK8换成JDK11；
8. 8之后，商用收费

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！