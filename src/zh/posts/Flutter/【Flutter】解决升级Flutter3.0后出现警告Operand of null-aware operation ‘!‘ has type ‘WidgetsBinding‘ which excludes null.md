---
date: 2021-08-09 21:55:59

title: 【Flutter】解决升级Flutter3.0后出现警告Operand of null-aware operation ‘!‘ has type ‘WidgetsBinding‘ which excludes null
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【Flutter】解决升级Flutter3.0后出现警告Operand of null-aware operation ‘!‘ has type ‘WidgetsBinding‘ which excludes null

# 出现场景

将[Flutter](https://so.csdn.net/so/search?q=Flutter&spm=1001.2101.3001.7020) SDK升级到3.0，运行时报以下警告。
虽然不影响程序的运行，但是看着很烦。

```bash
lib/stress_test/stress_test_page.dart:120:22: Warning: Operand of null-aware operation '!' has type 'WidgetsBinding' which excludes null.
 - 'WidgetsBinding' is from 'package:flutter/src/widgets/binding.dart' ('../../develop_env/flutter_3.0/packages/flutter/lib/src/widgets/binding.dart').
      WidgetsBinding.instance!.addPostFrameCallback((timeStamp) {
                     ^
```

# 解决方案

这是因为在Flutter 3.0中，binding的instance是不可为空的，所以不需要使用`!`。

下面有2种情况。

## 三方依赖库

如果是依赖的库要使用到了Binding.instance，去pub上看看库的新版本有没有兼容3.0。如果有就升级库的版本。

比如我的项目用到了getx 4.6.1，是Flutter 3.0出来之前的版本。

```bash
../../develop_env/flutter_3.0/.pub-cache/hosted/pub.flutter-io.cn/get-4.6.1/lib/get_state_manager/src/simple/get_controllers.dart:96:20: Warning: Operand of null-aware operation '!' has type 'WidgetsBinding' which excludes null.
 - 'WidgetsBinding' is from 'package:flutter/src/widgets/binding.dart' ('../../develop_env/flutter_3.0/packages/flutter/lib/src/widgets/binding.dart').
    WidgetsBinding.instance!.removeObserver(this);
                   ^
```

去pub上查看更新记录(changelog)，可以看到4.6.2兼容了Flutter 3.0。

```
[4.6.5] #
Fix pub dev score

[4.6.4] 
Added backward compatibility with flutter 2.

[4.6.3] 
Fix SDK constraints

[4.6.2] 
Added compatibility with flutter 3.0

[4.6.1] 
Fix GetConnect on Flutter web
```

所以我们只需要将get的版本更改为4.6.2或以上即可。

```yaml
dependencies:
  # get: ^4.6.1
  get: ^4.6.2
```

## 本地代码

如果是项目中有用到Binding.instance，可以使用[dart](https://so.csdn.net/so/search?q=dart&spm=1001.2101.3001.7020)命令`dart fix --apply`自动修复，这样就会自动把instance后面的`!`去掉。

```bash
adodeMacBook-Pro:fusion_pro wangyang$ dart fix --apply
Computing fixes in fusion_pro... 105.4s
Applying fixes...                      0.0s

lib/pages/splash_page.dart
  UNNECESSARY_NON_NULL_ASSERTION • 1 fix

lib/stress_test/stress_test_page.dart
  UNNECESSARY_NON_NULL_ASSERTION • 1 fix

2 fixes made in 2 files.
```



## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！

