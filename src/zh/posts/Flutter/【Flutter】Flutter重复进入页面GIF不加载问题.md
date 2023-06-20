---
date: 2022-02-15 02:58:23

title: Flutter下加载本地资源GIF，怎么做到每次进入页面都会出现动画效果？
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



1.问题：Flutter加载GIF之后，只有第一次进入页面才会执行动画，接下来都不会执行了
2.原因：因为Flutter的图片缓存机制，在第一次加载图片后，会将图片缓存下来，所以再次访问，你看见的还是上次的已经执行完毕的动画
3.解决：在dispose中把imageCache用clear方法清理掉

```dart
 String asset = "images/401.gif";
	Widget img = Image.asset("images/401.gif",key: UniqueKey(),);

  @override
  void initState() {
    super.initState();
      //初始化
    toast();
  }

  @override
  void dispose() {
    super.dispose();
      //清理缓存
		imageCache!.clear();
  }

  void toast() {
    DialogUtils.showErrorMessage("401",
        gravity: ToastGravity.CENTER, toastLength: Toast.LENGTH_SHORT);

    Future.delayed(Duration(seconds: 3), () {
      DialogUtils.showMessage("您没有权限访问......",
          gravity: ToastGravity.CENTER, toastLength: Toast.LENGTH_LONG);
    });
  }
```

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
