---
date: 2023-01-12 23:56:53

title: Flutter GETX框架
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



​		GetX 是 Flutter 上的一个轻量且强大的解决方案：高性能的状态管理、智能的依赖注入和便捷的路由管理。

​		与其说是一个状态管理库，倒不如是是一个简化 Flutter 开发的百宝箱。它提供了很多工具来简化我们的开发，本篇我们先对 GetX 有一个大概的认识，然后接下来的篇章再将 GetX 的具体应用。

## **GetX 工具介绍**

官方文档给出关于 GetX 的介绍如下：

> GetX is an extra-light and powerful solution for Flutter. It combines high-performance state management, intelligent dependency injection, and route management quickly and practically. GetX是一个超轻量且强大的 Flutter 应用解决方案。它组合了高性能的状态管理、智能的依赖注入以及快速可用的路由管理。

而实际上，GetX 还有更多的小工具，示例如下：

#### 状态管理

- Obx是配合Rx响应式变量使用、GetBuilder是配合update使用：请注意，这完全是俩套定点刷新控件的方案。
   区别：前者响应式变量变化，Obx自动刷新；后者需要使用update手动调用刷新
- 每一个响应式变量，都需要生成对应的GetStream，占用资源大于基本数据类型，会对内存造成一定压力
- GetBuilder内部实际上是对StatefulWidget的封装，所以占用资源极小（推荐使用）

#### 控制器的注入

- 静态路由绑定



```tsx
class AsWorkStatisticsBinding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AsWorkStatisticsController>(() => AsWorkStatisticsController());
  }
}

static final List<GetPage> routes = [
    GetPage(
      name: workStatisticsPage,
      page: () => const AsWorkStatisticsPage(),
      binding: AsWorkStatisticsBinding(),
    ),
];
Get.toNamed(ASRouteConfig.workPlanDetailPage);
```

- 动态路由绑定



```css
Get.to(AsWorkStatisticsPage(),binding: AsWorkStatisticsBinding());
```

- 页面注入



```tsx
    Get.lazyPut<AsWorkStatisticsController>(() => AsWorkStatisticsController());
```

#### 动态/简单路由和静态/命名路由

请注意命名路由，只需要在api结尾加上Named即可，举例：

- 默认：Get.to(SomePage());
- 命名路由：Get.toNamed(“/somePage”);
- 导航到新的页面



```bash
Get.to(NextScreen());
Get.toNamed("/NextScreen");
```

- 关闭SnackBars、Dialogs、BottomSheets或任何你通常会用Navigator.pop(context)关闭的东西



```css
Get.back();
```

- 进入下一个页面，但没有返回上一个页面的选项（用于SplashScreens，登录页面等）



```bash
Get.off(NextScreen());
Get.offNamed("/NextScreen");
```

- 进入下一个界面并取消之前的所有路由（在购物车、投票和测试中很有用）



```bash
Get.offAll(NextScreen());
Get.offAllNamed("/NextScreen");
```

- 发送数据到其它页面

只要发送你想要的参数即可。Get在这里接受任何东西，无论是一个字符串，一个Map，一个List，甚至一个类的实例。



```tsx
Get.to(NextScreen(), arguments: 'Get is the best');
Get.toNamed("/NextScreen", arguments: 'Get is the best');
```

在你的类或控制器上。



```dart
print(Get.arguments);
//print out: Get is the best
```

- 要导航到下一条路由，并在返回后立即接收或更新数据



```csharp
var data = await Get.to(Payment());
var data = await Get.toNamed("/payment");
```

- 在另一个页面上，发送前一个路由的数据



```kotlin
Get.back(result: 'success');
// 并使用它，例：
if(data == 'success') madeAnything();
```

- 跳转重复页面，可以这样写



```csharp
Get.to(XxxxPage(), preventDuplicates: false);
// 或者
Get.toNamed('xxx',  preventDuplicates: false);
```

