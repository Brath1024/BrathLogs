---
date: 2021-06-17 08:05:58

title: Maven通过命令提示符引入jar包的流程
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



安装好Maven之后配置环境变量：

​		在系统变量新建 "MAVEN_HOME" 值为：Maven的安装路径：**E:\Maven\apache-maven-3.5.3**，接着在Path变量中，添加：%MAVEN_HOME%\bin，指定maven的bin路径。

​		现在在 CMD中就可以用mvn -v的命令查看是否安装成功：

![maven环境](f:\md%E5%9B%BE%E7%89%87\maven%E7%8E%AF%E5%A2%83.png)

### 引入流程：

​		接下来找到你要引入的jar包的根路径，指定路径+jar包名，指定groupId、artifactId、version名，就可以引入了。

#### 举例:

​		mvn install:install-file -Dfile=D:\jar\WxQyhPrj\0.0.1-SNAPSHOT\WxQyhPrj-0.0.1-SNAPSHOT.jar -DgroupId=com.chis.wx -DartifactId=WxQyhPrj -Dversion=0.0.1-SNAPSHOT -Dpackaging=jar

​		mvn install:install-file -Dfile：Jar包的绝对路径

​		-DgroupId：Jar包的groupId分组id

​		-DartiactId：Jar包的artifactId版本id

​		-Dversion：Jar包的version版本

其中
-- DgroupId和DartifactId构成了该jar包在pom.xml的坐标， 对应依赖的DgroupId和DartifactId

-- Dfile表示需要上传的jar包的绝对路径

-- Dpackaging 为安装文件的种类

-- DgroupId和DartifactId构成了该jar包在pom.xml的坐标， 对应依赖的DgroupId和DartifactId

-- Dfile表示需要上传的jar包的绝对路径

-- Durl私服上仓库的url精确地址(打开nexus左侧repositories菜单，可以看到该路径)

-- DrepositoryId服务器的表示id，在nexus的configuration可以看到
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
