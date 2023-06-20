---
date: 2022-05-10 07:10:20

title: 【Flutter】flutter 在真机上调试卸载安装包后卡住没反应问题
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Flutter】flutter 在真机上调试卸载安装包后卡住没反应问题

# 问题描述

把自己手机插上数据线后，用 [flutter](https://so.csdn.net/so/search?q=flutter&spm=1001.2101.3001.7020) 进行真机调试，本来配合 vscode 跑得好好的，不知道是写了 bug 还是咋地，目标效果出不来，以为是热更新失败了，最后只好把安装在手机上的 app 卸载了，想当然地以为运行 `flutter run` 后在手机上会贴心的提示我重装一遍，哪知给我突然卡住了：

```shell
Running Gradle task 'assembleDebug'...
✓ Built build/app/outputs/flutter-apk/app-debug.apk.
Installing build/app/outputs/flutter-apk/app.apk...

```

一直卡在这个安装环节上，等半天是一点反应都没有，试了各种方法重启应用、改用 [Andriod](https://so.csdn.net/so/search?q=Andriod&spm=1001.2101.3001.7020) Studio 什么的，毛用没有，最后还得是在 [StackOveFlow](https://stackoverflow.com/) 上找到了法子：

# 解决方法：

Change the applicationId in **android\app\build.gradle** file like this:

from :

```json
defaultConfig {
	// TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
	applicationId "com.xxxxxxxxxxx.yyyyyy1"
}
```

to :

```json
defaultConfig {
	// TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
	applicationId "com.xxxxxxxxxxx.yyyyyy2"
}
```

改一下 flutter 工程目录下 `andriod\app` 中 `build.gradle` 文件中的 `applicationId` 重新 build 就能重新在手机上安装调试 app 了，我丢！
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
