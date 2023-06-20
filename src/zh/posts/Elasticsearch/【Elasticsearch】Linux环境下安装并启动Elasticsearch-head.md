---
date: 2021-10-03 09:18:07

title: Linux环境下安装并启动Elasticsearch-head
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 1、[elasticsearch-head](https://so.csdn.net/so/search?q=elasticsearch-head&spm=1001.2101.3001.7020)介绍

官方地址: https://github.com/mobz/elasticsearch-head

elasticsearch-head 是一款用来管理Elasticsearch集群的第三方插件工具。 elasticsearch-Head插件在5.0版本之前可以直接以插件的形式直接安装，但是5.0以后安装方式发生了改变，需要 [nodejs](https://so.csdn.net/so/search?q=nodejs&spm=1001.2101.3001.7020)环境支持，或者直接使用别人封装好的docker镜像，更推荐的是谷歌浏览器的插件。

# 2、elasticsearch-head安装

##  npm安装elasticsearch-head

> ```
> #下载安装nodejs
> wget https://nodejs.org/dist/v12.13.0/node-v12.13.0-linux-x64.tar.xz
> tar xf node-v12.13.0-linux-x64.tar.xz
> mv node-v12.13.0-linux-x64 node
> #修改环境变量
> echo 'export PATH=$PATH:/opt/node/bin' >> /etc/profile
> #配置生效
> source /etc/profile
> npm -v
> node -v
> 
> #下载elasticsearch-head
> git clone git://github.com/mobz/elasticsearch-head.git
> 
> #进入elasticsearch-head安装目录
> cd elasticsearch-head
> #配置国内镜像
> npm install -g cnpm --registry=https://registry.npm.taobao.org
> #安装
> cnpm install
> #启动
> cnpm run start
> ```

修改Elasticsearch配置文件，添加如下参数并重启: 

```cobol
#准许es被跨域访问
http.cors.enabled: true
http.cors.allow-origin: "*"
```
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
