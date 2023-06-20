---
date: 2022-04-27 21:50:38

title: 【MySQL】MySQL主从开关机顺序
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



MySQL主从开关机顺序
停应用 ->停数据库（先备后主） ->改配置 -> 启数据库（先主后备）-> 启应用

关闭MySQL从库
a.先查看当前的主从同步状态show slave statusG;看是否双yes
b.执行stop slave
c.停止从库服务mysqladmin shutdown -u用户名 -p密码
d.查看是否还有mysql的进程ps -ef | grep mysql
d.如果部署了多个实例，那每个实例都要按照以上步骤来操作

关闭MySQL主库
a.停止主库服务mysqladmin shutdown -u用户名 -p密码
b.查看是否还有mysql的进程ps -ef | grep mysql

启动MySQL主库
a.启动主库服务mysqladmin start -u用户名 -p密码
b.查看mysql的进程ps -ef | grep mysql

启动MySQL从库
a.启动从库服务mysqladmin start -u用户名 -p密码
b.启动复制start slave;
c.检查同步状态show slave statusG;是否双yes
d.查看mysql的进程ps -ef | grep mysql
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
