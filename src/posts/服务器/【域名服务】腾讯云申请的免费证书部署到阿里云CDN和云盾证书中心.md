---
date: 2022-08-28 11:58:30

title: 腾讯云申请的免费证书部署到阿里云CDN和云盾证书中心
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



### 腾讯云申请的免费证书部署到阿里云CDN和云盾证书中心

tips：以下内容仅支持有域名的小伙伴配置，没有域名请先申请域名



小伙伴们在有了自己的不知道如何部署HTTPS？请看下面的操作

​	为什么不在阿里云申请SSL证书

​	答：阿里云免费证书很慢，而且付费的超级贵



所以本教程让大家在腾讯云官方申请SSL证书，注意：有效期只能为1年，过期不续费，只能重新申请和配置



1.进入腾讯云证书官网： https://console.cloud.tencent.com/ssl

2.点击申请免费证书

![image-20230211101221781](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20230211101221781.png)



3.输入绑定的域名、校验方式选择自动DNS验证、邮箱填写常用邮箱![image-20230211101232921](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20230211101232921.png)

点击提交申请，等待校验通过



4.申请通过后会颁发证书

![image-20230211101359187](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20230211101359187.png)



5.点击右侧下载，选择Nginx证书压缩包

![image-20230211101422722](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20230211101422722.png)

解压缩后可以看见如下文件

![image-20230211101454344](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20230211101454344.png)



6.进入阿里云 云盾证书管理 https://yundunnext.console.aliyun.com/?spm=5176.11785003.domainDetail.14.4251142fPqrVnU&p=cas#/certExtend/upload

点击上传证书

![image-20230211101539890](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20230211101539890.png)

![image-20230211101638094](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20230211101638094.png)

![image-20230211101727709](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20230211101727709.png)

点击确定后上传成功。



接下来就可以在阿里云使用你在腾讯云申请的证书来支持你的CDN HTTPS服务拉！

![image-20230211101919544](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20230211101919544.png)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
