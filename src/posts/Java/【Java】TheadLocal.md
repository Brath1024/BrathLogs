---
date: 2022-07-09 21:56:08

title: ThreadLocal
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# ThreadLocal 详解

ThreadLocal 概述
ThreadLocal类用来提供线程内部的局部变量，不同的线程之间不会相互干扰
这种变量在多线程环境下访问（通过get和set方法访问）时能保证各个线程的变量相对独立于其他线程内的变量
在线程的生命周期内起作用，可以减少同一个线程内多个函数或组件之间一些公共变量传递的复杂度
使用
常用方法

| **方法名**                 | **描述**                                            |
| -------------------------- | --------------------------------------------------- |
| ThreadLocal()              | 创建ThreadLocal对象                                 |
| public void set( T value)  | 设置当前线程绑定的局部变量                          |
| public T get()             | 获取当前线程绑定的局部变量                          |
| public T remove()          | 移除当前线程绑定的局部变量，该方法可以帮助JVM进行GC |
| protected T initialValue() | 返回当前线程局部变量的初始值                        |

案例
场景：让每个线程获取其设置的对应的共享变量值
共享变量访问问题案例

```java
/**
 * 线程间访问共享变量之间问题
 * */
public class DemoQuestion {
    private String name;
    private int age;

    public static void main(String[] args) {
        DemoQuestion demoQuestion = new DemoQuestion();
        for (int i = 0; i < 5; i++) {
            // int j = i;
            new Thread(() ->{
                // demoQuestion.setAge(j);
                demoQuestion.setName(Thread.currentThread().getName() + "的数据");
                System.out.println("=================");
                System.out.println(Thread.currentThread().getName() + "--->" + demoQuestion.getName());
                // System.out.println(Thread.currentThread().getName() + "--->" + demoQuestion.getAge());
            },"t" + i).start();
        }
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
}
```

- 使用关键字 Synchronized 关键字加锁解决方案

```java
/**
 * 使用加锁的方式解决：线程间访问共享变量之间问题
 * 将对共享变量的操作进行加锁，保证其原子性
 * */
public class SolveDemoQuestionBySynchronized {
    private String name;
    private int age;

    public static void main(String[] args) {
        SolveDemoQuestionBySynchronized demoQuestion = new SolveDemoQuestionBySynchronized();
        for (int i = 0; i < 5; i++) {
            // int j = i;
            new Thread(() ->{
                synchronized (SolveDemoQuestionBySynchronized.class){
                    demoQuestion.setName(Thread.currentThread().getName() + "的数据");
                    System.out.println("=================");
                    System.out.println(Thread.currentThread().getName() + "--->" + demoQuestion.getName());
                }
            },"t" + i).start();
        }
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
}
```

- 使用 ThreadLocal 方式解决

```java
public class SolveDemoQuestionByThreadLocal {
    private  ThreadLocal<String> name = new ThreadLocal<>();
    private int age;

    public static void main(String[] args) {
        SolveDemoQuestionByThreadLocal demoQuestion = new SolveDemoQuestionByThreadLocal();
        for (int i = 0; i < 5; i++) {
            new Thread(() ->{
                demoQuestion.setName(Thread.currentThread().getName() + "的数据");
                System.out.println("=================");
                System.out.println(Thread.currentThread().getName() + "--->" + demoQuestion.getName());
            },"t" + i).start();
        }
    }
    public String getName() {
        return name.get();
    }
    private void setName(String content) {
        name.set(content);
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
}
```

## ThreadLocalMap 内部结果

> JDK8 之前的设计
> 每个ThreadLocal都创建一个ThreadLocalMap，用线程作为ThreadLocalMap的key，要存储的局部变量作为ThreadLocalMap的value，这样就能达到各个线程的局部变量隔离的效果

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/baa00cdb33a14aaeab7b453c1bb1469b.png)

JDK8 之后的设计
每个Thread维护一个ThreadLocalMap，这个ThreadLocalMap的key是ThreadLocal实例本身，value才是真正要存储的值Object
每个Thread线程内部都有一个ThreadLocalMap
Map里面存储ThreadLocal对象（key）和线程的变量副本（value）
Thread内部的Map是由ThreadLocal维护的，由ThreadLocal负责向map获取和设置线程的变量值
对于不同的线程，每次获取副本值时，别的线程并不能获取到当前线程的副本值，形成了副本的隔离，互不干扰

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/5633b9ff01d84aaeb06b799d825e289e.png)

