---
date: 2021-06-11 11:15:38

title: JVM学习记录
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



#### JVM位置：在操作系统之上运行，操作系统在硬件之上运行

JDK（JRE（JVM））: JDK包含了JRE，JRE包含了JVM

#### JVM体系结构：

![JVM底层结构画图（精细）](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/JVM%E5%BA%95%E5%B1%82%E7%BB%93%E6%9E%84%E7%94%BB%E5%9B%BE%EF%BC%88%E7%B2%BE%E7%BB%86%EF%BC%89.jpg)

Java File 

=> Class File 

=> Class Loader SubSystem {

1 . Loading : [1 . ApplicationClassLoader   2 . ExtClassLoader  3 . BootStrapClassLoader]

2 . Linking : [1. Verify  2.Prepare  3. Resolve ] 

3 . Initialization

} 

=> RuntimeData Areas ：(1,2) : Memory sharing，(3,4,5) : Memory is not shared{

1 . Method Area 

2 . Heap Area  {                      }

3 . Stack Area   { 

T1 [1. Thread  2. Stack Frame ]  

T2 [1. Thread  2. Stack Frame ]

}

4 . Native MethodStack Area    --> JNI 

5 . Program Counter Register [PC Registers for Thread]

 }

=> Execution Engine { 

1 . interpreter  

2 . JIT Compiler  {

Intermediate Code Generator 

=> Code Optimizer

=> Target Code Generator

}

3 . Profiler  

4 . Garbage Collection 

}

=> Java Native Method Interface （JNI）

=> Native Method Library 



#### 类加载器： ClassLoader SubSystem : 类加载器子系统 运行时在堆中运行 不运行时是独立子系统

application ClassLoader 应用程序加载器  主要负责加载应用程序的主函数类

Ext ClassLoader 扩展加载器  主要负责加载jre/lib/ext目录下的一些扩展的jar。

BootStrap ClassLoader 根类加载器  主要负责加载核心的类库(java.lang.*等)

加载过程：class File => Loading 加载 => Linking （验证，准备，解析） 链接 => Initialization 初始化



#### 双亲委派机制

