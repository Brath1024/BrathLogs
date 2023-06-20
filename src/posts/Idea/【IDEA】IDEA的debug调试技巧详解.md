---
date: 2023-05-05 09:57:09

title: 【IDEA】IDEA的debug调试技巧详解
---
![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【IDEA】IDEA的debug调试技巧详解（转自CSDN）


目录

[一、概述](#%E4%B8%80%E3%80%81%E6%A6%82%E8%BF%B0)

[二、debug操作分析](#%E4%BA%8C%E3%80%81debug%E6%93%8D%E4%BD%9C%E5%88%86%E6%9E%90)

[1、打断点](#1%E3%80%81%E6%89%93%E6%96%AD%E7%82%B9)

[2、运行debug模式](#2%E3%80%81%E8%BF%90%E8%A1%8Cdebug%E6%A8%A1%E5%BC%8F)

[3、重新执行debug](#3%E3%80%81%E9%87%8D%E6%96%B0%E6%89%A7%E8%A1%8Cdebug)

[4、让程序执行到下一次断点后暂停](#4%E3%80%81%E8%AE%A9%E7%A8%8B%E5%BA%8F%E6%89%A7%E8%A1%8C%E5%88%B0%E4%B8%8B%E4%B8%80%E6%AC%A1%E6%96%AD%E7%82%B9%E5%90%8E%E6%9A%82%E5%81%9C)

[5、让断点处的代码再加一行代码](#5%E3%80%81%E8%AE%A9%E6%96%AD%E7%82%B9%E5%A4%84%E7%9A%84%E4%BB%A3%E7%A0%81%E5%86%8D%E5%8A%A0%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81)

[6、停止debug程序](#6%E3%80%81%E5%81%9C%E6%AD%A2debug%E7%A8%8B%E5%BA%8F)

[7、显示所有断点](#7%E3%80%81%E6%98%BE%E7%A4%BA%E6%89%80%E6%9C%89%E6%96%AD%E7%82%B9)

[8、添加断点运行的条件](#8%E3%80%81%E6%B7%BB%E5%8A%A0%E6%96%AD%E7%82%B9%E8%BF%90%E8%A1%8C%E7%9A%84%E6%9D%A1%E4%BB%B6)

[9、屏蔽所有断点](#9%E3%80%81%E5%B1%8F%E8%94%BD%E6%89%80%E6%9C%89%E6%96%AD%E7%82%B9)

[10、把光标移到当前程序运行位置](#10%E3%80%81%E6%8A%8A%E5%85%89%E6%A0%87%E7%A7%BB%E5%88%B0%E5%BD%93%E5%89%8D%E7%A8%8B%E5%BA%8F%E8%BF%90%E8%A1%8C%E4%BD%8D%E7%BD%AE)

[11、单步跳过](#11%E3%80%81%E5%8D%95%E6%AD%A5%E8%B7%B3%E8%BF%87)

[12、可以跳入方法内部的执行一行代码操作](#12%E3%80%81%E5%8F%AF%E4%BB%A5%E8%B7%B3%E5%85%A5%E6%96%B9%E6%B3%95%E5%86%85%E9%83%A8%E7%9A%84%E6%89%A7%E8%A1%8C%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81%E6%93%8D%E4%BD%9C)

[13、跳出方法](#13%E3%80%81%E8%B7%B3%E5%87%BA%E6%96%B9%E6%B3%95)

[14、直接执行到光标所在位置](#14%E3%80%81%E7%9B%B4%E6%8E%A5%E6%89%A7%E8%A1%8C%E5%88%B0%E5%85%89%E6%A0%87%E6%89%80%E5%9C%A8%E4%BD%8D%E7%BD%AE)

[15、在控制台改变正在debug的数据](#15%E3%80%81%E5%9C%A8%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%94%B9%E5%8F%98%E6%AD%A3%E5%9C%A8debug%E7%9A%84%E6%95%B0%E6%8D%AE)

------------------------------------------------------------------------

# 一、概述

-   debug调试也叫断点调试
-   在程序的某一行打上断点，则在debug模式下运行到断点位置时会暂停，便于程序员观察代码的执行情况
-   学会debug，有助于在程序运行未达到理想情况时，对程序的各个流程进行分析
-   本文只详细描述了debug的一些基本的常用操作，如果有缺漏欢迎评论区留言\~

# 二、debug操作分析

## 1、打断点

-   在程序的某一行位置，数字右边的空白部分使用鼠标左键点击一下，出现红点即为打上了一个断点

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/9e3026905fcd4c7a9a7b0dce93f324e9.png" width="422" height="362" />

## 2、运行debug模式

-   方式一
    -   选中要进行debug的程序，点击右上角的debug按钮

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/f52559e407cf4dd9af9438fc616abca5.png" width="288" height="82" />

-    方式二
    -   在要进行debug的程序处右键，选中下图选项

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/a703e498d8dc4e91be40b3ba06a7a5be.png" width="386" height="449" />

## 3、重新执行debug

-   点击下图按钮，会关闭当前debug的程序并重新启动debug

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/6a18ce960271427892dbc4a8df8e568d.png" width="832" height="308" />

## 4、让程序执行到下一次断点后暂停

-   点击下图的按钮，debug会继续运行程序，直到遇到下一次断点后暂停

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/5347586e6a414e7fbacc2863e4e7f44d.png" width="851" height="301" />

-    举例
    -   下图是一个循环操作，在打断点的位置点击上面说的按钮，相当于再循环一次，到代码第9行时停止

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/4653841c52c54a3183914354054609dd.png" width="818" height="336" />

## 5、让断点处的代码再加一行代码

-   点击下图的加号，可以在断点处加一行代码，比如下图中的count++即为新添加的代码
    -   选中count++，右键点击Edit可以编辑该代码
    -   选中该行代码（count++），点击加号下面的减号，可以删除该行代码

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/b7843e76b1b64b488e93c9cd8b6e72a6.png" width="865" height="266" />

-   选中下图的眼镜，变为分屏操作

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/ac95d9ee4ebb4c2c8e573e623e34f779.png" width="1200" height="324" />

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/18ec87566c3340689daa95295557fa12.png" width="1200" height="302" />

------------------------------------------------------------------------

**举例**

-   下图是没添加额外代码之前的截图

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/155c34d01574452f9924b608cb26a642.png" width="1163" height="567" />

-    添加一句count++，并点击左边红色框中的按钮，执行到下一次断点，即循环了一次

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/33ebf61346304b9c9679c6f836ed99b7.png" width="1139" height="659" />

-    效果和运行步骤见下图 

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/0994f7950ff1421ca6cf4116e1fafe23.png" width="1200" height="666" />

## 6、停止debug程序

-   点击下图按钮停止debug程序
-   注意
    -   运行的如果是javaSE项目，点一下就停止
    -   运行的如果是javaWeb项目，需要点两下
        -   第一下停止代码的当前线程
        -   第二下停止服务器

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/7ce1d0c26f4a45ec9050155f0f653557.png" width="882" height="304" />

## 7、显示所有断点

-   点击下图按钮，会显示所有断点

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/5651d84b51cf45d1bab9072c4c7d1ccc.png" width="830" height="272" />

-    点击后出现下图所示界面，可以添加断点运行的条件，见下一条功能解释

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/93a8e0b13c4d45e3a4adf260d9ca24b6.png" width="1108" height="670" />

## 8、添加断点运行的条件

-   选中断点，右键后即可编辑断点运行的条件
    -   满足条件时程序才会在该断点处停下

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/e6b57eeaa0294cdf9364c2b0f6a6cb25.png" width="1006" height="513" />

-    比如添加i\>=5，重新debug后的效果如下图所示

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/82a7ffe03cd54958a8801e21eceb704a.png" width="918" height="645" />

-    此时会发现第7条显示所有断点信息处，可以看到下图效果

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/daab0ee1bfe94a329aa68db1c95f2080.png" width="1022" height="281" />

## 9、屏蔽所有断点

-   点击下图按钮，可以屏蔽所有断点

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/f7e06ed221044991be85af4fca6748f9.png" width="583" height="361" />

-   屏蔽前  
    <img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/677a8547e65844eebac684de9f46bc71.png" width="102" height="73" />
-   屏蔽后  
    <img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/46bb93d283a640df802eec5d8fd1bbab.png" width="81" height="56" />
-    屏蔽的断点在debug的时候不会运行
    -   如果程序调试后觉得没问题了，可以屏蔽掉所有断点继续运行程序查看效果

## 10、把光标移到当前程序运行位置

-   点击下图按钮后，会把鼠标光标移动到当前程序运行位置
    -   当程序代码量很大的时候，可以通过该按钮快速定位到程序运行位置

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/a44a214ccd894d52884cd8cd20e9665c.png" width="617" height="245" />

-    如下图所示
    -   假设程序运行到第9行断点处，鼠标光标在第11行，点击该按钮后光标就会移动到第9行

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/15566342c22e47b390f7922e06c080e9.png" width="648" height="129" />

## 11、单步跳过

-   点击下图按钮，会一行一行执行自己编写的代码
    -   如果碰到方法，该按钮不会进入到该方法内部
    -   快捷键F8 

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/1c54b8240f6e4d719f8aae936a925fb2.png" width="544" height="201" />

## 12、可以跳入方法内部的执行一行代码操作

-   下图中的蓝色箭头和红色箭头都可以执行一行代码，如果遇到方法时会进入方法内部，区别在于
    -   蓝色箭头只会跳进自己写的方法，如果是系统已经写好的方法，蓝色箭头无法跳入该方法
    -   红色箭头不管是自己写的方法，还是系统已经定义好的方法，都可以跳入方法内部

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/23a065624b024b29ba358d96c1e827eb.png" width="852" height="271" />

-    如下图所示
    -   ArrayList的add方法是系统已经写好的，蓝色箭头无法跳入方法内部，但是红色箭头可以跳入方法内部
    -   printMessage（）是自定义方法，红色和蓝色箭头都可以跳入该方法内部

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/f24471618ac74e69842c047606635c13.png" width="811" height="762" />

## 13、跳出方法

-   下图的两个按钮都可以跳出方法
    -   第二个按钮是关闭窗口的意思，同样可以起到跳出方法的作用
    -   在进入方法内部的时候使用这两个按钮

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/0deedd480bd94b0f9d93aab8bc5d33d1.png" width="514" height="238" />

## 14、直接执行到光标所在位置

-   点击下图的按钮，程序会执行到光标所在的位置
    -   前提是光标前面没有断点，否则程序还是会在光标前面的断点处暂停

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/75d500280cad4a7497a31bb49c1a73a4.png" width="616" height="247" />

## 15、在控制台改变正在debug的数据

-   在控制台选中某个变量，右键点击Set Value可以改变该变量的值
    -   如果想测试某个地方的数据如果是正确的会是什么效果，可以手动更改该处变量的值

<img src="https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/9fcd3a72eebf47a9be694fabec9549cd.png" width="1003" height="304" />

补充：debug调试看代码时，一般用F9跳到下一个断点，打断点的目的是你想看程序执行到这个位置时会有什么效果，或者是到达断点的位置后再继续往下看实现的过程；用F7去跳进方法内部，看具体的实现细节；用F8去看当前位置代码往下的执行情况（不跳入具体方法的内部）



#### 原文链接：https://blog.csdn.net/future_god_qr/article/details/121250865




## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！