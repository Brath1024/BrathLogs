---
date: 2021-01-11 06:26:17

title: Linux环境下安装并启动Elasticsearch7
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



### Elasticsearch

​        Elasticsearch (ES)是一个基于Lucene构建的开源、分布式、RESTful 接口全文搜索引擎。Elasticsearch 还是一个分布式文档数据库，其中每个字段均是被索引的数据且可被搜索，它能够扩展至数以百计的服务器存储以及处理PB级的数据。它可以在很短的时间内在存储、搜索和分析大量的数据。它通常作为具有复杂搜索场景情况下的核心发动机。es是由java语言编写的。

    Elasticsearch就是为高可用和可扩展而生的。可以通过购置性能更强的服务器来完成。
[Elasticsearch：官方分布式搜索和分析引擎 | Elastic![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/icon-default.png)https://www.elastic.co/cn/elasticsearch/](https://www.elastic.co/cn/elasticsearch/)

## 

## Linux里部署ES

###     下载地址

​        我下载的版本是ES7.15.1

Elasticsearch 7.15.1 | Elastic![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/apple-icon-57x57.png)https://www.elastic.co/cn/downloads/past-releases/elasticsearch-7-15-1

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/74a3f6fc611945ebb8e492204fe4b51f.png)

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/4490382f8fd54a48bbd8e2ffaf2ce6ea.png)

### 上传到Linux

​    压缩包下载完成后上传到服务器

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/3732b77fcd15428e8397739b50f6b3b1.png)

### 解压软件

​     解压到上级目录，然后进行改名

```shell
# 解压缩
tar -zxvf elasticsearch-7.15.1-linux-x86_64.tar.gz -C ../
# 改名
mv elasticsearch-7.15.1 es-7.15.1
```

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/e6ff579f0e6b4aa6994e17629bbaa96a.png)

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/7678de3df173498e92409dc8300f09b5.png)

在/opt目录下新建module/es目录，同时把es-7.15.1移到该目录

```
mv es-7.15.1 /opt/module/es
```

### 创建用户

​    因为安全问题， Elasticsearch 不允许 root 用户直接运行，所以要创建新用户，在 root 用户中创建新用户。

```
useradd es #新增 es 用户
passwd es #为 es 用户设置密码
userdel -r es #如果错了，可以删除再加
chown -R es:es /opt/module/es/es-7.15.1 #文件夹所有者
```

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/cf9ac437254f47bfa9e26f4770fa9667.png)

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/3b5a89b6cdbb4a3bb6220423400e25d2.png)

###  修改配置文件

修改/root/es-7.15.1/config/elasticsearch.yml文件。

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/d40fbb16c317400495682be93a2e07d7.png)

```
# 加入如下配置
cluster.name: elasticsearch
node.name: node-1
network.host: 0.0.0.0
http.port: 9200
cluster.initial_master_nodes: ["node-1"]
```

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/00e7d21c15c640ba949d3dda5e9ee885.png)

### 修改/etc/security/limits.conf

```sehll
# 在文件末尾中增加下面内容
# 每个进程可以打开的文件数的限制
es soft nofile 65536
es hard nofile 65536
```

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/4d4441f8e29346a0bc5a0ac8959477d9.png)

### 修改/etc/sysctl.conf

```shell
# 在文件中增加下面内容
# 一个进程可以拥有的 VMA(虚拟内存区域)的数量,默认值为 65536
vm.max_map_count=655360
```

### 重新加载

sysctl -p

###  注意：

​    启动前需要先切换到es用户

```sehll
su es
```

### 启动es

```shell
#启动 进入bin目录：
./elasticsearch
#后台启动
./elasticsearch -d  
```

###  测试连接

​    浏览器中打开 [http://服务器IP:9200/](http://xn--ip-fr5c86lx7z:9200/),出现如下则说明安装成功

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/0197dcff901f47279750939332674547.png)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
