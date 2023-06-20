---
date: 2021-09-28 14:06:33

title: Docker的基础用法
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 1 Docker架构

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/60e8fc2bc92e48d0b96c0eaf079483c6.png)

镜像(Image)：Docker 镜像(Image)，就相当于是 一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包 含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。
容器(Container)：镜像(Image)和容器(Contain er)的关系，就像是面向对象程序设计中的类和对象一 样，镜像是静态的定义，容器是镜像运行时的实体。容 器可以被创建、启动、停止、删除、暂停等。
仓库(Repository)：仓库可看成一个代码控制中心， 用来保存镜像

# 2 Docker镜像与镜像仓库

在docker中仓库的名字是以应用的名称取名的。

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/20210104183520743.jpg)

镜像是静态的，而容器是动态的，容器有其生命周期，镜像与容器的关系类似于程序与进程的关系。镜像类似于文件系统中的程序文件，而容器则类似于将一个程序运行起来的状态，也即进程。所以容器是可以删除的，容器被删除后其镜像是不会被删除的。

# 3 Docker对象

When you use docker, you are creating and using images, containers, networks, volumes, pluginns, and other objects.(当你使用docker时，你正在创建和使用镜像、容器、网络、卷、插件和其他对象)

IMAGES(镜像)

An image is a read-only template with instructions for creating a docker container.(镜像是一个只读模板，它带有创建docker容器的指令。)
Often, an image is based on another image, with some additional customization.(通常，一个镜像基于另一个镜像，并带有一些额外的自定义。)
You might create your own images or you might only use those created by others and published in a registry.(您可以创建自己的镜像，也可以使用其他人创建并在仓库中发布的镜像。)
CONTAINERS(容器)

A conntainer is a runnable instance of an image.(容器是镜像的可运行实例。)
You can create, run, stop, move, or delete a container using the docker API or CLI.(您可以通过docker API或CLI创建、运行、停止、移动或删除容器。)
You can connect a container to one or more networks, attach storage to it, or even create a new image based on its current state.(您可以将容器连接到一个或多个网络，为其附加存储，甚至可以根据其当前状态创建新镜像。)

# 4 Docker安装及使用

4.1 Docker安装

```shell
[root@Docker ~]# wget -O /etc/yum.repos.d/docker-ce.repo https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/docker-ce.repo
[root@Docker ~]# sed -i 's@https://download.docker.com@https://mirrors.tuna.tsinghua.edu.cn/docker-ce@g' /etc/yum.repos.d/docker-ce.repo
[root@Docker ~]# yum clean all
21 文件已删除
[root@Docker ~]# yum -y install docker-ce
```

# 4.2 Docker加速

为什么需要加速器？因为docker在拉取镜像时，是去国外拉取的所以会比较慢，使用加速器可以解决这个问题

docker-ce的配置文件是/etc/docker/daemon.json，此文件默认不存在，需要我们手动创建并进行配置，而docker的加速就是通过配置此文件来实现的

#### docker的加速有多种方式

- docker cn
- 中国科技大学加速器
- 阿里云加速器（需要通过阿里云开发者平台注册帐号，免费使用个人私有的加速器）

```shell
[root@Docker ~]# systemctl enable --now docker    //启动docker服务
Created symlink /etc/systemd/system/multi-user.target.wants/docker.service → /usr/lib/systemd/system/docker.service.
[root@Docker ~]# cat > /etc/docker/daemon.json <<EOF
{
     "registry-mirrors": ["https://xj3hc284.mirror.aliyuncs.com"]
}
EOF
[root@Docker ~]# systemctl daemon-reload
[root@Docker ~]# systemctl restart docker    //重启docker服务

```

## 4.3 Docker常用操作

### 4.3.1 docker version(查看版本号)

```shell
[root@Docker ~]# docker version
Client: Docker Engine - Community    //docker客户端版本
 Version:           20.10.11
 API version:       1.41
 Go version:        go1.16.9
 Git commit:        dea9396
 Built:             Thu Nov 18 00:36:58 2021
 OS/Arch:           linux/amd64
 Context:           default
 Experimental:      true

Server: Docker Engine - Community    //docker服务端版本
 Engine:
  Version:          20.10.11
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.16.9
  Git commit:       847da18
  Built:            Thu Nov 18 00:35:20 2021
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:    //容器版本
  Version:          1.4.12
  GitCommit:        7b11cfaabd73bb80907dd23182b9347b4245eb5d
 runc:
  Version:          1.0.2
  GitCommit:        v1.0.2-0-g52b36a2
 docker-init:    //docker初始化版本
  Version:          0.19.0
  GitCommit:        de40ad0
```

