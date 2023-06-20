---
date: 2022-05-06 15:53:40

title: 【数据结构】手写实现ArrayList
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【数据结构】手写实现ArrayList

## 一、前言

### 数组是数据结构还是数据类型？

数组只是个名称，它可以描述一组操作，也可以命名这组操作。数组的数据操作，是通过 idx->val 的方式来处理。它不是具体要求内存上要存储着连续的数据才叫数组，而是说，通过连续的索引 idx，也可以线性访问相邻的数据。

那么当你定义了数据的存储方式，也就定义了数据结构。所以它也是被归类为数据结构。

## 二、数组数据结构

数组（Array）是一种线性表数据结构。它用一组连续的内存空间，来存储一组具有相同类型数据的集合。

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220730-01.png)

数组的特点：

1. 数组是相同数据类型的元素集合（int 不能存放 double）
2. 数组中各元素的存储是有先后顺序的，它们在内存中按照这个顺序连续存放到一起。内存地址连续。
3. 数组获取元素的时间复杂度为O(1)

### 1. 一维数组

一维数组是最常用的数组，其他很多数据结构的变种也都是从一维数组来的。例如 HashMap 的拉链寻址结构，ThreadLocal 的开放寻址结构，都是从一维数组上实现的。

### 2. 二维数组

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220730-02.png)

二维以及多维数组，在开发场景中使用到的到是不多，不过在一些算法逻辑，数学计算中到是可以使用。

## 三、实现数组列表

在 Java 的源码中，数组是一个非常常用的数据结构，很多其他数据结构也都有数组的影子。

### 1. 基本设计

数组是一个固定的、连续的、线性的数据结构，那么想把它作为一个自动扩展容量的数组列表，则需要做一些扩展。

```java
/**
 * 默认初始化空间
 */
private static final int DEFAULT_CAPACITY = 10;
/**
 * 空元素
 */
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
/**
 * ArrayList 元素数组缓存区
 */
transient Object[] elementData;
```

1. 初始化 ArrayList 阶段，如果不指定大小，默认会初始化一个空的元素。这个时候是没有默认长度的。
2. 那么什么时候给初始化的长度呢？是在首次添加元素的时候，因为所有的添加元素操作，也都是需要判断容量，以及是否扩容的。那么在 add 添加元素时统一完成这个事情，还是比较好处理的。
3. 之后就是随着元素的添加，容量是会不足的。当容量不足的是，需要进行扩容操作。同时还得需要把旧数据迁移到新的数组上。*所以数据的迁移算是一个比较耗时的操作*

### 2. 添加元素

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220730-03.png)

```java
public boolean add(E e) {
    // 确保内部容量
    int minCapacity = size + 1;
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    // 判断扩容操作
    if (minCapacity - elementData.length > 0) {
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        if (newCapacity - minCapacity < 0) {
            newCapacity = minCapacity;
        }
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
    // 添加元素
    elementData[size++] = e;
    return true;
}
```

**这是一份简化后的 ArrayList#add 操作**

1. 判断当前容量与初始化容量，使用 Math.max 函数取最大值最为最小初始化空间。
2. 接下来是判断 minCapacity 和元素的数量，是否达到了扩容。首次创建 ArrayList 是一定会扩容的，也就是初始化 DEFAULT_CAPACITY = 10 的容量。
3. Arrays.copyOf 实际上是创建一个新的空间数组，之后调用的 System.arraycopy 迁移到新创建的数组上。这样后续所有的扩容操作，也就都保持统一了。
4. ArrayList 扩容完成后，就是使用 elementData[size++] = e; 添加元素操作了。

### 3. 移除元素

ArrayList 的重点离不开对 System.arraycopy 的使用，它是一个本地方法，可以让你从原数组的特定位置，迁移到新数组的指定位置和迁移数量。如图 2-5 所示，数据迁移 *测试代码在 java-algorithms*

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220730-05.png)

**删除元素**

```java
public E remove(int index) {
    E oldValue = (E) elementData[index];
    int numMoved = size - index - 1;
    if (numMoved > 0) {
        // 从原始数组的某个位置，拷贝到目标对象的某个位置开始后n个元素
        System.arraycopy(elementData, index + 1, elementData, index, numMoved);
    }
    elementData[--size] = null; // clear to let GC do its work
    return oldValue;
}
```

