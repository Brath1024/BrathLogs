---
date: 2021-10-12 17:33:07

title: 【Flutter】Flutter生命周期
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



### 【Flutter】Flutter生命周期

![img](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/cf191df81ef144b9bca93e0a385bdd8d.png)

## 一、[生命周期](https://so.csdn.net/so/search?q=生命周期&spm=1001.2101.3001.7020)阶段

​    [flutter](https://so.csdn.net/so/search?q=flutter&spm=1001.2101.3001.7020)生命周期大体上可以分为三个阶段：初始化、状态变化、销毁。

### 1、初始化阶段



对应执行构造方法和initState时候

### 2、状态变化阶段

 开新的widget或者调用[setState](https://so.csdn.net/so/search?q=setState&spm=1001.2101.3001.7020)方法的时候

### 3、销毁阶段

deactivate 和 dispose

## 二、生命周期阶段执行的函数

### 1、initState

调用次数：1次

插入渲染树时调用，只调用一次，widget创建执行的第一个方法，这里可以做一些初始化工作，比如初始化State的变量。

### 2、didChangeDependencies

调用次数：多次

- 初始化时，在initState()之后立刻调用
- 当依赖的InheritedWidget rebuild,会触发此接口被调用
- 实测在组件可见状态变化的时候会调用

### 3、build

调用次数：多次 

- 初始化之后开始绘制界面
- setState触发的时候会 

### 4、didUpdateWidget

调用次数：多次

组件状态改变时候调用

### 5、deactivate

当State对象从树中被移除时，会调用此回调，会在dispose之前调用。

页面销毁的时候会依次执行：deactivate > dispose

### 6、dispose

调用次数：1次

当State对象从树中被永久移除时调用；通常在此回调中释放资源。

### 7、reassemble

在热重载(hot reload)时会被调用，此回调在Release模式下永远不会被调用

## 三、App生命周期

​    通过WidgetsBindingObserver的didChangeAppLifecycleState 来获取。通过该接口可以获取是生命周期在AppLifecycleState类中。

### 1、resumed

可见并能响应用户的输入，同安卓的onResume

### 2、inactive   

处在并不活动状态，无法处理用户响应，同安卓的onPause

### 3、paused

不可见并不能响应用户的输入，但是在后台继续活动中，同安卓的onStop

**下面是生命周期：**

1. 初次打开widget时，不执行AppLifecycleState的回调；
2. 按home键或Power键， AppLifecycleState inactive---->AppLifecycleState pause
3. 从后台到前台：AppLifecycleState inactive--->ApplifecycleState resumed
4. back键退出应用： AppLifecycleState inactive--->AppLifecycleState paused

参考文章：https://www.jianshu.com/p/00ff0c2b8336
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
