---
date: 2022-05-06 17:23:40

title: 【数据结构】手写实现Hash表，并解决哈希冲突
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【数据结构】手写实现Hash表，并解决哈希冲突

## 一、前言

### 哈希表的历史

哈希散列的想法在不同的地方独立出现。1953 年 1 月，汉斯·彼得·卢恩 ( Hans Peter Luhn ) 编写了一份IBM内部备忘录，其中使用了散列和链接。开放寻址后来由 AD Linh 在 Luhn 的论文上提出。大约在同一时间，IBM Research的Gene Amdahl、Elaine M. McGraw、Nathaniel Rochester和Arthur Samuel为IBM 701汇编器实现了散列。 线性探测的开放寻址归功于 Amdahl，尽管Ershov独立地有相同的想法。“开放寻址”一词是由W. Wesley Peterson在他的文章中创造的，该文章讨论了大文件中的搜索问题。

## 二、哈希数据结构

哈希表的存在是为了解决能通过O(1)时间复杂度直接索引到指定元素。

这是什么意思呢？通过我们使用数组存放元素，都是按照顺序存放的，当需要获取某个元素的时候，则需要对数组进行遍历，获取到指定的值。如图所示；

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220824-01.png)

而这样通过循环遍历比对获取指定元素的操作，时间复杂度是O(n)，也就是说如果你的业务逻辑实现中存在这样的代码是非常拉胯的。那怎么办呢？这就引入了哈希散列表的设计。

------

在计算机科学中，一个哈希表（hash table、hash map）是一种实现关联数组的抽象数据结构，该结构将键通过哈希计算映射到值。

也就是说我们通过对一个 Key 值计算它的哈希并与长度为2的n次幂的数组减一做与运算，计算出槽位对应的索引，将数据存放到索引下。那么这样就解决了当获取指定数据时，只需要根据存放时计算索引ID的方式再计算一次，就可以把槽位上对应的数据获取处理，以此达到时间复杂度为O(1)的情况。如图所示；

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220824-02.png)

哈希散列虽然解决了获取元素的时间复杂度问题，但大多数时候这只是理想情况。因为随着元素的增多，很可能发生哈希冲突，或者哈希值波动不大导致索引计算相同，也就是一个索引位置出现多个元素情况。如图所示；

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220824-03.png)

当`李二狗`、`拎瓢冲`都有槽位的下标索引03的 `叮裆猫` 发生冲突时，情况就变得糟糕了，因为这样就不能满足O(1)时间复杂度获取元素的诉求了。

## 三、实现哈希散列

​		哈希散列是一个非常常见的数据结构，无论是我们使用的 HashMap、ThreaLocal 还是你在刷题中位了提升索引效率，都会用到哈希散列。

​		只要哈希桶的长度由负载因子控制的合理，每次查找元素的平均时间复杂度与桶中存储的元素数量无关。另外许多哈希表设计还允许对键值对的任意插入和删除，每次操作的摊销固定平均成本。

### 1. 哈希碰撞

**说明**：通过模拟简单 HashMap 实现，去掉拉链寻址等设计，验证元素哈新索引位置碰撞。

```java
public class HashMap01<K, V> implements Map<K, V> {

    private final Object[] tab = new Object[8];

    @Override
    public void put(K key, V value) {
        int idx = key.hashCode() & (tab.length - 1);
        tab[idx] = value;
    }

    @Override
    public V get(K key) {
        int idx = key.hashCode() & (tab.length - 1);
        return (V) tab[idx];
    }
} 
```

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220824-04.png)

- HashMap01 的实现只是通过哈希计算出的下标，散列存放到固定的数组内。那么这样当发生元素下标碰撞时，原有的元素就会被新的元素替换掉。

**测试**

```java
@Test
public void test_hashMap01() {
    Map<String, String> map = new HashMap01<>();
    map.put("01", "花花");
    map.put("02", "豆豆");
    logger.info("碰撞前 key：{} value：{}", "01", map.get("01"));
    
    // 下标碰撞
    map.put("09", "蛋蛋");
    map.put("12", "苗苗");
    logger.info("碰撞前 key：{} value：{}", "01", map.get("01"));
}
```

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220824-05.png)