### 4.3.2 docker info(显示整个系统的信息)

```shell
[root@Docker ~]# docker info
Client:        #docker客户端版本信息
 Context:    default        #上下文
 Debug Mode: false
 Plugins:        #插件
  app: Docker App (Docker Inc., v0.9.1-beta3)
  buildx: Build with BuildKit (Docker Inc., v0.6.3-docker)
  scan: Docker Scan (Docker Inc., v0.9.0)

Server:        #docker服务端版本信息
 Containers: 0        #容器个数
  Running: 0        #运行个数
  Paused: 0        #暂停状态个数
  Stopped: 0        #停止状态个数
 Images: 0        #镜像个数
 Server Version: 20.10.11        #服务版本号
 Storage Driver: overlay2        #存储驱动
  Backing Filesystem: xfs        #后端文件系统
  Supports d_type: true
  Native Overlay Diff: true
  userxattr: false
 Logging Driver: json-file        # 日志驱动
 Cgroup Driver: cgroupfs
 Cgroup Version: 1
 Plugins:        # 插件
  Volume: local
  Network: bridge host ipvlan macvlan null overlay
  Log: awslogs fluentd gcplogs gelf journald json-file local logentries splunk syslog
 Swarm: inactive
 Runtimes: io.containerd.runc.v2 io.containerd.runtime.v1.linux runc
 Default Runtime: runc
 Init Binary: docker-init
 containerd version: 7b11cfaabd73bb80907dd23182b9347b4245eb5d
 runc version: v1.0.2-0-g52b36a2
 init version: de40ad0
 Security Options:        # 安全选项
  seccomp
   Profile: default
 Kernel Version: 4.18.0-257.el8.x86_64        # 内核版本号
 Operating System: CentOS Stream 8        # 操作系统
 OSType: linux        #操作系统 类型
 Architecture: x86_64        #架构
 CPUs: 4        # CPU核心数
 Total Memory: 7.559GiB        #总内存 
 Name: Docker
 ID: 4MEZ:OEWB:CPHP:3PYE:54J3:46XO:B5CX:JHYB:OW5Q:TWJP:PWHO:JJSM           
 Docker Root Dir: /var/lib/docker        #docker默认目录
 Debug Mode: false
 Registry: https://index.docker.io/v1/        # 仓库地址
 Labels:        #标签
 Experimental: false
 Insecure Registries:
  127.0.0.0/8
 Registry Mirrors:        #加速器
  https://xj3hc284.mirror.aliyuncs.com/
 Live Restore Enabled: false
```

### 4.3.3 docker search(在docker hub中搜索镜像)

```shell
[root@Docker ~]# docker search nginx
NAME                              DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
nginx                             Official build of Nginx.                        15893     [OK]       
jwilder/nginx-proxy               Automated Nginx reverse proxy for docker con…   2098                 [OK]
richarvey/nginx-php-fpm           Container running Nginx + PHP-FPM capable of…   819                  [OK]
jc21/nginx-proxy-manager          Docker container for managing Nginx proxy ho…   285                  
linuxserver/nginx                 An Nginx container, brought to you by LinuxS…   160                  
tiangolo/nginx-rtmp               Docker image with Nginx using the nginx-rtmp…   146                  [OK]
jlesage/nginx-proxy-manager       Docker container for Nginx Proxy Manager        144                  [OK]
alfg/nginx-rtmp                   NGINX, nginx-rtmp-module and FFmpeg from sou…   110                  [OK]
nginxdemos/hello                  NGINX webserver that serves a simple page co…   79                   [OK]
privatebin/nginx-fpm-alpine       PrivateBin running on an Nginx, php-fpm & Al…   60                   [OK]
nginx/nginx-ingress               NGINX and  NGINX Plus Ingress Controllers fo…   57                   
nginxinc/nginx-unprivileged       Unprivileged NGINX Dockerfiles                  54                   
nginxproxy/nginx-proxy            Automated Nginx reverse proxy for docker con…   28                   
staticfloat/nginx-certbot         Opinionated setup for automatic TLS certs lo…   25                   [OK]
nginx/nginx-prometheus-exporter   NGINX Prometheus Exporter for NGINX and NGIN…   22                   
schmunk42/nginx-redirect          A very simple container to redirect HTTP tra…   19                   [OK]
centos/nginx-112-centos7          Platform for running nginx 1.12 or building …   16                   
centos/nginx-18-centos7           Platform for running nginx 1.8 or building n…   13                   
flashspys/nginx-static            Super Lightweight Nginx Image                   11                   [OK]
bitwarden/nginx                   The Bitwarden nginx web server acting as a r…   11                   
mailu/nginx                       Mailu nginx frontend                            9                    [OK]
sophos/nginx-vts-exporter         Simple server that scrapes Nginx vts stats a…   7                    [OK]
ansibleplaybookbundle/nginx-apb   An APB to deploy NGINX                          3                    [OK]
arnau/nginx-gate                  Docker image with Nginx with Lua enabled on …   1                    [OK]
wodby/nginx                       Generic nginx                                   1                    [OK]
```

