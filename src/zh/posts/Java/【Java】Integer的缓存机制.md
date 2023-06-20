---
date: 2022-03-11 04:30:32

title: 【Java】Integer的缓存机制
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# Integer的缓存机制

### 文章目录

- [一 现象](#__1)
- [二 Integer的缓存机制](#_Integer_19)
- - [2.1 自动装箱等效于valueOf](#21_valueOf_20)
  - [2.2 valueOf](#22_valueOf_29)
  - [2.3 IntegerCache](#23_IntegerCache_39)
- [三 为什么要有缓存机制](#__76)
- - [3.1 原因](#31__77)
  - [3.2 其他包装对象的缓存](#32__79)



# 一 现象

在引入Integer的缓存机制前，可以先判断一下以下几种情况

```java
	    # 一：自动装箱
        Integer s1 = 2;
        Integer s2 = 2;
        System.out.println(s1 == s2);
        # 答案为true
       	
		# 二：
		Integer s1 = new Integer(2);
		Integer s2 = new Integer(2);
		System.out.println(s1 == s2);
		# 答案为false

```

情况二很好理解，虽然传值相同，但是Integer是[包装类](https://so.csdn.net/so/search?q=包装类&spm=1001.2101.3001.7020)，不同对象的引用地址是不一样的，而“==” 比的是引用地址，那为什么情况一中会得到结果true
这里就不得不提到Integer的缓存机制了

# 二 Integer的缓存机制

## 2.1 自动装箱等效于valueOf

```java
#以上代码的情况一的自动装箱等效于Integer中的ValueOf()方法，如下：
	Integer s1 = Integer.valueOf(2);
	Integer s2 = Integer.valueOf(2);
	System.out.println(s1 == s2);
```

## 2.2 valueOf

以下是valueOf()方法的具体实现

```java
   public static Integer valueOf(int i) {
        if (i >= IntegerCache.low && i <= IntegerCache.high)
            return IntegerCache.cache[i + (-IntegerCache.low)];
        return new Integer(i);
    }
```

可以看见，其实现方式和IntegerCache有关

## 2.3 IntegerCache

IntegerCache是[Interger](https://so.csdn.net/so/search?q=Interger&spm=1001.2101.3001.7020)的一个静态内部类，实现如下：

```java
private static class IntegerCache {
        static final int low = -128;
        static final int high;
        static final Integer cache[];

        static {
            // high value may be configured by property
            int h = 127;
            String integerCacheHighPropValue =
                sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
            if (integerCacheHighPropValue != null) {
                try {
                    int i = parseInt(integerCacheHighPropValue);
                    i = Math.max(i, 127);
                    // Maximum array size is Integer.MAX_VALUE
                    h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
                } catch( NumberFormatException nfe) {
                    // If the property cannot be parsed into an int, ignore it.
                }
            }
            high = h;

            cache = new Integer[(high - low) + 1];
            int j = low;
            for(int k = 0; k < cache.length; k++)
                cache[k] = new Integer(j++);

            // range [-128, 127] must be interned (JLS7 5.1.7)
            assert IntegerCache.high >= 127;
        }
```

可以看到，默认情况下，该[静态内部类](https://so.csdn.net/so/search?q=静态内部类&spm=1001.2101.3001.7020)会直接缓存-127到128的Integer对象，因此，在valueOf()方法中，如果值在-127-128之间，都会直接返回缓存中的该对象而不会重新生成对象，引用地址当然相同了。
而且java5引入时，该范围还是固定的，而在java6之后，Integer的缓存中还可以通过Integer.IntegerCache.high来设置最大值。由于这个缓存机制，程序中第一次使用Integer的时候还需要一定的时间家长该缓存类

# 三 为什么要有缓存机制

## 3.1 原因

因为我们常见的基本数据类型中，使用包装类包装数值时会创建大量对象，如果没有缓存的话，会有大量的包装类被创建，占用内存，降低效率。选择最常用的数值范围设置缓存机制，就可以优化这一现象

## 3.2 其他包装对象的缓存

既然缓存机制的原因我们知道了，那除了Integer之外，其他包装类有这种缓存机制吗？肯定是有的

- ByteCache：缓存Byte对象
- ShortChche：缓存Short对象
- LongChche：缓存Long对象
- CharacterChche：缓存Character对象
  Byte，Short，Long的缓存范围都是-128-127，Character的缓存范围是0-127，除了Integer，其他的缓存范围都是固定的
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