```java
06:58:41.691 [main] INFO cn.bugstack.algorithms.test.AlgorithmsTest - 碰撞前 key：01 value：花花
06:58:41.696 [main] INFO cn.bugstack.algorithms.test.AlgorithmsTest - 碰撞前 key：01 value：苗苗

Process finished with exit code 0
```

- 通过测试结果可以看到，碰撞前 map.get("01") 的值是`花花`，两次下标索引碰撞后存放的值则是`苗苗`
- 这也就是使用哈希散列必须解决的一个问题，无论是在已知元素数量的情况下，通过扩容数组长度解决，还是把碰撞的元素通过链表存放，都是可以的。

### 2. 拉链寻址

**说明**：既然我们没法控制元素不碰撞，但我们可以对碰撞后的元素进行管理。比如像 HashMap 中拉链法一样，把碰撞的元素存放到链表上。这里我们就来简化实现一下。

```java
public class HashMap02BySeparateChaining<K, V> implements Map<K, V> {

    private final LinkedList<Node<K, V>>[] tab = new LinkedList[8];

    @Override
    public void put(K key, V value) {
        int idx = key.hashCode() & (tab.length - 1);
        if (tab[idx] == null) {
            tab[idx] = new LinkedList<>();
            tab[idx].add(new Node<>(key, value));
        } else {
            tab[idx].add(new Node<>(key, value));
        }
    }

    @Override
    public V get(K key) {
        int idx = key.hashCode() & (tab.length - 1);
        for (Node<K, V> kvNode : tab[idx]) {
            if (key.equals(kvNode.getKey())) {
                return kvNode.value;
            }
        }
        return null;
    }

    static class Node<K, V> {
        final K key;
        V value;

        public Node(K key, V value) {
            this.key = key;
            this.value = value;
        }

        public K getKey() {
            return key;
        }

        public V getValue() {
            return value;
        }

    }
}
```

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220824-06.png)

- 因为元素在存放到哈希桶上时，可能发生下标索引膨胀，所以这里我们把每一个元素都设定成一个 Node 节点，这些节点通过 LinkedList 链表关联，当然你也可以通过 Node 节点构建出链表 next 元素即可。
- 那么这时候在发生元素碰撞，相同位置的元素就都被存放到链表上了，获取的时候需要对存放多个元素的链表进行遍历获取。

**测试**

```java
@Test
public void test_hashMap02() {
    Map<String, String> map = new HashMap02BySeparateChaining<>();
    map.put("01", "花花");
    map.put("05", "豆豆");
    logger.info("碰撞前 key：{} value：{}", "01", map.get("01"));
    
    // 下标碰撞
    map.put("09", "蛋蛋");
    map.put("12", "苗苗");
    logger.info("碰撞前 key：{} value：{}", "01", map.get("01"));
}
```

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220824-07.png)

```java
07:21:16.654 [main] INFO cn.bugstack.algorithms.test.AlgorithmsTest - 碰撞前 key：01 value：花花
07:22:44.651 [main] INFO cn.bugstack.algorithms.test.AlgorithmsTest - 碰撞前 key：01 value：花花

Process finished with exit code 0
```

- 此时第一次和第二次获取01位置的元素就都是`花花`了，元素没有被替代。因为此时的元素是被存放到链表上了。

### 3. 开放寻址

**说明**：除了对哈希桶上碰撞的索引元素进行拉链存放，还有不引入新的额外的数据结构，只是在哈希桶上存放碰撞元素的方式。它叫开放寻址，也就是 ThreaLocal 中运用斐波那契散列+开放寻址的处理方式。

```java
public class HashMap03ByOpenAddressing<K, V> implements Map<K, V> {

    private final Node<K, V>[] tab = new Node[8];

    @Override
    public void put(K key, V value) {
        int idx = key.hashCode() & (tab.length - 1);
        if (tab[idx] == null) {
            tab[idx] = new Node<>(key, value);
        } else {
            for (int i = idx; i < tab.length; i++) {
                if (tab[i] == null) {
                    tab[i] = new Node<>(key, value);
                    break;
                }
            }
        }
    }

    @Override
    public V get(K key) {
        int idx = key.hashCode() & (tab.length - 1);
        for (int i = idx; i < tab.length; i ++){
            if (tab[idx] != null && tab[idx].key == key) {
                return tab[idx].value;
            }
        }
        return null;
    }

    static class Node<K, V> {
        final K key;
        V value;

        public Node(K key, V value) {
            this.key = key;
            this.value = value;
        }

    }
}
```

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220824-08.png)