### 4.3.4 docker pull(拉取镜像)

```shell
[root@Docker ~]# docker pull nginx
Using default tag: latest
latest: Pulling from library/nginx
eff15d958d66: Pull complete 
1e5351450a59: Pull complete 
2df63e6ce2be: Pull complete 
9171c7ae368c: Pull complete 
020f975acd28: Pull complete 
266f639b35ad: Pull complete 
Digest: sha256:097c3a0913d7e3a5b01b6c685a60c03632fc7a2b50bc8e35bcaa3691d788226e
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
```

### 4.3.5 docker images(列出系统当前镜像)

```shell
[root@Docker ~]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
nginx        latest    ea335eea17ab   13 days ago   141MB
```

### 4.3.6 docker image history(查看指定镜像的历史)

```shell
[root@Docker ~]# docker image history nginx
IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
ea335eea17ab   13 days ago   /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B        
<missing>      13 days ago   /bin/sh -c #(nop)  STOPSIGNAL SIGQUIT           0B        
<missing>      13 days ago   /bin/sh -c #(nop)  EXPOSE 80                    0B        
<missing>      13 days ago   /bin/sh -c #(nop)  ENTRYPOINT ["/docker-entr…   0B        
<missing>      13 days ago   /bin/sh -c #(nop) COPY file:09a214a3e07c919a…   4.61kB    
<missing>      13 days ago   /bin/sh -c #(nop) COPY file:0fd5fca330dcd6a7…   1.04kB    
<missing>      13 days ago   /bin/sh -c #(nop) COPY file:0b866ff3fc1ef5b0…   1.96kB    
<missing>      13 days ago   /bin/sh -c #(nop) COPY file:65504f71f5855ca0…   1.2kB     
<missing>      13 days ago   /bin/sh -c set -x     && addgroup --system -…   61.1MB    
<missing>      13 days ago   /bin/sh -c #(nop)  ENV PKG_RELEASE=1~bullseye   0B        
<missing>      13 days ago   /bin/sh -c #(nop)  ENV NJS_VERSION=0.7.0        0B        
<missing>      13 days ago   /bin/sh -c #(nop)  ENV NGINX_VERSION=1.21.4     0B        
<missing>      13 days ago   /bin/sh -c #(nop)  LABEL maintainer=NGINX Do…   0B        
<missing>      2 weeks ago   /bin/sh -c #(nop)  CMD ["bash"]                 0B        
<missing>      2 weeks ago   /bin/sh -c #(nop) ADD file:a2405ebb9892d98be…   80.4MB    
```

### 4.3.7 docker image inspect(查看指定镜像的详细信息)

```shell
[root@Docker ~]# docker image inspect nginx
[
    {
        "Id": "sha256:ea335eea17ab984571cd4a3bcf90a0413773b559c75ef4cda07d0ce952b00291",
        "RepoTags": [
            "nginx:latest"
        ],
        "RepoDigests": [
            "nginx@sha256:097c3a0913d7e3a5b01b6c685a60c03632fc7a2b50bc8e35bcaa3691d788226e"
        ],
        "Parent": "",
        "Comment": "",
        "Created": "2021-11-17T10:38:14.652464384Z",
        "Container": "8a038ff17987cf87d4b7d7e2c80cb83bd2474d66e2dd0719e2b4f7de2ad6d853",
        "ContainerConfig": {
            "Hostname": "8a038ff17987",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "80/tcp": {}
            },
```