![img](https://img-blog.csdnimg.cn/20201217213314510.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2NvZGV5YW5iYW8=,size_16,color_FFFFFF,t_70)

从上图中我们就更容易理解了，当一个Hello.class这样的文件要被加载时。不考虑我们自定义类加载器，首先会在AppClassLoader中检查是否加载过，如果有那就无需再加载了。如果没有，那么会拿到父加载器，然后调用父加载器的loadClass方法。父类中同理也会先检查自己是否已经加载过，如果没有再往上。注意这个类似递归的过程，直到到达Bootstrap classLoader之前，都是在检查是否加载过，并不会选择自己去加载。直到BootstrapClassLoader，已经没有父加载器了，这时候开始考虑自己是否能加载了，如果自己无法加载，会下沉到子加载器去加载，一直到最底层，如果没有任何加载器能加载，就会抛出ClassNotFoundException。那么有人就有下面这种疑问了？

为什么要设计这种机制
这种设计有个好处是，如果有人想替换系统级别的类：String.java。篡改它的实现，在这种机制下这些系统的类已经被Bootstrap classLoader加载过了（为什么？因为当一个类需要加载的时候，最先去尝试加载的就是BootstrapClassLoader），所以其他类加载器并没有机会再去加载，从一定程度上防止了危险代码的植入。



沙箱安全机制

在Java中将执行程序分成本地代码和远程代码两种，本地代码默认视为可信任的，而远程代码则被看作是不受信的。对于授信的本地代码，可以访问一切本地资源。而对于非授信的远程代码在早期的Java实现中，安全依赖于沙箱 (Sandbox) 机制。

![img](https://img-blog.csdnimg.cn/20200312212803678.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MDkyNzQzNg==,size_16,color_FFFFFF,t_70)

当前最新的安全机制实现，则引入了域 (Domain) 的概念。虚拟机会把所有代码加载到不同的系统域和应用域，系统域部分专门负责与关键资源进行交互，而各个应用域部分则通过系统域的部分代理来对各种需要的资源进行访问。虚拟机中不同的受保护域 (Protected Domain)，对应不一样的权限 (Permission)。存在于不同域中的类文件就具有了当前域的全部权限，如下图所示



#### Native

**native 即 JNI,Java Native Interface**

Native关键字是  JNI，也就是 java本地方法接口，用来调用本地方法库，可以调用本地方法中的C语言代码



#### PC寄存器

每次线程启动的时候会创建一个PC寄存器，保存正在执行的JVM指令地址，每个线程都有自己的PC寄存器，是一个比较小的内存空间，是为一个一个不会出现OutOfMemoryError的内存区域，它的生命周期随着线程的创建而创建，随着线程的结束而死亡。



#### 方法区

Hotspot虚拟机，方法区别称：non-heap（非堆），其实就是存储堆类型的数据，而不占据堆内存的空间

方法区和堆区线程共享，方法区大小和堆一样，可以选择固定大小或者拓展

方法区大小决定了系统可以保存多少个类，如果系统定义了太多的类，导致方法区溢出，虚拟机同样会抛出内存溢出错误。

关闭JVM就会释放这个区域的内存

设置方法区的内存大小：

#### JDK1.7 之前：

**-XX：PermSize 设置永久代初始分配空间  默认是20.75m**

**-XX：MaxPermSize 设置最大永久代分配空间，32位机器默认64m，64位机器默认82m**

#### JDK1.8 及以后：永久代被元空间代替（MetaSpace）

元空间大小可以用参数：-XX:MetaspaceSzie 和 -XX:MaxMetaspaceSize指定

-XX:MetaspaceSzie 默认21.75m -XX:MaxMetaspaceSize 默认-1 没有限制

默认情况下，虚拟机会耗尽所有可用的系统内存，如果元空间发生溢出，虚拟机照样会抛出OOM

如果初始高位线设置过低，通过垃圾回收器日志可以观察到Full GC多次调用，为了避免频繁GC，

建议将-XX:MetaspaceSize设置为一个相对较高的值。



#### 栈：数据结构

程序=数据结构+算法

先进后出，后进先出

栈是桶的概念：先进去的后出来，后进去的先出来

栈有压栈、弹栈

队列是管道概念：先进先出 ( F I F O ) ，后进后出 First Input First Out

喝多了吐就是栈，吃多了拉就是队列

栈：主管程序运行，生命周期和线程同步；

main主线程结束，栈内存也就释放了，对于栈来说，不存在垃圾回收问题，一旦线程结束，栈就Over了。

栈存什么东西：

八大基本数据类型+对象的引用地址+实例方法

栈运行原理：栈帧：方法索引，输入输出参数，本地变量，类引用，父帧，子帧

栈满了就会抛出错误Error：StackOverflowError栈溢出



### 堆：Heap

​		一个JVM只有一个堆内存，堆内存大小是可以调节的。

​		类加载器读取的类文件后，一般会把：类，方法，常量，变量，引用类型的真实对象放到堆中。

​		堆内存还要细分为三个区域：{

新生代：Eden Space：

Survior0区和Survior1区：幸存者0/1区

经过新生代的轻GC 15次的考验进入老年代。

老年代：重量级Full GC垃圾回收

永久代：（1.8移除）

GC垃圾回收集中在新生代和老年代执行。

假设内存满了，爆出OOM，堆内存溢出。

内存溢出代码怎么写：

利用while循环一个字符串无限+=随机数

JDK8以后，永久代被移除，更名为元空间：MetaSpace

}



#### 详解：

##### 新生代：

​	类：诞生成长的地方，也可能类死亡的地方

​	Eden区、幸存者0和1区，

​	所有对象都是在Eden区new出来的

​	Eden区没死亡的对象在幸存者区存活

​	如果Eden区存储触发了轻GC回收机制，就会对Eden区进行清除，存活下来对象在幸存区，清除的对象会消失。当Eden区和幸存者区都满了之后会执行一次Full GC，再次存活下来的对象会进入老年代。

Tips：新生代99%都是临时对象！，能进入老年代的对象并不多。所以平时很少见到 OOM 的错误



##### 老年代：

每次发生轻GC会对新生代进行对象清理，当新生代和幸存区的对象在轻GC清除下存活15次之后，进入老年代

永久代：用来存放jdk自身携带的calss对象，interface元数据，存储的是运行的一些时环境，永久代不存在垃圾回收，关闭JJVM虚拟机就会释放永久代内存。

假设一个启动类，加载了大量的第三方jar包，或者一个tomcat部署了太多应用，或者大量动态生成的反射类，如果不断的加载，可能会导致永久代内存溢出。

 jdk1.6之前：永久代，常量池存在于方法区中

jdk1.7：去永久代，常量池在堆中

jdk1.8：无永久代，常量池在元空间中



**元空间：**

（方法区）：非堆

非堆指的是空间上，不属于堆空间；但是由于存储的内容，特性上又被称为堆

默认情况下：虚拟机被分配到的总内存是电脑内存的 1/4 ，而初始化的内存只有 1/64

因为与堆共享内存，逻辑上存在，物理上不存在

![image-20210908225948384](https://xysaobi.oss-cn-beijing.aliyuncs.com/img/image-20210908225948384.png)

![image-20210908230652551](https://xysaobi.oss-cn-beijing.aliyuncs.com/img/image-20210908230652551.png)

  

dump文件~Jprofiler插件

-Xms : 初始化内存

-Xmx :最大内存

-XX:+PrintGCDetails  打印GC回收的详细信息

-XX:+HeapDumpOnOutOfMemoryError 发生OOM异常打印dump内存快照

-XX:MaxTenuringReshlod 设置最大存活时间，默认是15次



GC：垃圾回收

JVM在进行GC时：大部分回收都在新生代，并不是三个区都回收

新生代

幸存区（form、to）Survior0、Survior1区

老年代

GC两个种类：轻GC（GC）、重GC（Full GC）

轻GC对新生代和幸存区进行回收

重GC进行全局回收



如何区分from和to区：谁空谁是to区

1 . 每次GC都会将Eden区活的对象移到幸存区中：一旦Eden区被GC后，就会是空的！

2 . 当一个对象经历了15次GC，还没有死，就会进入老年代

-XX:MaxTenuringReshold，通过这个参数可以设定进入老年代的时间（指定在0~15次之间）



#### **常用算法：**

**1 . 标记清除 **

分为两步骤：标记----清除

标记：扫描，对存活的对象进行标记

清除：扫描，对没有标记的对象进行清除

优点：简单，成功率高

缺点：两次扫描严重耗时，清除会产生内存碎片



**2 .  标记压缩（标记---清除---压缩）**

标记清除的优化版：防止内存碎片产生

在标记清除基础上，再次扫描，向一端移动仍存活的对象，清除另一外的碎片

优点：在标记清除优点上优化了内存碎片

缺点：对于标记清除又多了一次移动成本，时间增加



**3 .  复制算法**（新生代主要用的复制算法）

把from区向to区复制一份，然后清空from区，这时from区会变成to区，复制过去的to区变成from区等待回收。

优点：没有内存碎片

缺点：浪费内存空间（多了一半空间永远是to区，假设对象100%存活）极端情况下不适用

复制算法最佳使用场景：对象存活度较低的时候，新生区使用复制算法！



**4 . 分代收集算法：**

​		**由于每个收集算法都无法符合所有的场景，就好比每个对象所在的内存阶段不一样，被回收的概率也不一样，比如在新生代，基本90%的对象会被回收，而到了老年代则一半以上的对象存活，所以针对不同的场景，回收的策略也就不一样，所以引出了分代收集算法，根据新生代和老年代不同的场景下使用不同的算法，比如新生代用复制算法，老年代则用标记整理算法**



**5.  引用计数器（不高效）**

给每个对象设置计数器，只要有引用就会计数，当一个对象计数器为0时，进行回收。缺点：效率低下，现在基本不用



## 总结：

内存效率：复制算法 > 标记清除算法 > 标记压缩（时间复杂度）

内存整齐度：复制算法 == 标记压缩算法 > 标记清除算法

内存利用率：标记压缩算法 == 标记清除算法 > 复制算法



// 思考一个问题：难道没有最优算法吗？

答案：永远不能有最优算法。只有最合适的算法。

GC：分代收集算法：根据每个代需求来配置不同算法

年轻代：存活率低：需求时间短：所以用复制算法

老年代：存活率高、区域大：标记清除+标记压缩混合

内存碎片不是很多就标记清除，内存碎片太多就用压缩



JMM：

1 . 什么是JMM：Java内存模型（Java Memory Model）

2 . JMM作用：

3 . 如何学习：

经历过很多面试大部分都会问一句： 你知道Java内存模型么？ 然后我就pulapula的说一大堆什么堆呀，栈呀，GC呀什么的，这段时间把JVM虚拟机和多线程编程完整的学习了一遍，发现JMM和堆/栈这些完全不是一个概念，不知道是不是就是因为这才被拒了十来次的 /尴尬。

JVM是Java实现的虚拟计算机（Java Virtual Machine），对于熟悉计算机结构的同学，我感觉把这些概念和物理机对应起来更好理解。

JVM对应的就是物理机，它有存放数据的存储区：堆、栈等由JVM管理的内存（对应于物理机的内存）、执行数据计算的执行单元：线程（对应于物理机的CPU）、加速线程执行的本次存储区：可能会从存储区里分配一块空间来存储线程本地数据，比如栈（对应于物理机的cache）。

众所周知，现代计算机一般都会包含多个处理器，多个处理器共享主内存。为了提升性能，会在每个处理器上增加一个小容量的cache加速数据读写。cache会导致了缓存一致性问题，为了解决缓存一致性问题又引入了一系列Cache一致性协议（比如MSI、MESI、MOSI、Synapse、Firefly及Dragon Protocol）来解决CPU本地缓存和主内存数据不一致问题。

而JVM中管理下的存储空间（包括堆、栈等）就对应与物理机的内存；

线程本次存储区（例如栈）就对应于物理机的cache；

而JMM就对应于类似于MSI、MESI、MOSI、Synapse、Firefly及Dragon Protocol这样的缓存一致性协议，用于定义数据读写的规则。

JMM相对于物理机的缓存一致性协议来说它还要处理JVM自身特有的问题：重排序问题，参见： http://cmsblogs.com/?p=2116。

那么JMM都有哪些内容呢？ 

官方文档： http://101.96.10.64/www.cs.umd.edu/~pugh/java/memoryModel/CommunityReview.pdf

通俗理解就是happens-before原则 https://www.cnblogs.com/chenssy/p/6393321.html



























## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
