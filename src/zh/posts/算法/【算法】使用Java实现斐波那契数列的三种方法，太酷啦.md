---
date: 2022-04-26 12:23:33

title: 【算法】使用Java实现斐波那契数列的三种方法，太酷啦
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【算法】使用Java实现斐波那契数列的三种方法，太酷啦

## Java实现[斐波那契](https://so.csdn.net/so/search?q=斐波那契&spm=1001.2101.3001.7020)数列的三种方法

**什么是斐波那契数列**

- 这里借用一下度娘的一段话：斐波那契数列（Fibonacci sequence），又称黄金分割数列、因数学家列昂纳多·斐波那契（Leonardoda Fibonacci）以兔子繁殖为例子而引入，故又称为“兔子数列”，指的是这样一个数列：1、1、2、3、5、8、13、21、34、……
  其规律很明显，从第3个数开始，每个数都等于它前两个数的和。
  那么通过java可以如何实现斐波那契数列呢？这里介绍三种方法。
- 通过代码实现以下效果：当你输入n时，会获取斐波那契数列的第n个数的值。

#### **1.for循环实现**

```java
public static int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }

   	int[] fib = new int[n+1];
   	fib[0] = 0;
   	fib[1] = 1;

    for (int i = 2; i <= n; i++) {
       fib[i] = fib[i-1] + fib[i-2];
    }

    return fib[n];
}
```

#### **2.平方根实现**

```java
public static int fibonacci(int n) {
     double goldenRatio = (1 + Math.sqrt(5)) / 2;
     return (int) Math.round(Math.pow(goldenRatio, n) / Math.sqrt(5));
}
```

#### 3.矩阵快速幂实现

```java
public static int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }

    int[][] base = {{1, 1}, {1, 0}};
    int[][] result = pow(base, n - 1);

    return result[0][0];
}

private static int[][] pow(int[][] base, int power) {
    int[][] result = new int[base.length][base.length];
    for (int i = 0; i < base.length; i++) {
        result[i][i] = 1;
    }

    while (power > 0) {
        if (power % 2 == 1) {
            result = multiply(result, base);
        }
        base = multiply(base, base);
        power /= 2;
    }

    return result;
}

private static int[][] multiply(int[][] a, int[][] b) {
    int[][] c = new int[a.length][b[0].length];
    for (int i = 0; i < a.length; i++) {
        for (int j = 0; j < b[0].length; j++) {
            for (int k = 0; k < b.length; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return c;
}
```

OK，到这里java实现斐波那契数列的三种写法就全部写完了，如果大家还有其他方法，欢迎交流~



## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！