- 开放寻址的设计会对碰撞的元素，寻找哈希桶上新的位置，这个位置从当前碰撞位置开始向后寻找，直到找到空的位置存放。
- 在 ThreadLocal 的实现中会使用斐波那契散列、索引计算累加、启发式清理、探测式清理等操作，以保证尽可能少的碰撞。

**测试**

```java
@Test
public void test_hashMap03() {
    Map<String, String> map = new HashMap03ByOpenAddressing<>();
    map.put("01", "花花");
    map.put("05", "豆豆");
    logger.info("碰撞前 key：{} value：{}", "01", map.get("01"));
    // 下标碰撞
    map.put("09", "蛋蛋");
    map.put("12", "苗苗");
    logger.info("碰撞前 key：{} value：{}", "01", map.get("01"));
}
```

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/algorithms-220824-09.png)

```java
07:20:22.382 [main] INFO cn.bugstack.algorithms.test.AlgorithmsTest - 碰撞前 key：01 value：花花
07:20:22.387 [main] INFO cn.bugstack.algorithms.test.AlgorithmsTest - 碰撞前 key：01 value：花花
07:20:22.387 [main] INFO cn.bugstack.algorithms.test.AlgorithmsTest - 数据结构：HashMap{tab=[null,{"key":"01","value":"花花"},{"key":"09","value":"蛋蛋"},{"key":"12","value":"苗苗"},null,{"key":"05","value":"豆豆"},null,null]}

Process finished with exit code 0
```

- 通过测试结果可以看到，开放寻址对碰撞元素的寻址存放，也是可用解决哈希索引冲突问题的。



## 四、常见面试问题

- 介绍一下散列表

  ```
  答：散列表（Hash Table）是一种基于哈希函数进行快速访问的数据结构，具有极高的查询和插入效率。它的基本思想是将要存储的数据元素通过哈希函数映射到一个固定的位置上，然后在该位置上进行查找或插入操作
  ```

- 为什么使用散列表

  ```
  答：散列表之所以被广泛使用，是因为它可以支持常数级别的查询、插入和删除操作，这使得它非常适合于处理大规模数据和实时数据的场景。例如，在搜索引擎中，需要对数十亿条数据进行快速检索，散列表就是一种很好的选择。
  ```

- 拉链寻址和开放寻址的区别

  ```
  答：散列表的主要问题是哈希冲突，在不同的键被映射到同一个位置上时，就会产生哈希冲突。为了解决哈希冲突，常见的方法有拉链法和开放寻址。
  
  拉链法是指在哈希表中的每个位置上维护一个链表，当多个键映射到同一个位置时，它们会被保存在该位置对应的链表上。查找某个键时，先根据哈希函数计算出该键在哈希表中的位置，然后在该位置对应的链表上进行查找。
  
  开放寻址是指当发生哈希冲突时，通过探测（probing）寻找哈希表中下一个空的位置，直到找到可以存储该键的位置或者遍历了整个哈希表。具体的探测方法包括线性探测、二次探测、双重哈希等。查找某个键时，计算该键在哈希表中的位置，并在该位置及其后续位置上进行查找。
  ```

- 还有其他什么方式可以解决散列哈希索引冲突

  ```
  答：除了拉链法和开放寻址，还有一些其他方式可以解决哈希冲突，如再哈希法、建立公共溢出区等。
  ```

- 对应的Java源码中，对于哈希索引冲突提供了什么样的解决方案

  ```
  答：在 Java 中，对于哈希索引冲突，一般使用拉链法来处理。Java 的 HashMap 和 Hashtable 都采用了拉链法，并支持动态扩容和缩容，以适应不同的数据规模。同时，为了提高查询效率，在 Java 8 中，HashMap 还引入了红黑树，用于优化链表长度过长的情形。
  ```

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！