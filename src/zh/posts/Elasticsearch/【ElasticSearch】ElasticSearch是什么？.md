---
date: 2021-05-24 16:45:04

title: ElasticSearch 处理检索海量数据“神器”？
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



------

> **海量数据我们是如何去检索数据呢**，如何快速定位呢，去查询后台数据库吗？**还是走缓存**，是什么缓存能承载这么大的符合呢，并且快速检索出来？对于海量的数据是**对系统极大的压力**，***我们该从什么角度去处理这个棘手的问题呢***？

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/82bb3c20ec5d414c838322d08edd1015.png)

## [ElasticSearch](https://so.csdn.net/so/search?q=ElasticSearch&spm=1001.2101.3001.7020) 处理检索海量数据“神器”？

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/aba293bd092b42368e36b7839eb7df10.png)

## 1.1 介绍

> Elasticsearch是一个基于[Lucene](https://so.csdn.net/so/search?q=Lucene&spm=1001.2101.3001.7020)的搜索服务器。它提供了一个分布式多用户能力的全文搜索引擎，基于RESTful
> web接口。Elasticsearch是用Java语言开发的，并作为[Apache](https://so.csdn.net/so/search?q=Apache&spm=1001.2101.3001.7020)许可条款下的开放源码发布，是一种流行的企业级搜索引擎。Elasticsearch用于云计算中，能够达到实时搜索，稳定，可靠，快速，安装使用方便。官方客户端在Java、.NET（C#）、PHP、Python、Apache
> Groovy、Ruby和许多其他语言中都是可用的。根据DB-Engines的排名显示，Elasticsearch是最受欢迎的企业搜索引擎，其次是Apache
> Solr，也是基于Lucene。

## 1.2 es 介绍“官网地址们”

1. 官方文档
2. 中文官方文档 3.[中文社区](https://es.xiaoleilu.com/index.html)

## 2.1 基本介绍

> **1、Index（索引）** 动词，相当于 MySQL 中的 insert； 名词，相当于 MySQL 中的 Database
> **2、Type（类型）** 在 Index（索引）中，可以定义一个或多个类型。 类似于 MySQL 中的 Table；每一种类型的数据放在一起；
> **3、Document（文档）**
> 保存在某个索引（Index）下，某种类型（Type）的一个数据（Document），文档是 JSON 格
> 式的，Document 就像是 MySQL 中的某个 Table 里面的内容；

![数据概念](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/906e9a7bc76e4bba979fb394fe61a6cc.png)

## 2.2 ES是如何进行检索的呢

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/eddb7d02f575452fbfaa011cef1b75fa.png)

## 2.3 ElasticSearch 长啥样呢，有无操作界面

> ElasticSearch
> 是有操作界面的，它需要配置**Kibana**，和它一起操作方便，也是主流的一种搭配方式，安装这两个工具，不做过多介绍
>
> ***Kibana介绍*** Kibana是一款开源的数据分析和可视化平台,它是Elastic Stack成员之一,设计用于和Elasticsearch协作。您可以使用Kibana对Elasticsearch索引中的数据进行搜索、查看、交互操作。您可以很方便的利用图表、表格及地图对数据进行多元化的分析和呈现

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/b90b4864012740a2bb99f48f0f2e2ab6.png)

## 2.4 初步检索

```powershell
1、_cat
GET /_cat/nodes：查看所有节点
GET /_cat/health：查看 es 健康状况
GET /_cat/master：查看主节点
GET /_cat/indices：查看所有索引 show databases;
2、索引一个文档（保存）
保存一个数据，保存在哪个索引的哪个类型下，指定用哪个唯一标识
PUT customer/external/1；在 customer 索引下的 external 类型下保存 1 号数据为
12345678
PUT 和 POST 都可以，
POST 新增。如果不指定 id，会自动生成 id。指定 id 就会修改这个数据，并新增版本号
PUT 可以新增可以修改。PUT 必须指定 id；由于 PUT 需要指定 id，我们一般都用来做修改
操作，不指定 id 会报错
1234
```

## 2.4.1 在postMan测试数据

```java
PUT customer/external/1
{ "name": "John Doe"
}
123
```

**2.4.2、查询文档**

```powershell
GET customer/external/1
1
结果：
{ "_index": "customer", //在哪个索引
"_type": "external", //在哪个类型
"_id": "1", //记录 id
"_version": 2, //版本号
"_seq_no": 1, //并发控制字段，每次更新就会+1，用来做乐观锁
"_primary_term": 1, //同上，主分片重新分配，如重启，就会变化
"found": true, "_source": { //真正的内容
"name": "John Doe"
}
}
1234567891011
```

**2.4.3、更新文档**

```rust
POST customer/external/1/_update
{ "doc":{ "name": "John Doew"
}
}
或者
POST customer/external/1
{ "name": "John Doe2"
}
或者
PUT customer/external/1
{ "name": "John Doe"
}
? 不同：POST 操作会对比源文档数据，如果相同不会有什么操作，文档 version 不增加
PUT 操作总会将数据重新保存并增加 version 版本；
带_update 对比元数据如果一样就不进行任何操作。
看场景；
对于大并发更新，不带 update；
对于大并发查询偶尔更新，带 update；对比更新，重新计算分配规则。
? 更新同时增加属性
POST customer/external/1/_update
{ "doc": { "name": "Jane Doe", "age": 20 }
}
PUT 和 POST 不带_update 也可以
1234567891011121314151617181920212223
```

**2.4.4、删除文档&索引**

```rust
DELETE customer/external/1
DELETE customer
12
```

**2.4.5 bulk 批量 API**

```rust
POST customer/external/_bulk
{"index":{"_id":"1"}}
{"name": "John Doe" }
{"index":{"_id":"2"}}
{"name": "Jane Doe" }
语法格式：
{ action: { metadata }}\n
{ request body }\n
{ action: { metadata }}\n
{ request body }\n
复杂实例：
POST /_bulk
{ "delete": { "_index": "website", "_type": "blog", "_id": "123" }}
{ "create": { "_index": "website", "_type": "blog", "_id": "123" }}
{ "title": "My first blog post" }
{ "index": { "_index": "website", "_type": "blog" }}
{ "title": "My second blog post" }
{ "update": { "_index": "website", "_type": "blog", "_id": "123", "_retry_on_conflict" : 3} }
{ "doc" : {"title" : "My updated blog post"} }
bulk API 以此按顺序执行所有的 action（动作）。如果一个单个的动作因任何原因而失败，
它将继续处理它后面剩余的动作。当 bulk API 返回时，它将提供每个动作的状态（与发送
的顺序相同），所以您可以检查是否一个指定的动作是不是失败了。
12345678910111213141516171819202122
```

## 2.4 SearchAPI

```rust
ES 支持两种基本方式检索 :
? 一个是通过使用 REST request URI 发送搜索参数（uri+检索参数）
? 另一个是通过使用 REST request body 来发送它们（uri+请求体）
1）、检索信息
? 一切检索从_search 开始
GET bank/_search 检索 bank 下所有信息，包括 type 和 docs
GET bank/_search?q=*&sort=account_number:asc 请求参数方式检索
响应结果解释：
took - Elasticsearch 执行搜索的时间（毫秒）
time_out - 告诉我们搜索是否超时
_shards - 告诉我们多少个分片被搜索了，以及统计了成功/失败的搜索分片
hits - 搜索结果
hits.total - 搜索结果
hits.hits - 实际的搜索结果数组（默认为前 10 的文档）
sort - 结果的排序 key（键）（没有则按 score 排序）
score 和 max_score –相关性得分和最高得分（全文检索用）
12345678910111213141516
```

**其他在Kibana操作的语句，都可以在es官网去查询，不做过多的赘述！！！**

## 2.5、Mapping映射

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/792e34eb6b8d40568272d2413c1c0aaf.png)

