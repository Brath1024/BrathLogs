---
date: 2022-11-13 23:44:29

title: ELASTICSEARCH7.X安全性之访问密码设置
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)





## ELASTICSEARCH7.X安全性之访问密码设置

```
当我们安装完ElasticSearch的时候发现，访问过程中我们没有任何安全认证就可以直接访问并操作。如果是生产环境，端口向外暴露的话，那么对数据的安全性是无法得到保障的。
```

一般解决方案有

- 开启ElasticSearch认证插件，访问的时候添加账密
- 当然也可以通过nginx作代理防护

本文主要讲解通过启用X-Pack来设置ElasticSearch的访问密码。

集群与单据环境都适合次方法

- 集群与单据环境配置的区别就是，集群需要在某一台生成证书然后拷贝到其它节点目录下。
- 集群环境重设置密码的时候需要整个集群节点都已启动，可在任一台处修改。

## 2.X-PACK简介

```
X-Pack是Elastic Stack扩展功能，提供安全性，警报，监视，报告，机器学习和许多其他功能。 ES7.0+之后，默认情况下，当安装Elasticsearch时，会自动安装X-Pack，无需单独再安装。自6.8以及7.1+版本之后，基础级安全永久免费了。
在使用的时候主要需要配置一下证书，以及修改配置文件（config/elasticsearch.yml ）
```

## 3.证书配置

### 3.1生成节点证书

切换到 elasticsearch 安装文件目录 bin 下 ：示例：/usr/local/elasticsearch-7.4.0/bin
借助elasticsearch-certutil命令生成证书：

```shell
./elasticsearch-certutil ca -out config/certs/elastic-certificates.p12 -pass
```

这里单独设置了一个 证书文件目录 config/certs
![在这里插入图片描述](https://www.freesion.com/images/951/a3d0c1934c0ed0f8440f830d63e96dbf.png)

生成后的证书
![在这里插入图片描述](https://www.freesion.com/images/953/de92ac2cf73d1ed0da994f9d1066e8f1.png)

### 3.2修改配置

配置通信证书 > 需要在 config目前下elasticsearch.yml 配置

```
# 开启xpack
xpack.security.enabled: true
xpack.license.self_generated.type: basic
xpack.security.transport.ssl.enabled: true
# 证书配置
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: certs/elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: certs/elastic-certificates.p12

```

其它配置（可选）

```
#跨域配置
http.cors.enabled: true
http.cors.allow-origin: "*"
http.cors.allow-headers: Authorization,X-Requested-With,Content-Length,Content-Type
```

注:若是集群环境则需要将证书文件目录，以及配置文件，在所有集群环境下都修改一下。

### 3.3.重启生效

需要重启elasticsearch

注：若是集群环境下则需要启动所有集群节点，再统一设置密码

注：重启异常情况，若出现报错，类似 failed to load plugin class[org.elasticsearch.xpack.core.XPackPlugin]
请检查是否是使用root用户生成的证书，启动用户无权限导致。

## 4.设置用户密码

执行设置用户名和密码的命令,内置了部分用户
切换到 elasticsearch 安装文件目录 bin 下 ：示例：/usr/local/elasticsearch-7.4.0/bin/

```
# 手动配置每个用户密码模式（需要一个一个的输入）
./elasticsearch-setup-passwords interactive
```

也可以先自动配置密码后续再修改

```
#自动配置每个用户密码（随机生成并返回字符串密码,需要保存好）
./elasticsearch-setup-passwords auto  
```

下图1是自动生成密码情况（一定拷贝下来要牢记密码）
![在这里插入图片描述](https://www.freesion.com/images/198/f383d0d38bab2a11f3293d44ffccf0ae.png)

下图2是自定义密码情况
分别为多个用户设置密码例如：elastic, kibana, logstash_system,beats_system,
设置密码的时候需要连续输入2遍。
![在这里插入图片描述](https://www.freesion.com/images/458/363890f3fdffcc0b1bcfaae3c8295952.png)

部分内置账号的角色权限解释如下：

- elastic 账号：拥有 superuser 角色，是内置的超级用户。
- kibana 账号：拥有 kibana_system 角色，用户 kibana 用来连接 elasticsearch 并与之通信。Kibana 服务器以该用户身份提交请求以访问集群监视 API 和 .kibana 索引。不能访问 index。
- logstash_system 账号：拥有 logstash_system 角色。用户 Logstash 在 Elasticsearch 中存储监控信息时使用。

至此单节点安全配置完毕，重启es后访问9200会出现用户名和密码的提示窗口,我们就可以通过用户生成的密码过行访问了

## 5.测试访问

通过查看证书方式，顺便测试一下密码是否生效了
浏览器输入 [http://IP:9200/_license](http://ip:9200/_license) 可以看到，弹窗出来，需要输入密码了
![在这里插入图片描述](https://www.freesion.com/images/561/b7034fa6ab245e277567b01d40929119.png)
![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/9b1a95e8a4b361dd4f7e3012300d1115.png)

## 附录：常见问题

### 1.如何修改账号密码

以elastic账号为例，注意需要在elasticsearch服务已启动的情况下进行

```shell
curl -H 'Content-Type: application/json' -u elastic:123456 -XPUT 'http://localhost:9200/_xpack/security/user/elastic/_password' -d '{ "password" : "1234567" }'
```

### 2.客户端ES-HEAD连接问题

连接失败情况下先检查是否是跨域问题

```
http.cors.enabled: true
http.cors.allow-origin: "*"
http.cors.allow-headers: Authorization,X-Requested-With,Content-Length,Content-Type
```

例如下图连接的时候报错未授权
![在这里插入图片描述](https://www.freesion.com/images/96/57fa25b106cf1cdee9f44a2f8577e620.png)

解决方案：在访问的URL中拼接授权账号信息
示例：?auth_user=elastic&auth_password=1234567

示例:指定服务端地址以及账户

```
http://IP:9100/?base_uri=http://IP:9200&auth_user=elastic&auth_password=1234567
```

### 3.启动报XPACK相关错

![在这里插入图片描述](https://www.freesion.com/images/947/90ff281ef660a79e49875391f87e474b.png)

DecoderException: javax.net.ssl.SSLHandshakeException: No available authentication scheme
![在这里插入图片描述](https://www.freesion.com/images/485/efd6d897ad8655121334fd050eecd445.png)

解决方案：请通过上文配置步骤，排查，检查证书是否已经配置好，以及配置是否填写正确
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
