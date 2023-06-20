---
date: 2021-04-20 21:10:20

title: Linux服务器下部署vue 2.0项目
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



### 一、安装VUE环境

1.wget指定进行下载，下载后文件默认存在根目录下的root包下面；

```
wget https://nodejs.org/dist/v16.14.0/node-v16.14.0-linux-x64.tar.xz
```



解压缩

```
xz -d node-v16.14.0-linux-x64.tar.xz  #将xz格式解压为tar

tar -xvf node-v16.14.0-linux-x64.tar  #将tar解压为文件
```



重命名文件夹

```
mv node-v16.14.0-linux-x64 nodeJS-V16.14.0

```



配置node.js环境变量

```
vim /etc/profile
```



进入编辑,在文件最下面加上如下字段

```
export NODEJS_HOME=/root/nodeJS-V16.14.0
export PATH=$NODEJS_HOME/bin:$PATH
```


个人比较喜欢用Xftp将profile文件传输到windows系统下进行配置后再覆盖回去

配置完成后使用source命令重新执行刚修改的初始化文件，使之立即生效，而不必注销并重新登录

```
source /etc/profile
```


检查环境变量是否配置成功

```
node -v
```


安装WebPackage

```
npm install webpack -g --registry=https://registry.npm.taobao.org
```



### 二、Nginx环境搭建配置

wget指定进行下载，下载后文件默认存在根目录下的 root 下面；

```
1.wget https://nginx.org/download/nginx-1.21.6.tar.gz
```


解压缩

```
tar -zxvf nginx-1.21.6.tar.gz
```


进入nginx文件夹

```
cd /root/nginx-1.21.6
```


检查配置

```
./configure
```


安装gcc环境，有就不需要安装了

```
yum install gcc-c++
```


安装PCRE依赖库

```
yum install -y pcre pcre-devel
```


安装zlib 依赖库

```
yum install -y zlib zlib-devel
```


安装OpenSSL安全套接字层密码库

```
yum install -y openssl openssl-devel
```


再次执行配置检查命令

```
./configure

```


编译安装nginx

```
make install
```


查找默认安装路径

```
whereis nginx
```



配置nginx环境变量

```
vim /etc/profile
```


进入编辑,在文件最下面加上如下字段

```
export PATH=$PATH:/usr/local/nginx/sbin
```


个人比较喜欢用Xftp将profile文件传输到windows系统下进行配置后再覆盖回去

初始化配置

```
source /etc/profile
```


检查环境变量是否配置成功

```
nginx -v
```


启动nginx

```
nginx
```


查看nginx是否启动，远程访问服务器，跳出nginx欢迎界面就算配置成功了！


nginx常用命令

```
启动服务：nginx
退出服务：nginx -s quit
强制关闭服务：nginx -s stop
重载服务：nginx -s reload　　（重载服务配置文件，类似于重启，但服务不会中止）
验证配置文件：nginx -t
使用配置文件：nginx -c "配置文件路径"
使用帮助：nginx -h
```



### 三、发布VUE项目

##### 打包VUE项目

1.首先配置好线上环境的路径：prod.env 

![image-20220428084247115](https://brath.cloud/blogImg/image-20220428084247115.png)

```vue
module.exports = {
	NODE_ENV: '"production"',
	ENV_CONFIG: '"prod"',
	MANAGEMENT_SERVICE_API: '"http://42.193.125.92:7815"',
}
```



2.控制台输入 npm run build:prod

![image-20220428084349346](https://brath.cloud/blogImg/image-20220428084349346.png)



3.打包完会生成一个dist文件夹

![image-20220428084359625](https://brath.cloud/blogImg/image-20220428084359625.png)



4.将dist文件夹内容覆盖到/usr/local/nginx/html目录下面

![image-20220428084414353](https://brath.cloud/blogImg/image-20220428084414353.png)

5.修改nginx配置

```
/usr/local/nginx/conf/nginx.conf 编辑打开
```

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    keepalive_timeout  65;

    server {
        listen       8099;  #配置当前服务端口
        server_name  localhost; #配置当前服务IP
        
        location / {
            root   html/dist; #配置服务根目录
            index  index.html index.htm; #配置服务索引页面
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}

```



6.重启或关闭重开Nginx

```nginx
nginx -s reload #重启


nginx -s stop #强制停止

nginx #开启

```

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