JDK对ThreadLocal这样改造的好处
减少ThreadLocalMap存储的Entry数量：因为之前的存储数量由Thread的数量决定，现在是由ThreadLocal的数量决定。在实际运用当中，往往ThreadLocal的数量要少于Thread的数量
当Thread销毁之后，对应的ThreadLocalMap也会随之销毁，能减少内存的使用（但是不能避免内存泄漏问题，解决内存泄漏问题应该在使用完后及时调用remove()对ThreadMap里的Entry对象进行移除，由于Entry继承了弱引用类，会在下次GC时被JVM回收）

## ThreadLocal相关方法源码解析

### set方法

- 源码及相关注释

```java
  /**
     * 设置当前线程对应的ThreadLocal的值
     * @param value 将要保存在当前线程对应的ThreadLocal的值
     */
    public void set(T value) {
        // 获取当前线程对象
        Thread t = Thread.currentThread();
        // 获取此线程对象中维护的ThreadLocalMap对象
        ThreadLocalMap map = getMap(t);
        // 判断map是否存在
        if (map != null)
            // 存在则调用map.set设置此实体entry,this这里指调用此方法的ThreadLocal对象
            map.set(this, value);
        else
            // 1）当前线程Thread 不存在ThreadLocalMap对象
            // 2）则调用createMap进行ThreadLocalMap对象的初始化
            // 3）并将 t(当前线程)和value(t对应的值)作为第一个entry存放至ThreadLocalMap中
            createMap(t, value);
    }

 /**
     * 获取当前线程Thread对应维护的ThreadLocalMap 
     * 
     * @param  t the current thread 当前线程
     * @return the map 对应维护的ThreadLocalMap 
     */
    ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }
    
	/**
     *创建当前线程Thread对应维护的ThreadLocalMap 
     * @param t 当前线程
     * @param firstValue 存放到map中第一个entry的值
     */
	void createMap(Thread t, T firstValue) {
        //这里的this是调用此方法的threadLocal
        t.threadLocals = new ThreadLocalMap(this, firstValue);
    }
```

- 相关流程图

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/2430f09d315e40769a63720f84a8a06c.png)

- 执行流程

1. 获取当前线程，并根据当前线程获取一个Map
2. 如果获取的Map不为空，则将参数设置到Map中（当前ThreadLocal的引用作为key）
3. 如果Map为空，则给该线程创建 Map，并设置初始值

### get()方法

- 源码及相关注释

```java
 /**
     * 返回当前线程中保存ThreadLocal的值
     * 如果当前线程没有此ThreadLocal变量，
     * 则它会通过调用{@link #initialValue} 方法进行初始化值
     * @return 返回当前线程对应此ThreadLocal的值
     */
    public T get() {
        // 获取当前线程对象
        Thread t = Thread.currentThread();
        // 获取此线程对象中维护的ThreadLocalMap对象
        ThreadLocalMap map = getMap(t);
        // 如果此map存在
        if (map != null) {
            // 以当前的ThreadLocal 为 key，调用getEntry获取对应的存储实体e
            ThreadLocalMap.Entry e = map.getEntry(this);
            // 对e进行判空 
            if (e != null) {
                @SuppressWarnings("unchecked")
                // 获取存储实体 e 对应的 value值,即为我们想要的当前线程对应此ThreadLocal的值
                T result = (T)e.value;
                return result;
            }
        }
        /*
        	初始化 : 有两种情况有执行当前代码
        	第一种情况: map不存在，表示此线程没有维护的ThreadLocalMap对象
        	第二种情况: map存在, 但是没有与当前ThreadLocal关联的entry
         */
        return setInitialValue();
    }

    /**
     * 初始化
     * @return the initial value 初始化后的值
     */
    private T setInitialValue() {
        // 调用initialValue获取初始化的值
        // 此方法可以被子类重写, 如果不重写默认返回null
        T value = initialValue();
        // 获取当前线程对象
        Thread t = Thread.currentThread();
        // 获取此线程对象中维护的ThreadLocalMap对象
        ThreadLocalMap map = getMap(t);
        // 判断map是否存在
        if (map != null)
            // 存在则调用map.set设置此实体entry
            map.set(this, value);
        else
            // 1）当前线程Thread 不存在ThreadLocalMap对象
            // 2）则调用createMap进行ThreadLocalMap对象的初始化
            // 3）并将 t(当前线程)和value(t对应的值)作为第一个entry存放至ThreadLocalMap中
            createMap(t, value);
        // 返回设置的值value
        return value;
    }
```

