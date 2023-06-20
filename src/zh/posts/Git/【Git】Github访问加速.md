---
date: 2021-10-27 15:09:07

title: Github访问加速方法
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



## 1. 获取延迟最小IP地址


首先,打开

http://tool.chinaz.com/dns?type=1&host=github.com&ip=

查询Github的地址，选择延迟最小的

![1640222585966](E:\md图片\1640222585966.png)

## **2. 修改系统Hosts文件**


接着,打开系统hosts文件(需管理员权限)。
路径：C:\Windows\System32\drivers\etc

> mac或者其他linux系统的话,是/etc下的hosts文件,需要切入到root用户修改

```text
# Copyright (c) 1993-2009 Microsoft Corp. 
# 
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows. 
# 
# This file contains the mappings of IP addresses to host names. Each 
# entry should be kept on an individual line. The IP address should 
# be placed in the first column followed by the corresponding host name. 
# The IP address and the host name should be separated by at least one 
# space. 
# 
# Additionally, comments (such as these) may be inserted on individual 
# lines or following the machine name denoted by a '#' symbol. 
# 
# For example: 
# 
#      102.54.94.97     rhino.acme.com          # source server 
#       38.25.63.10     x.acme.com              # x client host 




# localhost name resolution is handled within DNS itself. 
#   127.0.0.1       localhost 
#   ::1             localhost 


52.192.72.89    github.com
```

并在末尾添加记录并保存。(需管理员权限，注意IP地址与域名间需留有空格)

## **3. 刷新系统DNS缓存**


最后,Windows+X 打开系统命令行（管理员身份）或powershell

运行 ipconfig /flushdns 手动刷新系统DNS缓存。

> mac系统修改完hosts文件,保存并退出就可以了.不要要多一步刷新操作.
> centos系统执行/etc/init.d/network restart命令 使得hosts生效

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
