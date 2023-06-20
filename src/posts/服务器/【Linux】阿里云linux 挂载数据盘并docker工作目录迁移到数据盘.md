---
date: 2023-05-23 10:04:23

title: 【Linux】阿里云linux 挂载数据盘并docker工作目录迁移到数据盘
---
![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/扫码_搜索联合传播样式-标准色版.png)

# 【Linux】阿里云linux 挂载数据盘并docker工作目录迁移到数据盘

**一、挂载数据盘，分区-格式化-挂载**

1、fdisk -l 查看磁盘情况

执行命令fdisk -l 发现2个磁盘，但是磁盘nvme1n1没有分区，nvme0n1是有2个分区了。

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/cceb22f4006cbef75fcd0469ee6f66b4.png)

2、fdisk /dev/nvme1n1 执行创建分区

执行命令 fdisk /dev/nvme1n1

输入n再回车创建新分区：

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/549659e940ec22bb06edfaaff24fbcb9.png)



输入p再回车创建主分区：

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/b74a9ade7fe427394a9fd29c1341185d.png)



输入1设置分区号：

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/65ef7ff6d5b47dda182b008d7a76bf7a.png)



起始扇区设置，直接回车就可以：

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/49ba78c89a3adc99c197d3f86b1bfa0d.png)



扇区结束位置，直接回车就可以：

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/f90577aa65369904459b9d92c6812f42.png)



最后输入w再回车保存设置：

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/14aff319e909413dd137a79ecdaa5f5c.png)



3、格式化分区

运行 fdisk -lu /dev/nvme1n1 查看分区情况

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/e66c56ebcc4ff70a98e0d896e6c79a48.png)

格式化分区，并建立文件系统ext4。 执行命令：sudo mkfs.ext4 /dev/nvme1n1p1

注意：也有人说硬盘应该是买来就已经格式化过了的，说的好像也有那么些道理。但是我现在是nvme1n1这个硬盘根本看不到分区的情况下创建了一个新的分区nvme1n1p1 ，格式化一下这个分区我个人认为也没错。

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/0bac4af4597d43a13aa40c2c6bd37287.png)

4、挂载分区

执行命令：sudo mount /dev/nvme1n1p1 /mnt 将分区/dev/nvme1n1p1挂载到mnt目录下。

然后执行df 查看是否挂载成功 ，执行df -Th 查看新挂载的磁盘文件系统和其他磁盘是否一致。

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/06cef34afe1a743950a164cd40fe272f.png)

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/924b718ee9c86531e0221e614998cf05.png)

5、设置开机自动挂载

sudo vim /etc/fstab 使用这个命令进入 配置文件，然后按i键进入插入编辑模式

在文件末尾增加下面的一行

/dev/nvme1n1p1 /mnt ext4 defaults 0 0

按esc退出编辑，输入 :wq 保存退出。



**二、docker目录从系统盘迁移到数据盘**

1、确认已经将/dev/nvme1n1 这个数据硬盘的/dev/nvme1n1p1分区挂载到了mnt目录

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/06cef34afe1a743950a164cd40fe272f.png)

2、执行docker info命令，得到docker基本信息，其中可以看到 Docker Root Dir: /var/lib/docker和 Storage Driver: overlay2这两个信息，说明了docker程序文件安装在/var/lib/docker，其中overlay2为数据存储位置。

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/a2885575e1d6701f9d340f19e6ef7b2f.png)



3、先停止 Docker ，保证移动的时候数据完整，执行 service docker stop 命令停止 Docker daemon。 命令：systemctl stop docker

可以用ps 命令进一步检查：ps faux | grep -i docker

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/dd32ff8fb25e4b37f053b51533f4f896.png)

4、将 Docker 默认数据目录下的数据移动到一个备份的目录，例如 /mnt/Docker_data，执行命令:

mv /var/lib/docker /mnt/Docker_data

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/7080e757f909be46d25c0402119f9b70.png)

5、把Docker 的工作目录切换到/mnt/Docker_data/docker

（1）更改Docker 服务的service 文件： vi /lib/systemd/system/docker.service

（2）使用输入 /*ExecSt*art 搜索关键字 ， 找到这一行：ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock

改为：*ExecSt*art=/usr/bin/dockerd -g /mnt/Docker_data/docker -H fd:// --containerd=/run/containerd/containerd.sock

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/3132eaca23c769fef0fc97685485249b.png)

(3) 刷新docker服务 ：*sudo s*ystemctl daemon-reload

重启docker服务：*system*ctl start docker

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/455d262fec86518eda5c68c77bc3464e.png)

(4) 查看docker状态：systemctl status docker

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/e4859b458ec4262825ca347decd46183.png)



注意 ：如果查看状态出现了失败的红色的提示，那么就要返回第3步停止服务开始，再走一遍步骤，重新修改 Docker 服务的service 文件，比如我开始的时候-H 前面少了一个空格，就报红色错误了。

![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/b50944f9ba4c5ee837e8ab64113b002a.png)

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！