- 流程图

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/a7e417b2719348729b4229071e4d3f4f.png)

执行流程
获取当前线程, 根据当前线程获取一个Map
如果获取的Map不为空，则在Map中以ThreadLocal的引用作为key来在Map中获取对应的Entrye，否则转到4
如果e不为null，则返回e.value，否则转到4
Map为空或者e为空，则通过initialValue函数获取初始值value，然后用ThreadLocal的引用和value作为firstKey和firstValue创建一个新的Map

## remove方法

- 源码及相关注释

```java
/**
     * 删除当前线程中保存的ThreadLocal对应的实体entry
     */
     public void remove() {
        // 获取当前线程对象中维护的ThreadLocalMap对象
         ThreadLocalMap m = getMap(Thread.currentThread());
        // 如果此map存在
         if (m != null)
            // 存在则调用map.remove
            // 以当前ThreadLocal为key删除对应的实体entry
             m.remove(this);
     }
```

- 执行流程

1. 首先获取当前线程，并根据当前线程获取一个Map
2. 如果获取的Map不为空，则移除当前ThreadLocal对象对应的entry

initialValue方法
此方法的作用是返回该线程局部变量的初始值
这个方法是一个延迟调用方法，从上面的代码我们得知，在set方法还未调用而先调用了get方法时才执行，并且仅执行1次
这个方法缺省实现直接返回一个null
如果想要一个除null之外的初始值，可以重写此方法。（备注： 该方法是一个protected的方法，显然是为了让子类覆盖而设计的）
源码及相关注释

```java
/**
  * 返回当前线程对应的ThreadLocal的初始值
  * 此方法的第一次调用发生在，当线程通过get方法访问此线程的ThreadLocal值时
  * 除非线程先调用了set方法，在这种情况下，initialValue 才不会被这个线程调用。
  * 通常情况下，每个线程最多调用一次这个方法。
  *
  * <p>这个方法仅仅简单的返回null {@code null};
  * 如果想ThreadLocal线程局部变量有一个除null以外的初始值，
  * 必须通过子类继承{@code ThreadLocal} 的方式去重写此方法
  * 通常, 可以通过匿名内部类的方式实现
  *
  * @return 当前ThreadLocal的初始值
  */
protected T initialValue() {
    return null;
}
```

ThreadLocalMap 解析

## 内部结构

ThreadLocalMap是ThreadLocal的内部类，没有实现Map接口，用独立的方式实现了Map的功能，其内部的Entry也是独立实现的，而Entry又是ThreadLocalMap的内部类，且集成弱引用(WeakReference)类。

## 成员变量

```java
			/**
         * The entries in this hash map extend WeakReference, using
         * its main ref field as the key (which is always a
         * ThreadLocal object).  Note that null keys (i.e. entry.get()
         * == null) mean that the key is no longer referenced, so the
         * entry can be expunged from table.  Such entries are referred to
         * as "stale entries" in the code that follows.
         * 
				* Entry继承WeakReference，并且用ThreadLocal作为key.
 				* 如果key为null(entry.get() == null)，意味着key不再被引用，
 				* 因此这时候entry也可以从table中清除。
         */
        static class Entry extends WeakReference<ThreadLocal<?>> {
            /** The value associated with this ThreadLocal. */
            Object value;

            Entry(ThreadLocal<?> k, Object v) {
                super(k);
                value = v;
            }
        }

 /**
     * 初始容量 —— 必须是2的整次幂
     *  The initial capacity -- MUST be a power of two.  
     */
    private static final int INITIAL_CAPACITY = 16;

    /**
     * 存放数据的table，Entry类的定义在下面分析
     * 同样，数组长度必须是2的整次幂。
     * The table, resized as necessary.
     * table.length MUST always be a power of two.
     */
    private Entry[] table;

    /**
     * 数组里面entrys的个数，可以用于判断table当前使用量是否超过阈值。
     * The number of entries in the table
     */
    private int size = 0;

    /**
     * 进行扩容的阈值，表使用量大于它的时候进行扩容。
     * The next size value at which to resize
     */
    private int threshold; // Default to 0
```

