---
date: 2023-03-07 10:12:13

title: 【chatGPT】利用腾讯云函数免费部署国内直接使用ChatGPT代理，解决网络不可用及1020等问题
---

# 【chatGPT】利用腾讯云函数免费部署国内直接使用ChatGPT代理，解决网络不可用及1020等问题

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

## 前言

在Github上发现一个项目，可以利用腾讯云提供的云函数，一分钟就能搭建好一台可以直接访问ChatGPT 的代理，关键还是免费的。今天就来一起折腾它。



## 项目

项目地址：https://github.com/geekr-dev/openai-proxy



## 教程

可以直接看官方文字教程，如果是新手，可以按我图文教程

##### 第一步：

​	登录腾讯控制台：https://console.cloud.tencent.com/scf/list

​	如果之前没使用腾讯云函数，会提示授权

![image-20230420085936706](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230420085936706.png)

##### 第二步：前往访问管理

​	![image-20230420085957003](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230420085957003.png)

##### 第三步：新建函数，记得选择**非大陆**地区哟

![image-20230420090015818](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230420090015818.png)

![image-20230420090031428](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230420090031428.png)

##### 上传Github项目中的ZIP文件

##### 第四步：高级配置

上传完ZIP文件，接着下拉，找到高级配置，点进去编辑![image-20230420090114681](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230420090114681.png)



点高级配置的最右边的编辑按钮

![image-20230420090132944](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230420090132944.png)





![image-20230420090140465](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230420090140465.png)

##### 第五步：获取代理地址

![image-20230420090255336](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230420090255336.png)



不要"/release" 路径，只要取子域名部分就可以了

![image-20230420090309398](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230420090309398.png)



这时候访问路径内容和api.open.com的结果是一至的了。

**至此：已经有了海外域名的代理地址了。**



## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！



















