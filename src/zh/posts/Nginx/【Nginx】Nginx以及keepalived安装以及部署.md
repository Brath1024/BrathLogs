---
date: 2020-12-19 07:25:31

title: Nginx以及Keepalived安装以及部署
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



​		反向代理:指的是用户要访问youtube,但是youtube悄悄地把这个请求交给后台N台服务器中的其中一台来做，这种方式就是反向代理了。

​		负载均衡：

1)使用硬件负载均衡策略,如使用F5,Array等负载均衡器.

2)使用软件进行负载均衡
3)如使用阿里云服务器均衡SLB
4)使用我们今天所学习的Nginx+Keepalived
5)其他软件负载均衡如LVS(Linux Virtual Server),haproxy等技术



### 环境搭建：

```java
步骤:
1.进行安装:tar -zxvf /root/software/nginx-1.6.2.tar.gz -C /usr/local/
2.下载所需要的依赖库文件:
   yum install pcre -y
   yum install pcre-devel -y
   yum install zlib -y
   yum install zlib-devel -y
3.进行configure配置,查看是否报错
   cd nginx-1.6.2
   ./configure --prefix=/usr/local/nginx
4.编译安装:make && make install
5.在 /usr/local/nginx目录下,可以看到如下4个目录
   conf配置文件,html网页文件,logs日志文件,sbin主要二进制程序
6.启动命令:/usr/local/nginx/sbin/nginx
  关闭命令:/usr/local/nginx/sbin/nginx -s stop
  重启命令:/usr/local/nginx/sbin/nginx -s reload
7.访问浏览器:http://192.168.122.133(看到欢迎页面说明没问题)

注意:如果出现这个错误:./configure: error: C compiler cc is not found
执行这个命令:yum -y install gcc gcc-c++ autoconf automake make
```





Keepalived：

首先介绍一下Keepalived,它是一个高性能的服务器高可用或热备解决方案,Keepalived主要防止服务器单点故障的问题,可以通过其与Nginx的配合实现web服务器端的高可用.
Keepalived以VRRP协议为实现基础,使用VRRP协议来实现高可用性(HA).VRRP(Virtual Router Redundacy Protocol)协议用于实现路由器冗余的协议,VRRP协议将两台或多台路由器设备虚拟成一个设备,向外提供虚拟路由IP(一个或多个)。

安装以及部署：

```java
第一步：安装keepalived依赖的包
	yum install -y gcc
    yum install -y openssl-devel
	yum install -y libnl3-devel
	yum install -y popt-devel
	yum install -y iptables-devel
	yum install -y libnfnetlink-devel
	yum install -y psmisc
第二步：编译安装keepalived
	将keepalived的安装包 上传到/usr/local/software 目录下  
	cd /usr/local/software
	tar -zxvf keepalived-1.2.19.tar.gz -C /usr/local  
	cd /usr/local/keepalived-1.2.19  
	./configure --prefix=/usr/local/keepalived  
	make && make install 
第三步：将 keepalived 安装成 Linux 系统服务
	安装完成之后， 需要做一些工作复制默认配置文件到 默认路径  
	mkdir /etc/keepalived  
	cp /usr/local/keepalived/etc/keepalived/keepalived.conf /etc/keepalived/  
	cp /usr/local/keepalived/sbin/keepalived /usr/sbin/  
	cp /usr/local/keepalived/etc/sysconfig/keepalived /etc/sysconfig/  
	cd /usr/local/keepalived-1.2.19  
	cp ./keepalived/etc/init.d/keepalived.init /etc/init.d/
	chmod 755 /etc/init.d/keepalived.init 
第四步：编写nginx检测脚本:
vi /etc/keepalived/nginx_check.sh
内容如下：  
#!/bin/bash  
A=`ps -C nginx –no-header |wc -l`  
if [ $A -eq 0 ];then  
    /usr/local/nginx/sbin/nginx  
    sleep 2  
    if [ `ps -C nginx --no-header |wc -l` -eq 0 ];then  
        killall keepalived  
    fi  
fi  
赋予执行权限  
chmod +x /etc/keepalived/nginx_check.sh 


启动命令:
  keepalived
```

