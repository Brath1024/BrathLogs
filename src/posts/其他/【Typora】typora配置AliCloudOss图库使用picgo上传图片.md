---
date: 2022-08-20 23:19:08

title: Typora使用gitee作为图库用picgo上传图片的教程~
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



## 前言

- 这一年，写的博客也多，总是需要**插入图片**的，图片存在本地的话上传到博客网站去就没法显示了，就算一个图一个图的复制粘贴上去，想移植到其他的博客网站，图就会失效，为了解决这个问题，这篇文章就诞生了！
- 首先，还是一如既往的推荐别人是怎么搞的！
- 参考文章如下：
- [《Typora上传图片到CSDN——PicGo + Gitee(码云)实现markdown免费图床——开局第一篇》](https://link.zhihu.com/?target=https%3A//blog.csdn.net/make_11111111/article/details/104839492)
- [《markdown笔记神器Typora如何上传图片？（图床功能）](https://link.zhihu.com/?target=https%3A//segmentfault.com/a/1190000022535154)
- [《一文教你用Typora + Gitee(码云) + PicGo 实现 云 markdown笔记》](https://link.zhihu.com/?target=https%3A//www.codenong.com/cs106528795/)



## 环境配置预览

- 安装nodejs：[https://nodejs.org/en/](https://link.zhihu.com/?target=https%3A//nodejs.org/en/)
- Gitee账户：[https://gitee.com/](https://link.zhihu.com/?target=https%3A//gitee.com/)
- Typora软件:[https://www.typora.io/#windows](https://link.zhihu.com/?target=https%3A//www.typora.io/%23windows)
- PicGo:[https://molunerfinn.com/PicGo/](https://link.zhihu.com/?target=https%3A//molunerfinn.com/PicGo/)
- 

## 01.安装nodejs

请百度自行安装，不过多介绍 

node和npm环境检测：

```text
C:\>node -v
v14.16.0

C:\>npm -v
6.14.11
```

## 02.Gitee账户配置

## 新建仓库



![img](https://brath.cloud/blogImg/v2-2fe1a9ce620e81b91401ea878be94548_720w.jpg)





![img](https://brath.cloud/blogImg/v2-02b0a2c63381b110e5bdc4ac994bd274_720w.jpg)



## 私人令牌token配置获取

- 找到`设置`->`安全设置`->`私人令牌`，点击生成新令牌



![img](https://brath.cloud/blogImg/v2-5493431b257b8313f420cd1c456d5550_720w.jpg)



- 选择下面的选项即可！



![img](https://brath.cloud/blogImg/v2-06263bbbc624e2b9d5d3782cad1f68b3_720w.jpg)



- 点击提交，账户安全验证即可



![img](https://brath.cloud/blogImg/v2-a9ab747329a35bc374101fe870a48084_720w.jpg)



- 保存后面生成的私人令牌



![v2-cf484c849d232aaf07e91460899b0a0e_720w](https://brath.cloud/blogImg/v2-cf484c849d232aaf07e91460899b0a0e_720w.jpg)



- gitee配置到此完毕！

## 03.PicGo配置

## 插件安装



![img](https://brath.cloud/blogImg/v2-c6b94bdc27f8f0300673d02e4800c360_720w.jpg)



## 插件配置



![img](https://brath.cloud/blogImg/v2-599672d63434fc5cc4dff76104f21778_720w.jpg)



## 上传尝试



![img](https://brath.cloud/blogImg/v2-9cd264eef40166488ebdda103631689d_720w.jpg)



- 这里，您可以随便截图一张，剪贴板图片上传试试效果
- 图片放大看看，本文的图片是不是就在下面这里！哈哈哈！



![img](https://brath.cloud/blogImg/v2-05a45967b7af32a9f3299d93fdeab526_720w.jpg)



## 04.Typora配置

- 说实话，写这篇文章，就是想用到markdown自动上传图片，自动同步图片到各个平台！
- 废话不多说，建议直接和博主配置一样就行！



![image-20220428093756533](https://brath.cloud/blogImg/image-20220428093756533.png)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