> Mapping（映射） Mapping 是用来定义一个文档（document），以及它所包含的属性（field）是如何存储和
> 索引的。比如，使用 mapping 来定义： ? 哪些字符串属性应该被看做全文本属性（full text fields）。 ?
> 哪些属性包含数字，日期或者地理位置。 ? 文档中的所有属性是否都能被索引（_all 配置）。 ? 日期的格式。 ?
> 自定义映射规则来执行动态添加属性。

## 2.6 分词

> 个 tokenizer（分词器）接收一个字符流，将之分割为独立的 tokens（词元，通常是独立 的单词），然后输出 tokens 流。
> 例如，whitespace tokenizer 遇到空白字符时分割文本。它会将文本 “Quick brown fox!” 分割 为
> [Quick, brown, fox!]。 该 tokenizer（分词器）还负责记录各个 term（词条）的顺序或 position
> 位置（用于 phrase 短 语和 word proximity 词近邻查询），以及 term（词条）所代表的原始 word（单词）的
> start （起始）和 end（结束）的 character offsets（字符偏移量）（用于高亮显示搜索的内容）。
> Elasticsearch 提供了很多内置的分词器，可以用来构建 custom analyzers（自定义分词器）。

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/a81d083a8d594324b2d58b6d398f0dbe.png)
**2.6.1 安装分词器**

> 注意：不能用默认 elasticsearch-plugin install xxx.zip 进行自动安装
> https://github.com/medcl/elasticsearch-analysis-ik/releases?after=v6.4.2
> 对应 es 版本安装

## 总结

> elasticsearch
> 功能是非常强大的，可以作为生成环境的**ELK日志**存储，方便检索，也可以部署集群，提高效率，最主要是它是走内存的，查询效率极高，为大数据检索而生！！！

## 使用场景（Es）

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/157dbcd31b4a4534a70bf24b62050d10.png)
****
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
