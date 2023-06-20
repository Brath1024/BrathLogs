---
date: 2022-10-23 23:01:14

title: docker中设置elasticsearch、kibana用户名密码、修改密码
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# docker中设置elasticsearch、kibana用户名密码、修改密码

### 

- [前言](#_1)
- [一、elasticsearch设置密码](#elasticsearch_3)
- - [首先开启 X-Pack](#_XPack_8)
  - [测试是否设置成功](#_62)
  - [修改密码](#_77)
  - - [已知密码修改](#_78)
    - [忘记密码](#_107)
- [二、kibana配置elasticsearch密码](#kibanaelasticsearch_131)



# 前言

之前在[docker](https://so.csdn.net/so/search?q=docker&spm=1001.2101.3001.7020)中安装过elasticsearch和elasticsearchhead以及kibana都没有配置密码，在此记录下设置过程。

# 一、[elasticsearch](https://so.csdn.net/so/search?q=elasticsearch&spm=1001.2101.3001.7020)设置密码

参考 [官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/7.16/security-settings.html#token-service-settings)
xpack.security.enabled: true
[设置引导性密码](https://www.elastic.co/guide/en/elasticsearch/reference/7.16/security-api-change-password.html)

> The setup-passwords tool is the simplest method to set the built-in users’ passwords for the first time. It uses the elastic user’s bootstrap password to run user management API requests. For example, you can run the command in an “interactive” mode, which prompts you to enter new passwords for the elastic, kibana, and logstash_system users:

## 首先开启 X-Pack

修改容器内或者修改挂载出来的elasticsearch.yml

```bash
docker exec -it elasticsearch /bin/bash		# 进入容器内部
vi /data/elasticsearch/config/elasticsearch.yml		# 挂载目录
1
```

elasticsearch.yml 文件添加

```yaml
cluster.name: "docker-cluster-01"
network.host: 0.0.0.0
http.cors.enabled: true
http.cors.allow-origin: "*"
# 此处开启xpack
xpack.security.enabled: true
```

重新启动elasticsearch。

```bash
docker restart elasticsearch
```

进入docker中的elasticsearch中，设置密码，执行

```bash
/usr/share/elasticsearch/bin/x-pack/setup-passwords interactive
```

依次设置用户：elastic、apm_system、kibana_system、logstash_system、beats_system、remote_monitoring_user共6个用户。
内部用户
X-Pack 安全有三个内部用户（_system、_xpack和_xpack_security），负责在 Elasticsearch 集群中进行的操作。

这些用户仅由源自集群内的请求使用。出于这个原因，它们不能用于对 API 进行身份验证，并且没有密码可以管理或重置。

有时，您可能会在日志中找到对这些用户之一的引用，包括审计日志。

```bash
Initiating the setup of passwords for reserved users elastic,apm_system,kibana,kibana_system,logstash_system,beats_system,remote_monitoring_user.
You will be prompted to enter passwords as the process progresses.
Please confirm that you would like to continue [y/N]y
Enter password for [elastic]: 
Reenter password for [elastic]: 
Enter password for [apm_system]: 
Reenter password for [apm_system]: 
Enter password for [kibana_system]: 
Reenter password for [kibana_system]: 
Enter password for [logstash_system]: 
Reenter password for [logstash_system]: 
Enter password for [beats_system]: 
Reenter password for [beats_system]: 
Enter password for [remote_monitoring_user]: 
Reenter password for [remote_monitoring_user]: 
Changed password for user [apm_system]
Changed password for user [kibana_system]
Changed password for user [kibana]
Changed password for user [logstash_system]
Changed password for user [beats_system]
Changed password for user [remote_monitoring_user]
Changed password for user [elastic]
12345678910111213141516171819202122
```

## 测试是否设置成功

```bash
curl localhost:9200
```

结果显示：

```bash
[root@VM-24-15-centos config]# curl localhost:9200
{"error":{"root_cause":[{"type":"security_exception","reason":"missing authentication credentials for REST request [/]","header":{"WWW-Authenticate":"Basic realm=\"security\" charset=\"UTF-8\""}}],"type":"security_exception","reason":"missi
```

显示这个则设置成功。
使用密码访问elasticsearch测试是否可以访问。

```bash
curl localhost:9200 -u elastic
```

就可以看到elasticsearch信息。

## 修改密码

### 已知密码修改

```bash
POST _xpack/security/user/_password
POST _xpack/security/user/<username>/_password
# 将用户elastic  密码改为elastic
curl -u elastic -H "Content-Type: application/json" -X POST "localhost:9200/_xpack/security/user/elastic/_password" --data '{"password":"elastic"}'
# 测试是否修改成功
curl localhost:9200 -u elastic
123456
```

登录成功的结果展示:

```bash
 {
  "name" : "384cda4775e5",
  "cluster_name" : "docker-cluster-01",
  "cluster_uuid" : "SOH21TLnQdSZnJq0ZW2iDw",
  "version" : {
    "number" : "7.14.2",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "6bc13727ce758c0e943c3c21653b3da82f627f75",
    "build_date" : "2021-09-15T10:18:09.722761972Z",
    "build_snapshot" : false,
    "lucene_version" : "8.9.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

### 忘记密码

创建本地超级账户，然后使用api接口本地超级账户重置elastic账户的密码

1. 停止elasticsearch服务
2. 确保你的配置文件中支持本地账户认证支持，如果你使用的是xpack的默认配置则无需做特殊修改；如果你配置了其他认证方式则需要确保配置本地认证方式在ES_HOME/config/elasticsearch.yml中。
3. 使用命令ES_HOME/bin/x-pack/users创建一个基于本地问价认证的超级管理员。
4. 进入docker容器中elasticsearch中，执行

```bash
docker exec -it elasticsearch /bin/bash
bin/x-pack/users useradd test_admin -p test_password -r superuser
```

1. 启动elasticsearch服务

```bash
docker restart elasticsearch
```

1. 通过api重置elastic超级管理员的密码

```bash
curl -u test_admin -XPUT  -H 'Content-Type: application/json' 'http://localhost:9200/_xpack/security/user/elastic/_password' -d '{"password" : "新密码"}'
```

1. 校验下密码是否重置成功

```bash
curl localhost:9200 -u elastic
```

# 二、kibana配置elasticsearch密码

[文档](https://www.elastic.co/guide/en/kibana/7.16/settings.html)
修改容器内或者修改挂载出来的kibana.yml

```bash
docker exec -it kibana /bin/bash		# 进入容器内部
vi /data/kibana/config/kibana.yml		# 挂载目录
```

kibana.yml 文件添加

```yaml
# Default Kibana configuration for docker target
server.host: "0"
server.shutdownTimeout: "5s"
elasticsearch.hosts: [ "http://172.17.0.3:9200" ]
monitoring.ui.container.elasticsearch.enabled: true
i18n.locale: "zh-CN"
# 此处设置elastic的用户名和密码
elasticsearch.username: elastic
elasticsearch.password: elastic
```

重新启动elasticsearch。

```bash
docker restart kibana
```

访问网址：
![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/f9ba8bb8f117485b8b8246d9d62599f8.png)
搞定！

> 新手最近开始写文章，手敲不易，请多多支持！在此感谢每位读者0.0
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
