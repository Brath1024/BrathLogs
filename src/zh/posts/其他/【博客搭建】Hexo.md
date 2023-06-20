---
date: 2021-09-04 06:08:45

title: Hexo搭建
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# hexo框架个人博客搭建

## 1 环境准备

### 1.1 Node.js和npm安装

```
NoedJS自行百度安装
```

### 1.2(选) npm 淘宝镜像

```
npm install -g cnpm --registry.npm.taobao.org
```

### 1.3 hexo框架安装

```
cnpm install -g hexo-cli
```

### 1.4git安装配置

1. [git官网](https://git-scm.com/download) 下载对应系统安装包

2. 运行安装包 一路下一步

3. 开始菜单运行 Git Bash(运行成功表示git安装成功)

4. git安装好去GitHub上注册一个账号

5. 设置git：在Git Bush命令行中输入

   ```
   # 配置用户名
   git config --global user.name "username"    //（ "username"是自己的账户名）
   # 配置邮箱
   git config --global user.email "username@email.com"     //("username@email.com"注册账号时用的邮箱)
   ```

    以上命令执行结束后，可用 git config –global –list 命令查看配置是否OK

6. 生成ssh,在命令框中输入以下命令

   ```
   ssh-keygen -t rsa
   ```

 连续敲三次回车，结束后去系统盘目录下（一般在 C:\Users\你的用户名.ssh）(mac: /Users/用户/.ssh）查看是否有：ssh文件夹生成
\7. 将ssh文件夹中的公钥（ id_rsa.pub）添加到GitHub管理平台中，在GitHub的个人账户的设置中找到如下界面

![20181012202024433](http://m.qpic.cn/psc?/V13GZ6V642zl3l/LjNfElrpEt6hXz54k3bCMchAT9Eqb8h826wZJlbf5XTg7bk2vbn8iPBmpUMKdT*qmYTTTu6PvI2OOXduLhX4YWkD8PDL7HQ0zwtH8In.gVk!/b&bo=8wKMAQAAAAADB14!&rf=viewer_4)

title随便起一个，将公钥（ id_rsa.pub）文件中内容复制粘贴到key中，然后点击Ass SSH key就好啦

## 2 建立本地网站

### 2.1 在本地建立一个文件夹

```
去任意盘符下，建立一个文件夹，这个文件夹就是你的博客文件夹
```

### 2.2 cmd命令进入这个文件夹

```
进入文件夹后，路径输入cmd进入命令提示符窗口
```

### 2.3 hxeo生成博客

```
sudo hexo init
```

### 2.4 启动博客

```
hexo s
```

 进入网站 说明建立成功

## 3 上传至github

### 3.1 建立仓库

1. 登录github 新建一个仓库
2. 仓库名必须是 “<<你的Github名字>>.github.io”

### 3.2 在博客目录安装git插件

```
cnpm install --save hexo-deployer-git
```

### 3.3 设置文件“_config.yml”（最底部）

```
deploy:
     type: git
     repo: //仓库的ssh地址
     branch: master
```

### 3.4 部署到远端

```
hexo d //需要登陆
```

### 3.5 访问

 ”https://<<你的username>>.github.io“



```
补充命令：

hexo clean 清理博客

hexo generate 同步博客

hexo deploy 提交博客
```

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