- ArrayList 的元素删除，就是在确定出元素位置后，使用 System.arraycopy 拷贝数据方式移动数据，把需要删除的元素位置覆盖掉。
- 此外它还会把已经删除的元素设置为 null 一方面让我们不会在读取到这个元素，另外一方面也是为了 GC

### 4. 获取元素

```java
public E get(int index) {
    return (E) elementData[index];
}
@Override
public String toString() {
    return "ArrayList{" +
            "elementData=" + Arrays.toString(elementData) +
            ", size=" + size +
            '}';
}   
```

- 获取元素就比较简单了，直接从 elementData 使用索引直接获取即可。这个是一个 O(1) 操作。也正因为搜索元素的便捷性，才让 ArrayList 使用的那么广泛。同时为了兼容可以通过元素来获取数据，而不是直接通过下标，引出了 HashMap 使用哈希值计算下标的计算方式，也引出了斐波那契散列。它们的设计都是在尽可能减少元素碰撞的情况下，尽可能使用贴近 O(1) 的时间复杂度获取数据。*这些内容的学习可以阅读小傅哥的《Java面经手册》也可以随着本系列章节内容的铺设逐步覆盖到算法后进行学习*

## 四、数组列表测试

```java
@Test
public void test_array_list() {
    cn.bugstack.algorithms.data.array.List<String> list = new ArrayList<>();
    list.add("01");
    list.add("02");
    list.add("03");
    list.add("04");
    list.add("05");
    list.add("06");
    list.add("07");
    list.add("08");
    list.add("09");
    list.add("10");
    list.add("11");
    list.add("12");
    
    System.out.println(list);
    
    list.remove(9);
    
    System.out.println(list);
}
```

**测试结果**

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220730-06.png)

```java
ArrayList{elementData=[01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, null, null, null], size=12}
ArrayList{elementData=[01, 02, 03, 04, 05, 06, 07, 08, 09, 11, 12, null, null, null, null], size=11}

Process finished with exit code 0
```

- 测试案例中包括了在我们自己实现的 ArrayList 中顺序添加元素，逐步测试扩容迁移元素，以及删除元素后数据的迁移。
- 最终的测试结果可以看到，一共有12个元素，其中idx=9的元素被删除前后，元素的迁移变化。

## 六、常见面试问题

数据结构中有哪些是线性表数据结构？

```
答：线性表数据结构是指一种特殊的数据结构，其中数据元素之间存在线性关系。常见的线性表数据结构包括：数组、链表、栈和队列等。
```

数组的元素删除和获取，时间复杂度是多少？

```
答：数组的元素删除和获取的时间复杂度均为O(1)，因为数组中的元素是连续存储的，并且可以通过下标直接访问元素。删除操作通常是将待删除元素后面的所有元素向前移动一位，然后将数组长度减一；获取操作则是直接返回对应下标的元素值。
```

ArrayList 中默认的初始化长度是多少？

```
答：ArrayList 中默认的初始化长度是10。在创建一个新的 ArrayList 对象时，如果没有指定初始容量，那么就会使用默认容量 10 创建一个空数组。
```

ArrayList 中扩容的范围是多大一次？

```
答：ArrayList 中扩容的范围是每次增加原来数组大小的一半。当 ArrayList 容量不足以容纳更多元素时，就会自动进行扩容操作。具体来说，ArrayList 扩容时会创建一个新的数组，其大小为原来数组大小的 1.5 倍，然后将原来数组中的元素复制到新数组中。该扩容策略可以保证 ArrayList 在大多数情况下都只需要进行少数几次扩容操作。
```

ArrayList 是如何完成扩容的，System.arraycopy 各个入参的作用是什么？

```
答：
ArrayList 是通过 System.arraycopy() 方法完成扩容操作的。具体实现过程如下：

1.当添加新元素时，如果当前内部数组已经满了，就需要进行扩容操作。
2.首先计算出新数组的大小，其大小为原有数组大小的 1.5 倍。
3.创建一个新的数组，并将原有数组中的元素复制到新数组中。这里使用 System.arraycopy() 方法来完成元素的复制操作，第一个参数是原数组，第二个参数是原数组中需要复制的起始位置，第三个参数是目标数组，第四个参数是目标数组中存放复制数据的起始位置，第五个参数是需要复制的元素个数。
4.最后，将 ArrayList 的内部数组设置为新数组。

System.arraycopy() 方法具有较高的效率，因为它可以直接利用底层系统级别的内存复制机制进行数据复制，避免了通过循环逐个复制元素的低效率问题。
```

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
