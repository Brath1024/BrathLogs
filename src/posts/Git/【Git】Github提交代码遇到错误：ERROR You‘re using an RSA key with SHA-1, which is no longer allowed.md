---
date: 2023-06-05 15:25:21

title: 【Git】Github提交代码遇到错误：ERROR You‘re using an RSA key with SHA-1, which is no longer allowed
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/扫码_搜索联合传播样式-标准色版.png)

# 【Git】Github提交代码遇到错误：ERROR You‘re using an RSA key with SHA-1, which is no longer allowed

ERROR: You’re using an RSA key with SHA-1, which is no longer allowed.
![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/efa1ce926ae34dfb99dfdd3516ec6fab.png)
通过baidu，从错误下面给出的官方文档 https://github.blog/2021-09-01-improving-git-protocol-security-github/ 可以看到，github对SSH密钥做了升级，原来的SHA-1，rsa等一些已经不支持了，由于我使用的是rsa，可能和大部分用户一样，所以今天在push代码时候遇到了这个问题，记录以下。
生成新的Ed25519密钥对：
`ssh-keygen -t ed25519 -C "your-email"`
一路回车。
会在.ssh目录下生成两个文件

> id_ed25519
> id_ed25519.pub

将id_ed25519.pub文件中的内容copy，拿出来到github上
这里：

![image-20230605155058169](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/image-20230605155058169.png)
添加一个新的ssh keys即可
验证key是否可用：使用 `ssh -T git@github.com `对ssh key 进行验证
![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/88a5bd8e286b4cc28319d49e6c0d0972.png)
之后就可以正常使用push命令上传了。



## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！