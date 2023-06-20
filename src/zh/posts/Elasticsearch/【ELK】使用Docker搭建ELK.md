---
date: 2021-04-02 02:28:37

title: 【ELK】使用Docker搭建ELK
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



### 文章目录

- - [概念：](#_1)
  - [安装elk(这里通过docker进行安装)](#elkdocker_7)
  - - - [安装es](#es_8)
      - [安装kikana](#kikana_35)
      - [安装logstash](#logstash_59)



## 概念：

> 那么，[ELK](https://so.csdn.net/so/search?q=ELK&spm=1001.2101.3001.7020) 到底是什么呢？ “ELK”是三个开源项目的首字母缩写，这三个项目分别是：Elasticsearch、Logstash 和 Kibana。Elasticsearch 是一个搜索和分析引擎。Logstash 是服务器端数据处理管道，能够同时从多个来源采集数据，转换数据，然后将数据发送到诸如 Elasticsearch 等“存储库”中。Kibana 则可以让用户在 Elasticsearch 中使用图形和图表对数据进行可视化

- 工作流程
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/18dbff4e772c4bff918a06fc22562782.png)
- 在后续elk引入了beats (数据采集器) 后被称为Elastic Stack 或者 ELK

## 安装elk(这里通过docker进行安装)

#### 安装es

- 在dockerhub上搜索es![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/6f76e4d9d5504501902ef113cc4bbc69.png)
- 找到需要的es版本
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/6d5331d1e29649c8b784fd82a01a078c.png)
- 拉取es镜像`docker pull elasticsearch:tag`
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/da59ef5b031243f094ef24340170bb99.png)
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/44544fc5864a4db7a11b4864768446f4.png)
- 在dockerhub官网上可以看到es的启动命令
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/d0a24c581d37472b9f6b51e2946902c3.png)
- 先创建自定义docker网络`docker network create elastic`，默认是桥接模式
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/2e96d2e71e594a28bfbf5c14a7e50bbc.png)
- 查看创建的网络![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/1335acab2ae14d908a9c70249c11d1a8.png)
- 启动es镜像，这里我以单机的形式启动`docker run -d --name elasticsearch --net elastic -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:tag`
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/cab7b5b16f7444f98587b73977f5784f.png)
- 启动之后访问`localhost:9200`，有数据返回说明启动成功，如下图
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/b007a9897a384d45b4f99719a8e80d2b.png)
- 修改es配置，进入容器`docker exec -it a804 /bin/sh`
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/f3b2629fdf69469eb752ce1b23d60ab5.png)
- 在`config`目录下的`elasticsearch.yml`文件添加

```yml
http.cors.enabled: true 
http.cors.allow-origin: "*"
12
```

- 修改完配置之后，退出容器并重启
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/18e0f04b59144d16bf0c19f730cbfe72.png)

#### 安装kikana

- 从dockerhub拉取与es对应版本的kibana `docker pull kibana:tag`
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/786540852f3848ef91b6dc9172c62e06.png)
- 启动kibana `docker run --name kib-7.6 --net elastic -d -p 5601:5601 kibana:tag`
- 启动之后访问
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/aed86ba45de34bbdb960c67a10eba2e1.png)
- 出现上图是由于kibanakibana.yml，默认的地址是http://elasticsearch:9200,需要修改为es服务ip
- 进入到es容器里面`docker -it 容器编号 /bin/sh`
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/30cda118f3b344b6ac611f143d8cb941.png)
- 查看es的容器详情`docker inspect a80402dbe9f5`
- 找到网络详情，找到es服务的ip地址
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/810fc12347fd4c4fbb02cb2ca219e4d6.png)
- 也可以通过`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' a804`获取ip
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/61ff14db933c4b4889fa6d6eb5d6d17d.png)
- 进入到kibana容器，切换到`/usr/share/kibana/config`目录
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/41867b50de204c558b90c08d0fdd8e88.png)
- 修改kibana.yml文件
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/0941ebe9bb9445aa9e715440a490e0a2.png)
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/3f1b21a66c2b48a8bc46e391f39a1fa6.png)
- 修改完kibana.yml之后重启kibana容器
- 访问kibana`localhost:5601`
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/b179a708ace346fca404be4c1ada73ef.png)
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/d0756690b86f4f57be7919f08210b388.png)
- 到这里kibana就安装成功了

#### 安装[logstash](https://so.csdn.net/so/search?q=logstash&spm=1001.2101.3001.7020)

- 从dockerhub拉取logstash`docker pull logstash:7.6.2`
  ![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/b1ec7cb4c13b48a188e45bcd0d125d58.png)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