### 4.3.8 删除镜像

```shell
[root@Docker ~]# docker ps -a
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                     PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   57 minutes ago   Exited (0) 6 minutes ago             youthful_euclid

[root@Docker ~]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
httpd        latest    ad17c88403e2   12 days ago   143MB
nginx        latest    ea335eea17ab   13 days ago   141MB

[root@Docker ~]# docker rmi ad17c88403e2
Untagged: httpd:latest
Untagged: httpd@sha256:1d71eef54c08435c0be99877c408637f03112dc9f929fba3cccdd15896099b02
Deleted: sha256:ad17c88403e2cedd27963b98be7f04bd3f903dfa7490586de397d0404424936d
Deleted: sha256:a59e7dfeeb485a8a45b1fcce812b10fbd955d304fa2e9ca43b10b16a8ee1afb8
Deleted: sha256:9592080464aa1890ed187c42a13ecc9f175e975a96a3fad28df0559ad0c08b9d
Deleted: sha256:42d2debfa0c419f7f89affa3e9b62d1b7e54dc6654dbd186d4654ee3661c44c8
Deleted: sha256:136822c50a75392f4ce06461fa4894aa7d1e060ec0dd4782e13e2d9829df50a3
[root@Docker ~]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
nginx        latest    ea335eea17ab   13 days ago   141MB
```

### 4.3.9 docker create(创建容器)

此命令只会创建容器，而不会运行容器

```shell
[root@Docker ~]# docker create nginx
8442117bc0c7b85609a77229433413a85ac0fa951fe9c0efc3c340b1299fbd74
```

### 4.3.10 docker ps(列出容器)

```shell
[root@Docker ~]# docker ps         //查看正在运行的容器
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

[root@Docker ~]# docker ps -a        //查看所有容器
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS    PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   3 minutes ago   Created             youthful_euclid
```

### 4.3.11 docker start(启动容器)

```shell
[root@Docker ~]# docker start 8442117bc0c7        #启动容器，后面接容器的ID号，ID号可以简写
8442117bc0c7

[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS          PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   8 minutes ago   Up 14 seconds   80/tcp    youthful_euclid
```

### 4.3.12 docker attach(进入容器)

在当前shell下attach连接指定运行镜像，以这种方式进入容器，此时容器会一直占用前台，如果退出容器，容器就会停止