- 如果你不想使用GetX语法，只要把 Navigator（大写）改成 navigator（小写），你就可以拥有标准导航的所有功能，而不需要使用context，例如：



```kotlin
// 默认的Flutter导航
Navigator.of(context).push(
  context,
  MaterialPageRoute(
    builder: (BuildContext context) {
      return HomePage();
    },
  ),
);

// 使用Flutter语法获得，而不需要context。
navigator.push(
  MaterialPageRoute(
    builder: (_) {
      return HomePage();
    },
  ),
);

// get语法
Get.to(HomePage());
```

#### GetView的使用

GetView只是对已注册的Controller有一个名为controller的getter的const Stateless的Widget，如果我们只有单个控制器作为依赖项，那我们就可以使用GetView，而不是使用StatelessWidget，并且避免了写Get.Find()。

GetView的使用方法非常简单，只是要将你的视图层继承自GetView并传入需要注册的控制器并Get.put()即可：



```java
class GetViewAndGetWidgetExample extends GetView<GetViewCountController> {
  @override
  Widget build(BuildContext context) {

    Get.put(GetViewCountController());

    return Container();
  }
}
```

### **路由**

路由支持命名路由和匿名路由：

```text
Get.to(() => Home());
Get.toNamed('/home');
// 返回上一个页面
Get.back();
// 使用下一个页面替换
Get.off(NextScreen());
// 清空导航堆栈全部页面
Get.offAll(NextScreen());
// 获取命名路由参数
print(Get.parameters['id']);
print(Get.parameters['name']);
```

