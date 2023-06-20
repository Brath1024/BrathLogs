---
date: 2022-01-30 02:29:28

title: Squirrel SQL客户端安装与使用
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 一、Squirrel简介

Squirrel是一个连接数据库的客户端工具，一般支持JDBC的数据库都可以用它来简介，如连接MySQL。

 

# 二、安装准备

下载jar包：squirrel-sql-3.7.1-standard.jar

 

# 三、安装

①进入squirrel-sql-3.7.1-standard.jar文件所在的目录，在地址栏输入：cmd，进入命令窗口

②在命令窗口输入：java -jar squirrel-sql-3.7.1-standard.jar，进入安装界面

![img](https://img-blog.csdnimg.cn/20181207172341679.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

点击Next

![img](https://img-blog.csdnimg.cn/20181207172428945.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

点击Next

![img](https://img-blog.csdnimg.cn/20181207172456338.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

自行选择安装目录，然后点击Next

![img](https://img-blog.csdnimg.cn/20181207172529452.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

点击Yes

![img](https://img-blog.csdnimg.cn/20181207172626599.png)

在下面这个页面，最好选中所有的复选框，以免后续出问题，然后点击Next

![img](https://img-blog.csdnimg.cn/20181207172830834.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

进入安装窗口，结束后点击Next

![img](https://img-blog.csdnimg.cn/20181207172908294.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

选中复选框，然后点击Next

![img](https://img-blog.csdnimg.cn/20181207173028690.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

点击Done，完成安装

![img](https://img-blog.csdnimg.cn/20181207173319861.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

此时，桌面会多出一个图标

![img](https://img-blog.csdnimg.cn/20181207173404141.png)

 

# 四、配置客户端

点击SQuirrel，进入客户端页面

![img](https://img-blog.csdnimg.cn/20181207174019153.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

双击Phoenix安装包

![img](https://img-blog.csdnimg.cn/20181207174359249.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

将phoenix-4.8.1-HBase-0.98-client.jar文件拷贝到SQuirrel安装目录的lib目录下

![img](https://img-blog.csdnimg.cn/20181207174203592.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

![img](https://img-blog.csdnimg.cn/20181207174320964.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

添加驱动

![img](https://img-blog.csdnimg.cn/2018120717512761.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

点击OK后，出现下面界面，说明配置成功

![img](https://img-blog.csdnimg.cn/20181207175248755.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

可以看到添加的驱动

![img](https://img-blog.csdnimg.cn/20181207175400924.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

点击Aliases，添加“别名”

![img](https://img-blog.csdnimg.cn/2018120717573623.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

点击Test，Connect

![img](https://img-blog.csdnimg.cn/20181207175819496.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

如下所示，配置成功

![img](https://img-blog.csdnimg.cn/20181207180120990.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

列表中出现添加的Hadoop01

![img](https://img-blog.csdnimg.cn/20181207180202313.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

双击Hadoop01，点击TABLE即可看到对应的表

![img](https://img-blog.csdnimg.cn/20181207180425693.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5zb244NzAy,size_16,color_FFFFFF,t_70)

 

**至此，Squirrel SQL客户端安装配置完成！**
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
