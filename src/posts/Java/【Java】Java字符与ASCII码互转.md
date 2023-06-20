---
date: 2023-02-23 23:57:03

title: 【Java】Java字符与ASCII码互转
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【Java】Java字符与ASCII码互转

字符转对应[ASCII码](https://so.csdn.net/so/search?q=ASCII码&spm=1001.2101.3001.7020)

```java
// 方法一：将char强制转换为byte
char ch = 'A';
byte byteAscii = (byte) ch;
System.out.println(byteAscii);

// 方法二：将char直接转化为int，其值就是字符的ascii
int byteAscii1 = (int) ch;
System.out.println(byteAscii1);
```

ASCII码转字符

```java
// 直接int强制转换为char
int ascii = 65;
char ch1 = (char)ascii;
System.out.println(ch1);
```

应用实例

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.regex.Pattern;

/**
 * HJ21 简单密码
 *
 * 描述
 * 现在有一种密码变换算法。
 * 九键手机键盘上的数字与字母的对应： 1--1， abc--2, def--3, ghi--4, jkl--5, mno--6, pqrs--7, tuv--8 wxyz--9, 0--0，把密码中出现的小写字母都变成九键键盘对应的数字，如：a 变成 2，x 变成 9.
 * 而密码中出现的大写字母则变成小写之后往后移一位，如：X ，先变成小写，再往后移一位，变成了 y ，例外：Z 往后移是 a 。
 * 数字和其它的符号都不做变换。
 * 数据范围： 输入的字符串长度满足 1≤n≤100
 * 输入描述：
 * 输入一组密码，长度不超过100个字符。
 *
 * 输出描述：
 * 输出密码变换后的字符串
 *
 * 示例1
 * 输入：
 * YUANzhi1987
 * 输出：
 * zvbo9441987
 */
public class HJ21Test {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.next();

        Map<Integer, String> map = new HashMap<>();
        map.put(1, "1");
        map.put(2, "abc");
        map.put(3, "def");
        map.put(4, "ghi");
        map.put(5, "jkl");
        map.put(6, "mno");
        map.put(7, "pqrs");
        map.put(8, "tuv");
        map.put(9, "wxyz");
        map.put(0, "0");

        char[] chars = input.toCharArray();
        int length = chars.length;

        StringBuilder builder = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int finalI = i;
            map.forEach((k, v) -> {
                if (v.contains(String.valueOf(chars[finalI]))) {
                    builder.append(k);
                }
            });

            int u = chars[finalI];
            if (u >= 65 && u <= 90) {
                int i1 = u + 33;
                if (i1 == 123 ) {
                    builder.append("a");
                } else {
                    char ch = (char) (u + 33);
                    builder.append(ch);
                }
            }
            Pattern pattern = Pattern.compile("[2-9]");
            if (pattern.matcher(String.valueOf(chars[finalI])).matches()) {
                builder.append(chars[i]);
            }
        }

        System.out.println(builder);

    }
}
```

运行结果
![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/7919845b2d094760963faf40cd23cbde.png)



## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！

