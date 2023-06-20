---
date: 2022-06-17 02:13:41

title: Docker环境下安装vim
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



## Docker环境下安装vim

在使用docker容器时，容器一般没有安装vim，就需要安装vim
apt-get install vim命令用于安装vim，但是下载过慢。
第一步 配置国内镜像源
进入某个容器

例如进入mysql

```shell
docker exec -it mysql /bin/bash
```

第二步：更新源

```shell
apt update
```


第三步安装vim

```shell
apt-get install vim
```
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
