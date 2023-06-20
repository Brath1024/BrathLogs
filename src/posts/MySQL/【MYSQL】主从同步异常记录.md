---
date: 2021-07-17 23:49:58

title: 主从同步遇到 Got fatal error 1236 from master when reading data from binary log
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 

首先遇到这个是因为binlog位置索引处的问题，不要[reset](https://so.csdn.net/so/search?q=reset&spm=1001.2101.3001.7020) slave；

reset slave会将主从同步的文件以及位置恢复到初始状态，一开始没有数据还好，有数据的话，相当于重新开始同步，可能会出现一些问题；

一般做主从同步，都是要求以后的数据实现主从同步，而对于旧的数据完全可以使用数据库同步工具先将数据库同步，完了再进行主从同步；

好了遇到上面的问题，正确做法是：

1.打开主服务器，进入mysql

2.执行flush logs；//这时主服务器会重新创建一个binlog文件；

3.在主服务上执行 show master status;  显示如下：

![img](https://brath.cloud/blogImg/1620811-20190720113929965-58969472.png)

4.来到从服务器的mysql；

5.stop slave;

6.change master to master_log_file='mysql-bin.000012',master_log_pos=154;//这里的file和pos都是上面主服务器master显示的。

7.start slave;//这时候就应可以了

8.show slave status \G; 

![img](https://brath.cloud/blogImg/1620811-20190720114247073-1479221471.png)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
