---
date: 2023-03-04 20:23:03

title: 【chatGPT】基于Docker如何快速部署自己的ChatGPT
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 基于Docker如何快速部署自己的ChatGPT

## 背景

随着[OpenAI](https://so.csdn.net/so/search?q=OpenAI&spm=1001.2101.3001.7020)在2022年底发布的LLM模型-ChatGPT展现出的强大效果，ChatGPT无疑成为了当下炙手可热的明星模型。

现有的基于[GPT](https://so.csdn.net/so/search?q=GPT&spm=1001.2101.3001.7020)的开源项目已经非常多，本文以现有的高热度github开源项目[chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web)为例，教大家简单快速地搭建属于自己的ChatGPT。

## ChatGPT-Web

chatgpt-web项目中的部署教程已经非常完整，本文不再过多解释。

仅以Docker部署为例

前置条件

- 本地或者服务器应该具有Docker环境
- 具有ChatGPT帐号

以token模式为例，请求chatgpt web版本，免费但稍微具有延迟

**Step1. 找到你帐号的token**

点击https://chat.openai.com/api/auth/session，获取你帐号的token，并记录他

**Step2. 运行docker**

按需配置访问Web页面的密码，Token、超时等信息

```bash
docker run --name chatgpt-web -d -p 127.0.0.1:3888:3002 --env OPENAI_ACCESS_TOKEN=your_access_token --env AUTH_SECRET_KEY=you_secret_key chenzhaoyu94/chatgpt-web
1
```

**Step3. 访问localhost:3002查看效果**
![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/b6ea40d61cb741129cc1d98af9633d18.png)
在上述步骤中我们无需进行任何代理，就可以直接与GPT交流，使用API方式同理。当然了，根据项目作者的介绍，**使用API时需要进行代理自建**。

如果你只是在本地部署给自己使用，那么以上3步就满足了需求，如果想要在公网访问，或者像App一样访问你的ChatGPT，那么请接着往下看。

## Nginx反向代理

以宝塔面板为例，我们在服务器上拉起docker镜像后，可以通过`ip:port`进行访问

但通常来说我们的网站带有域名，以笔者所使用的腾讯云服务器为例

前置条件

- 拥有一个域名
- 拥有一台云服务器

**Step1. SSL证书**

首先在云产品中找到SSL证书，点击我的证书-免费证书-申请免费证书

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/34d88a1248ea4158ba5e2e6a07ab0a67.png)

填写申请的域名，申请成功之后，点击下载，下载nginx格式的即可

**Step2. 配置域名SSL**

在宝塔面板中选择-网站-添加站点

填写刚刚申请SSL证书的域名，选择纯静态，其余默认，点击确定即可

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/9ece432796a34885adc258df4bc25555.png)

**Step3. 配置证书**

点击添加好的网站，然后点击SSL，填入刚刚下载的文件中的`key`和`pem`
![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/852f85f818444491bc4b8e04248b9a4b.png)

配置完成后点击保存

**Step4. 配置DNS解析**

在云产品中搜索-云解析-选择DNS解析DNSPod

点击我的域名-添加记录

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/383f44e9fe714847ab5c5f2079d81982.png)

填入刚刚申请的域名，如果带有前缀，则第一个红框填入你的域名前缀，比如www.baidu.com，则这里填www

第二个红框填写你的服务器ip，或者你的CDN域名

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/2882e7602c324fc4a9a5520262c23a0a.png)

**Step5. 配置反向代理**

在宝塔面板中，点击刚刚添加的网站，点击反向代理，填入刚刚docker启动时的宿主机端口
![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/abbf944aab284d368e63d28b61024d7f.png)

如上文中的3888

以上配置完成之后，访问https://你的域名就可以了~

## PWA支持

PWA技术可以让我们访问网站能够拥有访问App一般的体验，在chatgpt-web中已经内嵌，但默认是关闭的

我们可以通过设置启动时的参数`-env VITE_GLOB_APP_PWA=true`将他打开

```bash
docker run --name chatgpt-web -d -p 127.0.0.1:3888:3002 --env OPENAI_ACCESS_TOKEN=your_access_token --env AUTH_SECRET_KEY=you_secret_key --env VITE_GLOB_APP_PWA=true chenzhaoyu94/chatgpt-web
1
```

部署成功之后，我们再到手机上访问该网站时便可以保存他在桌面了。

默认的PWA图标和全局用户信息配置在项目中，即使在网页可以修改当前登陆者的用户信息，在清除Cookie之后便会还原，如果你想定制这两种信息，请拉下chatgpt-web项目进行镜像自定义

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