GetX 的路由好处是不依赖于 `context`，十分简洁，更多路由介绍可以参考：**[GetX 路由介绍官方文档](https://link.zhihu.com/?target=https%3A//github.com/jonataslaw/getx/blob/master/documentation/en_US/route_management.md)**。

## **SnackBar**

Flutter 自身携带的 SnackBar 有很多限制，而 GetX 的非常简单，当然也有更多的样式配置和位置配置参数。

```text
Get.snackbar('SnackBar', '这是GetX的SnackBar');
```

## **对话框**

对话框也一样，默认的对话框开箱即用。

```text
Get.defaultDialog(
  title: '对话框',
  content: Text('对话框内容'),
  onConfirm: () {
    print('Confirm');
    Get.back();
  },
  onCancel: () {
    print('Cancel');
  },
);
```

## **内存缓存**

GetX 可以缓存内容对象，以便在不同页面共享数据。使用的时候需要注意，需要先 `put` 操作再 `find`操作，否则会抛异常。

```text
Get.put(CacheData(name: '这是缓存数据'));
CacheData cache = Get.find();
```

## **离线存储**

GetX 提供了一个 **[get_storage](https://link.zhihu.com/?target=https%3A//pub.flutter-io.cn/packages/get_storage)** 插件用于离线存储，与 `shared_preferences` 相比，其优点是纯 Dart 编写，不依赖于原生，因此可以在安卓、iOS、Web、Linux、Mac 等多个平台使用。`GetStorage` 是基于内存和文件存储的，当内存容器中有数据时优先从内存读取。同时在构建 GetStorage 对象到时候指定存储的文件名以及存储数据的容器。

```text
GetStorage storage = GetStorage();
storage.write('name', '岛上码农');
storage.read('name');
```

## **更改主题**

可以说是一行代码搞定深色和浅色模式，也可以更改为自定义主题 —— **老板让你根据手机壳改主体颜色的需求**已经搞定了一大半了！

```text
Get.changeTheme(
  Get.isDarkMode ? ThemeData.light() : ThemeData.dark());
},
```

![img](https://brath.cloud/blogImg/v2-196c01dbae06a8e68132fcd94e3983a6_b.jpg)



## **多语言支持**

多语言支持使用数据字典完成，在 `GetMaterialApp` 指定字典对象（继承自 `Translations`），使用字符串的时候假设`.tr` 后缀，就可以在切换语言的时候自动切换字符串对应语言的翻译了。

```text
class GetXDemo extends StatelessWidget {
  // 省略其他代码
  TextButton(
    onPressed: () {
      var locale = Locale('en', 'US');
      Get.updateLocale(locale);
    },
    child: Text('name'.tr),
  ),
}

class Messages extends Translations {
  @override
  Map<String, Map<String, String>> get keys => {
        'en_US': {
          'name': 'Island Coder',
        },
        'zh_CN': {
          'name': '岛上码农',
        }
      };
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      translations: Messages(),
      locale: Locale('zh', 'CN'),
      color: Colors.white,
      navigatorKey: Get.key,
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.light,
      ),
      home: GetXDemo(),
    );
  }
}
```

## **GetX 的理念**

GetX有三个基本的理念，分别是性能、生产力和组织性（Organization）。

- 性能（Performance）：GetX 关注性能并最小化资源消耗。GetX 不使用 `Stream` 或 `ChangeNotifier`。
- 生产力（Productivity）：GetX 使用简洁愉悦的语法。不管你要做什么，使用 GetX都会觉得简便。这使得开发的时间大大节省，并且保证应用性能的最大化。通常来说，开发者需要关注从内存中移除控制器。而使用 GetX 的时候，则无需这么做。当控制器不被使用的时候，资源会自动从内存中释放。如果确实需要常住内存，那就需要在依赖中声明 `permanent:true`。通过这种方式，可以降低内存中有过多不必要依赖对象的风险。同时，依赖默认也是懒加载。
- 组织性（Organization）：GetX 可以将视图、展示逻辑、业务逻辑、依赖注入和导航完全解耦。路由之间跳转无需 `context`，因此我们的导航不会依赖组件树。也不需要使用通过 `InheritedWidget` 的 `context` 访问控制器或 BLOC 对象，因此可以将展示逻辑和业务逻辑从虚拟的组件层分离。我们也不需要像 MultiProvider 那样往组件树中注入 Controller/Model/Bloc 等类对象。因此可以将依赖注入和视图分离。

## **GetX 生态**

GetX 有很多特性，使得编码变得容易。每个特性之间是相互独立的，并且只会在使用的时候才启动。例如，如果仅仅是使用状态管理，那么只有状态管理会被编译。而如果只使用路由，那么状态管理的部分就不会编译。

GetX 有一个很大的生态，包括了大型的社区维护，大量的协作者（GitHub 上看有132位），并且承诺只要 Flutter 存在就会继续维护下去。而且 GetX 兼容 Android, iOS, Web, Mac, Linux, Windows多个平台。GetX 甚至还有服务端版本 **[Get_Server](https://link.zhihu.com/?target=https%3A//github.com/jonataslaw/get_server)**（感觉Flutter要一统程序员界啊，啥时候支持鸿蒙？）。

为了简化开发，GetX 还提供了脚手架工具**[GET_CLI](https://link.zhihu.com/?target=https%3A//pub.flutter-io.cn/packages/get_cli)**和 VSCode 插件`GetX Snippets`（也有Android Studio和 Intellij 插件）。提供了如下快速代码模板：

- getmain：GetX 的 main.dart代码；

- getmodel：Model 类代码，包括了 fromJson 和 toJson 方法

- 其他，输入 getxxxx 根据提示生成即可，具体参考：**[GetX Snippets 介绍](https://link.zhihu.com/?target=https%3A//marketplace.visualstudio.com/items%3FitemName%3Dget-snippets.get-snippets)**。

## **总结**

本篇对 GetX 插件做了简单的介绍，可以看到 GetX 的生态确实很丰富，感觉是一个集大成者，GetX 基本上涵盖了 Flutter应用开发的很大一部分，如路由、主题、多语言、弹层、状态管理、依赖注入、网络请求封装等等。GetX看着像一个框架， 但实际上它的各个模块是独立的，其实是一个工具箱。对于开发的时候，可以用它的全家桶，也可以从中任取所需的模块到我们的应用中使用。
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