## 弱引用和内存泄漏

弱引用相关概念
强引用（“Strong” Reference），就是我们最常见的普通对象引用，只要还有强引用指向一个对象，就能表明对象还“活着”，垃圾回收器就不会回收这种对象
弱引用（WeakReference），垃圾回收器一旦发现了只具有弱引用的对象，不管当前内存空间足够与否，都会回收它的内存

## 内存泄漏相关概念

Memory overflow:内存溢出，没有足够的内存提供申请者使用
Memory leak: 内存泄漏是指程序中己动态分配的堆内存由于某种原因程序未释放或无法释放，造成系统内存的浪费，导致程序运行速度减慢甚至系统崩溃等严重后果。内存泄漏的堆积终将导致内存溢出

## 内存泄漏与强弱引用关系

ThreadLocal 内存结构

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/7476f5b3aec44f20b884e118880925b1.png)

如果key使用强引用，也就是上图中的红色背景框部分
业务代码中使用完ThreadLocal ，threadLocal Ref被回收了
因为threadLocalMap的Entry强引用了threadLocal，造成threadLocal无法被回收
在没有手动删除这个Entry以及CurrentThread依然运行的前提下，始终有强引用链 threadRef->currentThread->threadLocalMap->entry，Entry就不会被回收（Entry中包括了ThreadLocal实例和value），导致Entry内存泄漏
如果key使用弱引用，也就是上图中的红色背景框部分
业务代码中使用完ThreadLocal ，threadLocal Ref被回收了
由于ThreadLocalMap只持有ThreadLocal的弱引用，没有任何强引用指向threadlocal实例, 所以threadlocal就可以顺利被gc回收，此时Entry中的key=null
但是在没有手动删除这个Entry以及CurrentThread依然运行的前提下，也存在有强引用链 threadRef->currentThread->threadLocalMap->entry -> value ，value不会被回收， 而这块value永远不会被访问到了，导致value内存泄漏

## 出现内存泄漏的真实原因

没有手动删除对应的Entry节点信息
ThreadLocal 对象使用完后，对应线程仍然在运行

## 避免内存泄漏的的两种方式

使用完ThreadLocal，调用其remove方法删除对应的Entry
使用完ThreadLocal，当前Thread也随之运行结束
对于第一种方式很好控制，调用对应remove()方法即可，但是对于第二种方式，我们是很难控制的，正因为不好控制，这也是为什么ThreadLocalMap 里对应的Entry对象继承弱引用的原因，因为使用了弱引用，当ThreadLocal 使用完后，key的引用就会为null，而在调用ThreadLocal 中的get()/set()方法时，当判断key为null时会将value置为null，这就就会在jvm下次GC时将对应的Entry对象回收，从而避免内存泄漏问题的出现。

## hash冲突问题及解决方法

首先从ThreadLocal的set() 方法入手

```
public void set(T value) {
        Thread t = Thread.currentThread();
        ThreadLocal.ThreadLocalMap map = getMap(t);
        if (map != null)
            //调用了ThreadLocalMap的set方法
            map.set(this, value);
        else
            createMap(t, value);
    }
    
    ThreadLocal.ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }

    void createMap(Thread t, T firstValue) {
        	//调用了ThreadLocalMap的构造方法
        t.threadLocals = new ThreadLocal.ThreadLocalMap(this, firstValue);
    }
```

- 构造方法`ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue)`

