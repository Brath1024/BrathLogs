---
date: 2022-03-24 14:38:19

title: MySQL安装 starting the server失败的解决办法
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



### MySQL安装 starting the server失败的解决办法

​		如果电脑是第一次安装MySQL，一般不会出现这样的报错。如下图所示。starting the server失败，通常是因为上次安装的该软件未清除干净。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190807043159195.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFuZ2c1NQ==,size_16,color_FFFFFF,t_70)

**完全卸载该软件的办法**：

第一步，进入…控制面板\程序\程序和功能，卸载下图中的MySQL两个软件。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190807043419726.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFuZ2c1NQ==,size_16,color_FFFFFF,t_70)
第二步，删除上次安装目录的MySQL残留文件，更不要忘了删除ProgramData下的MySQL文件夹，如下图所示。注意：这里的文件夹与上次安装目录里的残留文件不同，C:\ProgramData 一般默认是隐藏的。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190807043522439.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFuZ2c1NQ==,size_16,color_FFFFFF,t_70)
第三步，Win+R 输入 regedit 运行，进入注册表编辑器，按下图路径，找到MySQL，进而删除MySQL注册表信息。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190807043623577.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFuZ2c1NQ==,size_16,color_FFFFFF,t_70)
第四步，做完前三步，打开服务，会发现MySQL57服务依然存在，如下图所示。这就是导致安装失败的重要原因，所以需要删除MySQL57服务。方法：以管理员的权限运行dos命令，然后输入 sc delete MySQL57 。

```javascript
C:\Windows\system32>sc delete MySQL57
[SC] DeleteService 成功
12
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190807043734156.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFuZ2c1NQ==,size_16,color_FFFFFF,t_70)

现在就可以轻松的安装上MySQL软件了！

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