修改Master配置

```java
修改keepalived的Master配置文件:vi /etc/keepalived/keepalived.conf 
! Configuration File for keepalived       
global_defs {      
   router_id wolfcode                           ##路由器标志    
}    
# 集群资源监控，组合track_script进行    
vrrp_script check_haproxy {    
	script "/etc/keepalived/nginx_check.sh"  #检测 nginx 状态的脚本路径  
	interval 2  #检测时间间隔  
	weight -20  #条件成立 权重减20  
}    
vrrp_instance PROXY {    
	# 设置当前主机为主节点，如果是备用节点，则设置为BACKUP   
	state MASTER
	# 指定HA监测网络接口，可以用ifconfig查看来决定设置哪一个    
	interface ens32
	# 虚拟路由标识，同一个VRRP实例要使用同一个标识，主备机    
	virtual_router_id 80    
	# 因为当前环境中VRRP组播有问题，改为使用单播发送VRRP报文  如果VRRP组播没问题，以下这块的内容可以注释掉。  
	# 这个地方需要关注，之前未做此设置，结果主备节点互相不能发现，因此主备节点都升级成了MASTER，并且绑定了VIP    
	# 主节点时，内容为：    
	unicast_src_ip 192.168.122.133
	# 设置优先级，确保主节点的优先级高过备用节点  
	priority 100    
	# 用于设定主备节点间同步检查时间间隔    
	advert_int 2    
	# 设置主备节点间的通信验证类型及密码，同一个VRRP实例中需一致    
	authentication {    
		auth_type PASS    
		auth_pass wolfcode
	}    
	# 集群资源监控，组合vrrp_script进行    
	track_script {    
		check_haproxy    
	}    
	# 设置虚拟IP地址，当keepalived状态切换为MASTER时，此IP会自动添加到系统中    
	# 当状态切换到BACKUP时，此IP会自动从系统中删除    
	# 可以通过命令ip add查看切换后的状态    
	virtual_ipaddress {    
		192.168.122.110  #虚拟ip配置完之后就用它访问    
	}    
}  
```

修改Slave配置：

```java
修改keepalived的Slave配置文件:vi /etc/keepalived/keepalived.conf 
! Configuration File for keepalived       
global_defs {      
   router_id wolfcode                           ##路由器标志    
}    
# 集群资源监控，组合track_script进行    
vrrp_script check_haproxy {    
	script "/etc/keepalived/nginx_check.sh"  #检测 nginx 状态的脚本路径  
	interval 2  #检测时间间隔  
	weight -20  #条件成立 权重减20  
}    
vrrp_instance PROXY {    
	# 设置当前主机为主节点，如果是备用节点，则设置为BACKUP   
	state BACKUP
	# 指定HA监测网络接口，可以用ifconfig查看来决定设置哪一个    
	interface ens32
	# 虚拟路由标识，同一个VRRP实例要使用同一个标识，主备机    
	virtual_router_id 80    
	# 因为当前环境中VRRP组播有问题，改为使用单播发送VRRP报文  如果VRRP组播没问题，以下这块的内容可以注释掉。  
	# 这个地方需要关注，之前未做此设置，结果主备节点互相不能发现，因此主备节点都升级成了MASTER，并且绑定了VIP    
	# 主节点时，内容为：    
	unicast_src_ip 192.168.122.134  
	# 设置优先级，确保主节点的优先级高过备用节点  
	priority 90    
	# 用于设定主备节点间同步检查时间间隔    
	advert_int 2    
	# 设置主备节点间的通信验证类型及密码，同一个VRRP实例中需一致    
	authentication {    
		auth_type PASS    
		auth_pass wolfcode
	}    
	# 集群资源监控，组合vrrp_script进行    
	track_script {    
		check_haproxy    
	}    
	# 设置虚拟IP地址，当keepalived状态切换为MASTER时，此IP会自动添加到系统中    
	# 当状态切换到BACKUP时，此IP会自动从系统中删除    
	# 可以通过命令ip add查看切换后的状态    
	virtual_ipaddress {    
		192.168.122.110  #虚拟ip配置完之后就用它访问    
	}    
}
```







## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
