---
date: 2022-02-18 03:42:58

title: Linux下使用war包部署Jenkins
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# Linux下使用war包部署Jenkins

## 前言

jenkins可以多种方式安装，可以docker，也可以直接下载war包，然后java -jar方式启动。

```shell
1.创建安装目录
	mkdir -p /jenkins
2.切换目录
	cd  /jenkins
3.下载war包
	wget -O /jenkins/jenkins.war http://mirrors.jenkins.io/war-stable/latest/jenkins.war
4.启动
	BUILD_ID=dontKillMe nohup java -DJENKINS_HOME=/jenkins (如果有历史home可以指定其他home：/root/.jenkins) -Xms1046m -Xmx2000m -jar jenkins.war --httpPort=9444  >>jenkinsLog.log 2>&1 &
5.访问
	http://{your ip}:9444
```

### **备注:**

1. –httpPort自定义端口
2. jenkins默认工作目录：/root/.jenkins
3. nohup后台启动
4. ‘>>log’ 以追加的方式记录日志
5. 2>&1 2:标准异常输出 1:标准输出 ，2>&1 两种输出都记录到log文件中
6. & 后台启动方式
7. BUILD_ID=dontKillMe 防止误杀包
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
