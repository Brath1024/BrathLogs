---
date: 2022-10-17 13:23:03

title: 【Java】使用 Java 8 中的 Stream ，可以让你写代码事半功倍

---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【Java】使用 Java 8 中的 Stream ，可以让你写代码事半功倍



# Stream

Java 8 中一个主要的新功能是引入了流（Stream）功能。在`java.util.stream`中包含用于处理元素序列的类。其中，最重要的类是`Stream<T>`。下面我们就来看看如何使用现有的数据源创建流。

## 创建Stream

可以使用 `stream()` 和 `of()` 方法从不同的数据源（例如：集合、数组）创建流：

```java
String[] arr = new String[]{"面", "试", "记};
Stream<String> stream = Arrays.stream(arr);
stream = Stream.of("面", "试", "记");
123
```

`Collection` 接口新增了一个 `stream()` 默认方法，允许使用任何集合作为数据源来创建 `Stream<T>`：

```java
List<String> list = new ArrayList();
list.add("面");
list.add("试");
list.add("记");
Stream<String> stream = list.stream();
```

## 在多线程中使用Stream

Stream 还通过提供 `parallelStream()` 方法来简化多线程操作，该方法以并行模式运行对流元素的操作。

下面的代码可以对流的每个元素并行运行 `doWork()` 方法：

```java
List<String> list = new ArrayList();
list.add("面");
list.add("试");
list.add("记");
list.parallelStream().forEach(element -> doWork(element));
```

接下来，我们将介绍一些基本的 Stream 操作。

# Stream 操作

在流上可以执行许多有用的操作。它们被分为中间操作（返回 `Stream<T>`）和终端操作（返回明确定义类型的结果），中间操作允许链接。

我需要注意的是，流上的操作不会改变数据源。

下面是一个简单的例子：

```java
List<String> list = new ArrayList();
list.add("面");
list.add("试");
list.add("记");
long count = list.stream().distinct().count();
```

在上面的例子中，`distinct()` 方法表示一个中间操作，它创建了前一个流的唯一元素的新流。而 `count()` 方法是一个终端操作，它返回流的大小。

## 迭代

Stream 帮助我们替代了 for、for-each 和 while 循环。它可以让我们把精力集中在操作的逻辑上，而不是在迭代元素序列上。

比如下面的代码：

```java
for (String string : list) {
    if (string.contains("试")) {
        return true;
    }
}
```

这段代码只需要一行 Stream 代码就可以实现:

```java
boolean isExist = list.stream().anyMatch(element -> element.contains("试"));
```

## 过滤

`filter()` 方法可以让我们选择满足谓词条件的元素流。

比如下面的代码：

```java
List<String> list = new ArrayList();
list.add("面");
list.add("试");
list.add("记");
Stream<String> stream = list.stream().filter(element -> element.contains("试"));
```

在上面的例子中，创建了一个 `List<String>` 的 `Stream<String>`，查找该流中所有包含字符“试”的元素，并创建一个只包含筛选后元素的新流。

## 映射

为了通过将特殊函数应用于流元素来转换它们，并将这些新元素收集到流中，我们可以使用 `map()` 方法。

比如下面的代码：

```java
List<String> list = new ArrayList();
list.add("1");
list.add("2");
list.add("3");
Stream<Integer> stream = list.stream().map(str -> Integer.valueOf(str));
```

在上面的例子中，通过对初始流的每个元素应用特定的 lambda 表达式将 `Stream<String>` 转换为 `Stream<Integer>`。

如果您有一个流，其中每个元素都包含其自己的元素序列，并且您想创建这些内部元素的流，则应使用 `flatMap()` 方法。

比如下面的代码：

```java
public class Writer {
	private String name;
	private List<String> books;
}

List<Writer> writers = new ArrayList<>();
writers.add(new Writer());
Stream<String> stream = writers.stream().flatMap(writer -> writer.getBooks().stream());
```

在上面的例子中，我们有一个类型为 `Writer` 的元素列表。`Writer` 类包含一个类型为 `List<String>` 的字段 `books`。使用 [flatMap](https://so.csdn.net/so/search?q=flatMap&spm=1001.2101.3001.7020)() 方法，字段 `books` 中的每个元素将被提取并添加到新的结果流中。之后，最开始的 Stream 将会丢失。

## 匹配

Stream 提供了一组方便的工具，根据一些谓词验证一个序列的元素。我们可以使用以下方法之一：

- `anyMatch()`：只要有一个条件满足即返回true
- `allMatch()`：必须全部都满足才会返回true
- `noneMatch()`：全都不满足才会返回true

它们都返回 boolean 的终端操作。

比如下面的代码：

```java
List<String> list = new ArrayList();
list.add("面");
list.add("试");
list.add("记");
list.stream().anyMatch(element -> element.contains("面")); // true
list.stream().allMatch(element -> element.contains("面")); // false
list.stream().noneMatch(element -> element.contains("面")); // false
```

对于空的 Stream，无论给定的谓词是什么，allMatch() 方法都将返回 true：

```java
Stream.empty().anyMatch(Objects::nonNull); // false
```

这是一个合理的值，因为我们找不到不满足谓词的任何元素。

同样地，对于空的 Stream，[anyMatch](https://so.csdn.net/so/search?q=anyMatch&spm=1001.2101.3001.7020)() 方法总是返回 false：

```java
Stream.empty().anyMatch(Objects::nonNull); // false
```

同样地，这也是合理的，因为我们找不到满足这个条件的元素。

## 合并

我可以使用类型为 Stream 的 `reduce()` 方法，根据指定的函数将一系列元素合并为某个值。这个方法有两个参数：第一个是起始值，第二个是[累加器](https://so.csdn.net/so/search?q=累加器&spm=1001.2101.3001.7020)函数。

比如下面的代码：

```java
List<Integer> integers = Arrays.asList(1, 2, 3);
Integer reduced = integers.stream().reduce(4, (a, b) -> a + b);
```

在上面的例子中，有一个 `List<Integer>`，我们将这些元素加起来，并加上一个初始的整数（在这个例子中是4）。那么，运行以下代码的结果是10（4 + 1 + 2 + 3）。

## 收集

在 Stream 类型中，也可以通过 `collect()` 方法来进行收集。这个操作非常方便，可以将一个流转换为 `Collection` 或 `Map`，也可以将一个流表示为单个字符串。`Collectors` 是一个实用类，提供了几乎所有典型的收集操作的解决方案。对于一些不太常见的任务，可以创建自定义的收集器。

下面的代码使用终端操作 `collect()` 将 `Stream<String>` 转换为 `List<String>`。

```java
List<String> resultList 
  = list.stream().map(element -> element.toUpperCase()).collect(Collectors.toList());
```

# 最后

Stream 的高级示例非常丰富，本文的目的是为了让我们快速了解 Stream 功能的用法，并启发我们继续探索和深入记习。

Stream 是 Java 8 中非常强大和实用的 API，它为开发人员提供了一种更加简便的方式来处理数据。希望我们通过本文的介绍和示例，可以快速上手使用 Stream，并继续深入记习和探索。



## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！