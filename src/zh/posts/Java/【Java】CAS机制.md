---
date: 2023-02-24 11:58:39

title: CAS机制
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# CAS机制



### 我们先看一段代码：

启动两个线程，每个线程中让静态变量count循环累加100次。

![img](https://img-blog.csdn.net/20180312170840546?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

最终输出的count结果一定是200吗？因为这段代码是非[线程安全](https://so.csdn.net/so/search?q=线程安全&spm=1001.2101.3001.7020)的，所以最终的自增结果很可能会小于200。我们再加上synchronized同步锁，再来看一下。

![img](https://img-blog.csdn.net/20180312170827236?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

加了同步锁之后，count自增的操作变成了原子性操作，所以最终输出一定是count=200，代码实现了线程安全。虽然synchronized确保了线程安全，但是在某些情况下，这并不是一个最有的选择。

关键在于性能问题。

synchronized关键字会让没有得到锁资源的线程进入BLOCKED状态，而后在争夺到锁资源后恢复为RUNNABLE状态，这个过程中涉及到操作系统用户模式和内核模式的转换，代价比较高。

尽管JAVA 1.6为synchronized做了优化，增加了从偏向锁到轻量级锁再到重量级锁的过过度，但是在最终转变为重量级锁之后，性能仍然比较低。所以面对这种情况，我们就可以使用java中的“原子操作类”。

所谓原子操作类，指的是java.util.concurrent.atomic包下，一系列以Atomic开头的包装类。如AtomicBoolean，AtomicUInteger，AtomicLong。它们分别用于Boolean，Integer，Long类型的原子性操作。

现在我们尝试使用AtomicInteger类：

![img](https://img-blog.csdn.net/20180312172106130?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

使用AtomicInteger之后，最终的输出结果同样可以保证是200。并且在某些情况下，代码的性能会比synchronized更好。

而Atomic操作类的底层正是用到了“CAS机制”。

CAS是英文单词Compare and Swap的缩写，翻译过来就是比较并替换。

CAS机制中使用了3个基本操作数：内存地址V，旧的预期值A，要修改的新值B。

更新一个变量的时候，只有当变量的预期值A和内存地址V当中的实际值相同时，才会将内存地址V对应的值修改为B。

我们看一个例子：

\1. 在内存地址V当中，存储着值为10的变量。

![img](https://img-blog.csdn.net/20180312172707148?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

\2. 此时线程1想把变量的值增加1.对线程1来说，旧的预期值A=10，要修改的新值B=11.

![img](https://img-blog.csdn.net/20180312172814864?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

\3. 在线程1要提交更新之前，另一个线程2抢先一步，把内存地址V中的变量值率先更新成了11。

![img](https://img-blog.csdn.net/20180312172943800?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

\4. 线程1开始提交更新，首先进行A和地址V的实际值比较，发现A不等于V的实际值，提交失败。

![img](https://img-blog.csdn.net/20180312173045349?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

\5. 线程1 重新获取内存地址V的当前值，并重新计算想要修改的值。此时对线程1来说，A=11，B=12。这个重新尝试的过程被称为自旋。

![img](https://img-blog.csdn.net/20180312173220371?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

\6. 这一次比较幸运，没有其他线程改变地址V的值。线程1进行比较，发现A和地址V的实际值是相等的。

![img](https://img-blog.csdn.net/20180312173331761?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

\7. 线程1进行交换，把地址V的值替换为B，也就是12.

![img](https://img-blog.csdn.net/20180312173421205?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

从思想上来说，synchronized属于悲观锁，悲观的认为程序中的并发情况严重，所以严防死守，CAS属于乐观锁，乐观地认为程序中的并发情况不那么严重，所以让线程不断去重试更新。

在java中除了上面提到的Atomic系列类，以及Lock系列类夺得底层实现，甚至在JAVA1.6以上版本，synchronized转变为重量级锁之前，也会采用CAS机制。

**CAS的缺点：**

1） CPU开销过大

在并发量比较高的情况下，如果许多线程反复尝试更新某一个变量，却又一直更新不成功，循环往复，会给CPU带来很到的压力。

2） 不能保证代码块的原子性

CAS机制所保证的知识一个变量的原子性操作，而不能保证整个代码块的原子性。比如需要保证3个变量共同进行原子性的更新，就不得不使用synchronized了。

3） ABA问题

这是CAS机制最大的问题所在。（后面有介绍）

 

我们下面来介绍一下两个问题：

***\*1. JAVA中CAS的底层实现\****

***\*2. CAS的ABA问题和解决办法。\****

我们看一下AtomicInteger当中常用的自增方法incrementAndGet：

public final int incrementAndGet() {

  for (;;) {

​    int current = get();

​    int next = current + 1;

​    if (compareAndSet(current, next))

​      return next;

  }

}

private volatile int value; 

public final int get() {

  return value;

}

这段代码是一个无限循环，也就是CAS的自旋，循环体中做了三件事：

\1. 获取当前值

\2. 当前值+1，计算出目标值

\3. 进行CAS操作，如果成功则跳出循环，如果失败则重复上述步骤

这里需要注意的重点是get方法，这个方法的作用是获取变量的当前值。

如何保证获取的当前值是内存中的最新值？很简单，用volatile关键字来保证（保证线程间的可见性）。我们接下来看一下compareAndSet方法的实现：

![img](https://img-blog.csdn.net/2018031217514825?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

compareAndSet方法的实现很简单，只有一行代码。这里涉及到两个重要的对象，一个是unsafe，一个是valueOffset。

什么是unsafe呢？Java语言不像C，C++那样可以直接访问底层操作系统，但是JVM为我们提供了一个后门，这个后门就是unsafe。unsafe为我们提供了硬件级别的原子操作。

至于valueOffset对象，是通过unsafe.objectFiledOffset方法得到，所代表的是AtomicInteger对象value成员变量在内存中的偏移量。我们可以简单的把valueOffset理解为value变量的内存地址。

我们上面说过，CAS机制中使用了3个基本操作数：内存地址V，旧的预期值A，要修改的新值B。

而unsafe的compareAndSwapInt方法的参数包括了这三个基本元素：valueOffset参数代表了V，expect参数代表了A，update参数代表了B。

正是unsafe的compareAndSwapInt方法保证了Compare和Swap操作之间的原子性操作。

我们现在来说什么是ABA问题。假设内存中有一个值为A的变量，存储在地址V中。

![img](https://img-blog.csdn.net/2018031218013467?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

此时有三个线程想使用CAS的方式更新这个变量的值，每个线程的执行时间有略微偏差。线程1和线程2已经获取当前值，线程3还未获取当前值。

![img](https://img-blog.csdn.net/20180312180247202?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

接下来，线程1先一步执行成功，把当前值成功从A更新为B；同时线程2因为某种原因被阻塞住，没有做更新操作；线程3在线程1更新之后，获取了当前值B。

![img](https://img-blog.csdn.net/20180312180432152?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

在之后，线程2仍然处于阻塞状态，线程3继续执行，成功把当前值从B更新成了A。

![img](https://img-blog.csdn.net/20180312180546889?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

最后，线程2终于恢复了运行状态，由于阻塞之前已经获得了“当前值A”，并且经过compare检测，内存地址V中的实际值也是A，所以成功把变量值A更新成了B。

![img](https://img-blog.csdn.net/20180312180729792?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

看起来这个例子没啥问题，但如果结合实际，就可以发现它的问题所在。

我们假设一个提款机的例子。假设有一个遵循CAS原理的提款机，小灰有100元存款，要用这个提款机来提款50元。

![img](https://img-blog.csdn.net/20180312181342879?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

由于提款机硬件出了点问题，小灰的提款操作被同时提交了两次，开启了两个线程，两个线程都是获取当前值100元，要更新成50元。

理想情况下，应该一个线程更新成功，一个线程更新失败，小灰的存款值被扣一次。

![img](https://img-blog.csdn.net/20180312181404403?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

线程1首先执行成功，把余额从100改成50.线程2因为某种原因阻塞。这时，小灰的妈妈刚好给小灰汇款50元。

![img](https://img-blog.csdn.net/20180312181531202?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

线程2仍然是阻塞状态，线程3执行成功，把余额从50改成了100。

![img](https://img-blog.csdn.net/20180312181635868?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

线程2恢复运行，由于阻塞之前获得了“当前值”100，并且经过compare检测，此时存款实际值也是100，所以会成功把变量值100更新成50。

![img](https://img-blog.csdn.net/20180312181813320?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

原本线程2应当提交失败，小灰的正确余额应该保持100元，结果由于ABA问题提交成功了。

怎么解决呢？加个版本号就可以了。

真正要做到严谨的CAS机制，我们在compare阶段不仅要比较期望值A和地址V中的实际值，还要比较变量的版本号是否一致。

我们仍然以刚才的例子来说明，假设地址V中存储着变量值A，当前版本号是01。线程1获取了当前值A和版本号01，想要更新为B，但是被阻塞了。

![img](https://img-blog.csdn.net/20180312182255181?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

这时候，内存地址V中变量发生了多次改变，版本号提升为03，但是变量值仍然是A。

![img](https://img-blog.csdn.net/20180312182346458?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

随后线程1恢复运行，进行compare操作。经过比较，线程1所获得的值和地址的实际值都是A，但是版本号不相等，所以这一次更新失败。

![img](https://img-blog.csdn.net/20180312182506360?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI5OTgxNTM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

 

在Java中，AtomicStampedReference类就实现了用版本号作比较额CAS机制。

 

***\*1. java语言CAS底层如何实现？\****

***\*利用unsafe提供的原子性操作方法。\****

***\*2.什么事ABA问题？怎么解决？\****

***\*当一个值从A变成B，又更新回A，普通CAS机制会误判通过检测。\****

***\*利用版本号比较可以有效解决ABA问题。\****
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