- ```
   /*
    * firstKey : 本ThreadLocal实例(this)
    * firstValue ： 要保存的线程本地变量
    */
  ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
          //初始化table
          table = new ThreadLocal.ThreadLocalMap.Entry[INITIAL_CAPACITY];
          //计算索引(重点代码）
          int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
          //设置值
          table[i] = new ThreadLocal.ThreadLocalMap.Entry(firstKey, firstValue);
          size = 1;
          //设置阈值
          setThreshold(INITIAL_CAPACITY);
      }
  ```

  构造函数首先创建一个长度为16的Entry数组，然后计算出firstKey对应的索引，然后存储到table中，并设置size和threshold

  分析：int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1)
  关于：firstKey.threadLocalHashCode

  ```
  private final int threadLocalHashCode = nextHashCode();
      
      private static int nextHashCode() {
          return nextHashCode.getAndAdd(HASH_INCREMENT);
      }
  //AtomicInteger是一个提供原子操作的Integer类，通过线程安全的方式操作加减,适合高并发情况下的使用
      private static AtomicInteger nextHashCode =  new AtomicInteger();
       //特殊的hash值
      private static final int HASH_INCREMENT = 0x61c88647;
  ```

  这里定义了一个AtomicInteger类型，每次获取当前值并加上HASH_INCREMENT，HASH_INCREMENT = 0x61c88647,这个值跟斐波那契数列（黄金分割数）有关，其主要目的就是为了让哈希码能均匀的分布在2的n次方的数组里, 也就是Entry[] table中，这样做可以尽量避免hash冲突

  关于：& (INITIAL_CAPACITY - 1)
  计算hash的时候里面采用了hashCode & (size - 1)的算法，这相当于取模运算hashCode % size的一个更高效的实现。正是因为这种算法，我们要求size必须是2的整次幂，这也能保证在索引不越界的前提下，使得hash发生冲突的次数减小
  ThreadLocalMap中的set方法

  ```
  private void set(ThreadLocal<?> key, Object value) {
          ThreadLocal.ThreadLocalMap.Entry[] tab = table;
          int len = tab.length;
          //计算索引(重点代码，刚才分析过了）
          int i = key.threadLocalHashCode & (len-1);
          /**
           * 使用线性探测法查找元素（重点代码）
           */
          for (ThreadLocal.ThreadLocalMap.Entry e = tab[i];
               e != null;
               e = tab[i = nextIndex(i, len)]) {
              ThreadLocal<?> k = e.get();
              //ThreadLocal 对应的 key 存在，直接覆盖之前的值
              if (k == key) {
                  e.value = value;
                  return;
              }
              // key为 null，但是值不为 null，说明之前的 ThreadLocal 对象已经被回收了，
             // 当前数组中的 Entry 是一个陈旧（stale）的元素
              if (k == null) {
                  //用新元素替换陈旧的元素，这个方法进行了不少的垃圾清理动作，防止内存泄漏
                  replaceStaleEntry(key, value, i);
                  return;
              }
          }
      
      	//ThreadLocal对应的key不存在并且没有找到陈旧的元素，则在空元素的位置创建一个新的Entry。
              tab[i] = new Entry(key, value);
              int sz = ++size;
              /**
               * cleanSomeSlots用于清除那些e.get()==null的元素，
               * 这种数据key关联的对象已经被回收，所以这个Entry(table[index])可以被置null。
               * 如果没有清除任何entry,并且当前使用量达到了负载因子所定义(长度的2/3)，那么进行				 * rehash（执行一次全表的扫描清理工作）
               */
              if (!cleanSomeSlots(i, sz) && sz >= threshold)
                  rehash();
  }
  
   /**
       * 获取环形数组的下一个索引
       */
      private static int nextIndex(int i, int len) {
          return ((i + 1 < len) ? i + 1 : 0);
      }
  ```

  ## 代码执行流程：

  1.首先还是根据key计算出索引 i，然后查找i位置上的Entry

  2.若是Entry已经存在并且key等于传入的key，那么这时候直接给这个Entry赋新的value值

  3.若是Entry存在，但是key为null，则调用replaceStaleEntry来更换这个key为空的Entry

  4.不断循环检测，直到遇到为null的地方，这时候要是还没在循环过程中return，那么就在这个null的位置新建一个Entry，并且插入，同时size增加1

  5.最后调用cleanSomeSlots，清理key为null的Entry，最后返回是否清理了Entry，接下来再判断sz 是否>= thresgold达到了rehash的条件，达到的话就会调用rehash函数执行一次全表的扫描清理

  - 分析 ： ThreadLocalMap使用线性探测法来解决哈希冲突的

  1.该方法一次探测下一个地址，直到有空的地址后插入，若整个空间都找不到空余的地址，则产生溢出
  2.假设当前table长度为16，也就是说如果计算出来key的hash值为14，如果table[14]上已经有值，并且其key与当前key不一致，那么就发生了hash冲突，这个时候将14加1得到15，取table[15]进行判断，这个时候如果还是冲突会回到0，取table[0],以此类推，直到可以插入

  3.可以把Entry[] table看成一个环形数组









## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