```shell
[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   50 minutes ago   Up 30 seconds   80/tcp    youthful_euclid

[root@Docker ~]# docker attach 8442117bc0c7

[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

### 4.3.13 docker exec(进入容器)

用这个命令进入容器后台运行就算是退出了容器，容器也不会停止运行

```shell
[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS         PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   26 minutes ago   Up 3 seconds   80/tcp    youthful_euclid

[root@Docker ~]# docker exec -it 8442117bc0c7 /bin/bash
root@8442117bc0c7:/# ls
bin  boot  dev	docker-entrypoint.d  docker-entrypoint.sh  etc	home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@8442117bc0c7:/# exit
exit

[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   27 minutes ago   Up 23 seconds   80/tcp    youthful_euclid
```

### 4.3.14 docker inspect(查看容器的信息详细)

通过查看详细信息可以查看其容器的IP地址

```shell
[root@Docker ~]# docker inspect 8442117bc0c7
[
    {
        "Id": "8442117bc0c7b85609a77229433413a85ac0fa951fe9c0efc3c340b1299fbd74",
        "Created": "2021-12-01T07:28:48.929261547Z",
        "Path": "/docker-entrypoint.sh",
        "Args": [
            "nginx",
            "-g",
            "daemon off;"
        ],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 5390,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2021-12-01T07:36:41.636489391Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
......
```

### 4.3.15 docker logs(查看容器日志)

```shell
[root@Docker ~]# docker logs 8442117bc0c7
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
2021/12/01 07:36:41 [notice] 1#1: using the "epoll" event method
2021/12/01 07:36:41 [notice] 1#1: nginx/1.21.4
2021/12/01 07:36:41 [notice] 1#1: built by gcc 10.2.1 20210110 (Debian 10.2.1-6) 
2021/12/01 07:36:41 [notice] 1#1: OS: Linux 4.18.0-257.el8.x86_64
2021/12/01 07:36:41 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2021/12/01 07:36:41 [notice] 1#1: start worker processes
2021/12/01 07:36:41 [notice] 1#1: start worker process 31
2021/12/01 07:36:41 [notice] 1#1: start worker process 32
2021/12/01 07:36:41 [notice] 1#1: start worker process 33
2021/12/01 07:36:41 [notice] 1#1: start worker process 34
172.17.0.1 - - [01/Dec/2021:07:43:23 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/7.61.1" "-"
172.17.0.1 - - [01/Dec/2021:07:43:44 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/7.61.1" "-"
172.17.0.1 - - [01/Dec/2021:07:43:45 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/7.61.1" "-"
172.17.0.1 - - [01/Dec/2021:07:43:46 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/7.61.1" "-"
172.17.0.1 - - [01/Dec/2021:07:43:46 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/7.61.1" "-"
```

### 4.3.16 docker stop(停止容器)

```shell
[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS         PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   16 minutes ago   Up 8 minutes   80/tcp    youthful_euclid

[root@Docker ~]# docker stop 8442117bc0c7
8442117bc0c7

[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

[root@Docker ~]# docker ps -a 
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                     PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   16 minutes ago   Exited (0) 5 seconds ago             youthful_euclid
```

### 4.3.17 docker restart(重启容器)

```shell
[root@Docker ~]# docker ps -a 
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                      PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   17 minutes ago   Exited (0) 46 seconds ago             youthful_euclid

[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

[root@Docker ~]# docker restart 8442117bc0c7
8442117bc0c7

[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS         PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   17 minutes ago   Up 3 seconds   80/tcp    youthful_euclid
```

### 4.3.18 docker kill(杀死正在运行的容器)

```shell
[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS         PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   20 minutes ago   Up 2 minutes   80/tcp    youthful_euclid

[root@Docker ~]# docker kill 8442117bc0c7 
8442117bc0c7

[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

[root@Docker ~]# docker ps -a
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                       PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   20 minutes ago   Exited (137) 4 seconds ago             youthful_euclid
```

### 4.3.19 docker run(创建并启动容器)

此命令会做三件事情，首先先查看本地是否都对应的镜像，如果没有就拉取，然后创建容器，然后运行容器

```shell
[root@Docker ~]# docker ps -a
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                     PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   35 minutes ago   Exited (0) 5 minutes ago             youthful_euclid

[root@Docker ~]# docker run -it httpd /bin/bash        #此命令的作用是，拉取一个httpd的镜像，然后创建容器并运行，-it表示以交互的方式进入终端，/bin/bash表示终端的环境
Unable to find image 'httpd:latest' locally
latest: Pulling from library/httpd
eff15d958d66: Already exists 
ba1caf8ba86c: Pull complete 
ab86dc02235d: Pull complete 
0d58b11d2867: Pull complete 
e88da7cb925c: Pull complete 
Digest: sha256:1d71eef54c08435c0be99877c408637f03112dc9f929fba3cccdd15896099b02
Status: Downloaded newer image for httpd:latest
root@a01b8d80a160:/usr/local/apache2# ls
bin  build  cgi-bin  conf  error  htdocs  icons  include  logs	modules
```

### 4.3.20 docker rm(删除容器)

删除一个或者多个容器，只能删除停止状态的容器或者-f强制删除

```shell
[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS         PORTS     NAMES
a01b8d80a160   httpd     "/bin/bash"   10 minutes ago   Up 3 seconds   80/tcp    hardcore_varahamihira

[root@Docker ~]# docker rm a01b8d80a160
Error response from daemon: You cannot remove a running container a01b8d80a1609e81d8d8121b3fc3c0f53a676340b3b093b353a7f9bb498fe0e6. Stop the container before attempting removal or force remove

[root@Docker ~]# docker rm -f a01b8d80a160
a01b8d80a160

[root@Docker ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

[root@Docker ~]# docker ps -a
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                      PORTS     NAMES
8442117bc0c7   nginx     "/docker-entrypoint.…"   48 minutes ago   Exited (0) 18 minutes ago             youthful_euclid
```

# 5 Docker event state

![在这里插入图片描述](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/20210104183609729.jpg)



本文来自CSDN

原文链接：https://blog.csdn.net/weixin_46727129/article/details/121665668





























## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
