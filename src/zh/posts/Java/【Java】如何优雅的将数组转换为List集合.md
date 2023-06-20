---
date: 2023-01-28 13:53:40

title: 【Java】如何优雅的将数组转换为List集合
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Java】如何优雅的将数组转换为List集合



## 第一种方式(未必最佳):使用ArrayList.asList(strArray)

使用Arrays工具类Arrays.asList(strArray)方式,转换完成后,只能对List数组进行查改,不能增删,增删就会抛出[UnsupportedOperationException](https://so.csdn.net/so/search?q=UnsupportedOperationException&spm=1001.2101.3001.7020) 异常

```java
import java.util.Arrays;
import java.util.List; 
public static void Demo1() {
        String[] str = {"fgx", "lzy"};
        //注意这个List不是Collections包内的List,而是util包里面的List接口
        List<String> ints = Arrays.asList(str);
    	//这里会报错
        ints.add("laopo");
    }
```

添加数据报错:

```java
Exception in thread "main" java.lang.UnsupportedOperationException
at java.util.AbstractList.add(AbstractList.java:148)
at java.util.AbstractList.add(AbstractList.java:108)
at JAVA基础.JDK8新特性.Java数组转List.Demo1(Java数组转List.java:20)
at JAVA基础.JDK8新特性.Java数组转List.main(Java数组转List.java:13)

报错原因:Arrays.asList(str)返回值是java.util.Arrays类中一个私有静态内部类 
java.utiil.Arrays.Arraylist,并不是我们平时用的java.util.ArrayList();

使用场景:Arrays.asList(strArray)方式仅能用在将数组转换为List后，不需要增删其中的值，仅作为数据源读取使用。
```

## 第二种方法(支持增删查改):

通过ArrayList的构造器,将Arrays.asList(strArray)的返回值由java.utilArrays.ArrayList转为java.util.ArrayList.
关键代码：ArrayList list = new ArrayList(Arrays.asList(strArray)) ;

```java
  String[] str = {"fgx", "lzy"};
        //注意这个List不是Collections包内的List,而是util包里面的List接口
        java.util.ArrayList<String> strings = new ArrayList<>(Arrays.asList(str));
        strings.add("aop");
        strings.stream().forEach(System.out::println);
```

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/f33d7ecf29754253b15d6abeda2034aa.png)
使用场景:需要在将数组转换为List后，对List进行增删改查操作，在List的数据量不大的情况下，可以使用。

## 第三种方式(通过集合工具类Collections.[addAll](https://so.csdn.net/so/search?q=addAll&spm=1001.2101.3001.7020)()方法(最高效))

通过Collections.addAll(arrayList, strArray)方式转换，根据数组的长度创建一个长度相同的List，然后通过Collections.addAll()方法，将数组中的元素转为二进制，然后添加到List中，这是最高效的方法。

```java
 public static void Demo3() {
        //注意这个List不是Collections包内的List,而是util包里面的List接口
        String[] str = {"fgx", "lzy"};
        java.util.ArrayList<String> stringList = new ArrayList<>(str.length);
        Collections.addAll(stringList,str);
    }
```

## 第四种方式通过JDK8的Stream流将3总基本类型数组转为List

如果JDK版本在1.8以上,使用流stream来将下列3种数组快速转为List,分别是int[],long[],double[],不支持short[ ],byte[ ],char[]在JDK1.8中暂不支持.

```java
 int[] ints = {2, 34, 55, 22, 11};
        long[] longs = {1, 2, 3};
        double[] doubles = {1, 2, 3};
        Arrays.stream(ints).boxed().collect(Collectors.toList());
        Arrays.stream(longs).boxed().collect(Collectors.toList());
        Arrays.stream(doubles).boxed().collect(Collectors.toList());
```

TIPs:为什么int[]不能直接转为List,而Integer[]可以转为List,而Integer[]就可以转为List了,因为List中的[泛型](https://so.csdn.net/so/search?q=泛型&spm=1001.2101.3001.7020)必须是引用类型。

**java数组转list误区**
**一、不能把基本数据类型转化为列表**
仔细观察可以发现asList接受的参数是一个泛型的变长参数，而基本数据类型是无法泛型化的，如下所示：

```java
public  class  App {
   public  static  void  main(String[] args) {
     int [] intarray = { 1 ,  2 ,  3 ,  4 ,  5 };
     //List<Integer> list = Arrays.asList(intarray); 编译通不过
     List< int []> list = Arrays.asList(intarray);
     System.out.println(list);
   }
}

output：
[[I @66d3c617 ]
```

这是因为把int类型的数组当参数了，所以转换后的列表就只包含一个int[]元素。
解决方案：
要想把基本数据类型的数组转化为其包装类型的list，可以使用guava类库的工具方法，示例如下：

```java
int [] intArray = { 1 ,  2 ,  3 ,  4 };
List<Integer> list = Ints.asList(intArray);
```

**二、asList方法返回的是数组的一个视图**
视图意味着，对这个list的操作都会反映在原数组上，而且这个list是定长的，不支持add、remove等改变长度的方法。

```java
public  class  App {
   public  static  void  main(String[] args) {
     int [] intArray = { 1 ,  2 ,  3 ,  4 };
     List<Integer> list = Ints.asList(intArray);
     list.set( 0 ,  100 );
     System.out.println(Arrays.toString(intArray));
     list.add( 5 );
     list.remove( 0 );
   }
}

output：
[ 100 ,  2 ,  3 ,  4 ]
UnsupportedOperationException
UnsupportedOperationException
```
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
