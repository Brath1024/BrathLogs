---
date: 2022-06-03 11:15:40

title: 【Flutter】Flutter学习文档
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 								【Flutter】Flutter学习文档

![img](https://brath.cloud/blogImg/4d4dd7f20a6a494282214c730611df0e.webp)

# 前言：如果你要学习flutter，那么你一定要会dart语言，因为flutter是基于dart来封装的一个 UI 组件包

##### 本文使用 Typort 书写，禁止转载。



#### 学习基础要求：

##### 		后端：有语言基础（C/C++/C#/Java/python/Golang 都可以）

##### 		前端 ：( JavaScript，Html，CSS)的人来学习。如果0基础，请先学习任意一门后端语言并熟练掌握！



## Dart语言学习：

​	安装Dart：https://github.com/GeKorm/dart-windows/releases/download/v1.6.0/Dart_x64.stable.setup.exe

​	安装好后配置环境变量：DART_HOME  E:\dart\bin  安装路径

​	配置好后cmd输入 dart --version 查看环境

```
Dart VM version: 2.3.3-dev.0.0.flutter-b37aa3b036 (Tue Jun 11 13:00:50 2019 +0000) on "windows_x64"
```

### 注释：

```
/*
 *多行注释
 *多行注释
 */
 
 /**
  * 文档注释 与Java相同
  */
  
 ///文档注释 dart独有
```

### 变量定义：

dart语言特点：

​	自动类型转换，var声明的变量可以是任意类型！

dart拥有两种变量定义方式。

指定类型：

String name = "brath";

或者

类型推导

var name = "brath";  //推导为任意类型 

final name  =  "brath";  //不可修改，定义常量，可以初始化

const name  =  "brath";  //不可修改，定义常量，不可以初始化，可以被构造修改

```dart
void main(){
  var name = 111111;
  String name1 = "brath用类型定义";
  print("Hello World! Brath~");
  print(name.runtimeType);
  print(name1.runtimeType);
} 

console:
Hello World! Brath~
int
String
```



#### 变量拼接：

与Java不同，拼接方式用 ${}

如果只拼接普通变量，可以直接 $变量名

如果拼接变量引用方法，必须要${变量名.方法名}



#### 集合类型：

list集合： var names = ["111","222","333"];

set集合:  var movies = {"111","222","333”};

map集合：var info = {"11":"1","22":"2"}



默认情况下，dart的所有class都是隐式接口！

#### Dart函数使用：

```D
void main(List<String> args) {
    print(sum(51, 14891));
}


int sum(int a,int b){
  return a + b;
}
```

#### 函数参数：

必选参数，不能有默认值，可选参数，可以有默认值

```dart
main(){
    sayHello("why");
}

//必选参数：String name 必须传参
void sayHello(String name){
    print(name)
}

//可选参数：位置可选参数 
void sayHello2(String name, [int age, String desc]){
    sayHello2("brath",12,"waa");
    //位置可选参数：用[]包围的参数可传可不传，但是位置必须对应
}

//可选参数：命名可选参数 重点，多用！
void sayHello3(String name, {int age, String desc}){
    sayHello3("brath",age: 13,desc: "212");
    //位置可选参数：用{}包围的参数可传可不传，但是必须指定参数名
}
```

#### 函数是一等公民:

函数可以作为另外一个函数的参数！

```dart
void main(List<String> args) {
  // test(see);

  //匿名函数
  // test((){
  //   print("匿名");
  //   return 10;
  // });

  test(() => print("箭头"));
}

void test(Function foo){
    see();

}

void see(){
  print("see！");
}
```

```dart


void main(List<String> args) {

    // test((num1,num2){
    //   return num1+num2;
    // });
  
  var num = demo();
  print(num(20,12));
}

//将函数声明式显示，利用 typedef 声明一个函数列表，调用 typedef 声明的函数
typedef Calculate = int Function(int num1,int num2);

void test(Calculate calculate){
  calculate(20,30);
}
// void test(int foo(int num1,int num2)){
//   foo(20,30);
// }

Calculate demo(){
  return (num1,num2){
    return num1 * num2;
  };
}
```

### 赋值运算符：

```
Flutter中，有诡异的赋值运算符
比如 name ??="111";
解释：当原来的变量有值时，不执行
当原来的变量为null时，执行

或者 var name = name ?? "11";
解释： 当name不为空时使用name，为空使用后面的变量
```

### 级联运算符：

```dart
void main(){
    var p = Person()
    		..name = "brath"
    		..eat();
			..run();
}

//利用 .. 连续调用对象中的方法，类似于Java中的链式调用
class Person(){
    String name;
   
    void eat(){
        print("吃");
    }
      void run(){
        print("跑");
    }
}
```

#### For循环和Switch循环与JS和Java基本一致

### 构造函数：

```
class Person{
	String name;
	int age;
	double height;
	
	//默认构造函数
	Person(this.name.this.age);
	//命名构造函数，指定名字的构造函数
	Person.NameCon(this.name.this.age,this.height);
}
```

### dynamic：

```dart
dynamic代表任意类型
dynamic obj = "obj";
//可以调用
print(obj.subString(1));

Object obj = "obj";
//不能调用！
print(obj.subString(1));
```

### 初始化列表：

```dart
mian(){
    var p = Person('brath');
}

class Person{
    final String name;
    final int age;
    
    //如果传了age参数，就用age参数，如果没传age参数就用10
    Person(this.name,{int age}): this.age = age ?? 10;
}
```

### 构造函数重定向：

```dart
mian(){
    
}

class Person{
    String name;
    int age;
    
    //默认构造函数调用内部构造函数，重定向
    Person(String name) : this._internal(name,0);
    Person._internal(this.name,this.age)
}
```

### 工厂构造函数：

```dart
//相比于普通构造函数来说，工厂构造函数可以手动返回对象

class Person{
    String name;
    String color;
    
    static final Map<String,Person> _nameCache = {};
    static final Map<String,Person> _colorCache = {};
    
    //工厂构造函数，手动根据条件返回对象
    factory Person.withName(String name){
        if(_nameCache.containsKey(name)){
            return _nameCache[name];
        }else{
            _nameCache[name] = Person(name,"default");
            return Person(name,"default");
        }
    }
}
```

### Getter和Setter：

```dart

void main(List<String> args) {
   //直接访问属性
    final p = Person();
    p.name = "brath";
    print(p.name);
    
    //get，set访问
    p.setName("brath.cloud");
    print(p.getName);
}

class Person{
   late String name;	

  //  //get,set方法
  //  void setName(String name) {
  //     this.name = name;
  //   }
  //   String get getName{
  //       return name;
  //   } 

      //get,set方法箭头函数
   void setName(String name) => this.name = name;
   String get getName => name;
}
```

### 隐式接口：

```dart
//dart中没有interface关键字，默认所有类都是隐式接口
//当讲将一个类作为接口使用时，实现这个接口的类，必须实现这个接口中的所有方法
```

### 类的混入：

```dart
用class声明的类不可以混入其他类
要混入其他类，使用 mixin 声明该类，并在混入时用with关键字来连接被混入的类
```

### 类属性和类方法：

```dart
类属性：在类中不用static声明的变量，叫做成员变量，不可以被类直接调用
静态属性：在类中用static声明的变量，叫做静态属性，类属性，可以被类直接调用
类方法：在类中不用static声明的方法，叫做成员方法，不可以被类直接调用
静态方法：在类中用static声明的方法，叫做静态方法，类属性，可以被类直接调用
```

### 枚举的使用：

```dart
void main(List<String> args) {
  
  final color = Colors.bule;

  switch(color){
    case Colors.bule:
      print("蓝色");
      break;
    case Colors.red:
      print("红色");
      break;
    case Colors.yellow:
      print("黄色");
      break;
  }

  print(Colors.values);

}

enum Colors{
  red,
  bule,
  yellow
}
```

### 库的使用：

```dart
//在Dart中，任何一个dart文件都是一个库，类似于Java中的包
//系统库导入： import 'dart:库名';
//自定会库导入： import '包名/类名';
//库别名：当本类引用其他库时，出现方法名冲突，可以用 as 来给导入的库起别名，再用别名引用
import 'utils/TimeUtil' as timeUtil;
//默认情况下，导入一个库时，导入的是这个库中所有的内容
//dart提供两个关键字来单独导入方法或者隐藏某个方法：
show   hide
import 'utils/TimeUtil' show timeUtil; //只导入timeUtil方法
import 'utils/TimeUtil' hide timeUtil; //只有timeUtil不会导入
//多个方法可以用逗号分割：
import 'utils/TimeUtil' show timeUtil, FileUtil; //只导入timeUtil,FileUtil方法
import 'utils/TimeUtil' hide timeUtil, FileUtil; //只有timeUtil,FileUtil不会导入
```

### 抽取公共库文件：

```dart
	以上方法导入库的时候总是会遇到一些问题，比如如果有100个方法，你只想用50个，那么你就要用50个show或者50个hide，但是dart提供了一种方式，就是抽取库到一个公共类中。
    前面提到过，dart中所有文件都是一个库，那么我们把需要导入的库，全部export到一个库中，在引用这个库，就不用担心过多引入了。
        
公共库：
util.dart
export 'util/TimeUtil'
export 'util/FileUtil'

我的代码：
import 'util';
```

### 使用第三方库：

```dart
//dart使用第三方库需要创建一个文件 pubspec.yaml
```

```yaml
name: 库名
desciption: 描述
dependencies: 依赖
   http: ^0.13.4
怎么找库？
https://pub.dev/packages/http
```

![image-20220402134052159](https://brath.cloud/blogImg/image-20220402134052159.png)

点击installing

把dependencies内容复制到代码中

```yaml
name: coderwhy
desciption: a dart
dependencies:
  http: ^0.12.0+4
environment: 
  sdk: '>=2.10.0 < 3.0.0'
```

进入当前类文件夹，终端输入 pub get 就会下载对应库包

```dart
import 'package:http/http.dart' as http;

//引入第三方库，必须用package来开头
void main() async {
	var url = 'https://www.brath.cloud:9000/esn-user-service/user/getUserInfo?id=1';
  var url2 = 'https://brath.cloud/image/back.png';
  var response = await http.get(url);
  print(response.body);
}
```



### 异常处理：

​	与Java相同但是有不一样的部分：

​	同步处理

​		在一个方法中用try捕获异常，如果调用方法就捕获不到了！

​	异步处理

​		调用一个异步方法如果发生异常，可以用自异步+await来捕获异常

```dart

void main() async{
  try{
    await test1();
  }catch(e){
    print(e);
    }
} 

 test1() async{
    print(11~/0);
}
```



#### 接下来介绍 我们的Flutter！

## 最好的跨平台解决方案 Flutter 

架构对比：

![image-20220401170121598](https://brath.cloud/blogImg/image-20220401170121598.png)



#### 	GUP绘制出图像，放到Buffer缓存中，手机屏幕根据刷新率来读取缓存的操作，就是展示图像。	![image-20220401171307870](https://brath.cloud/blogImg/image-20220401171307870.png)

### 引出了一个概念：垂直同步

![image-20220401172029367](https://brath.cloud/blogImg/image-20220401172029367.png)

​	为什么要有垂直同步？

​	来看一个例子：假设我GPU每秒帧率产生60，手机屏幕每秒也是接受60，这时可以正常显示。

​								如果突然每秒帧率提高到120，手机屏幕可能会来不及读取缓存导致画面重叠、撕裂	

​	开启垂直同后，会有两块缓存区域。

​	垂直同步就限制了手机屏幕读取缓存和GPU产生的速度，开启垂直同步后，GPU将画面写入到第一个缓存中，第一个缓存会复制内容（地址交换）到第二个缓存中，当两份缓存都存在这一帧，就会发送一个VSync的信号，告诉GPU可以绘制下一张图，然后手机屏幕来显示第二个缓存中的内容，这样就可以避免图像撕裂。



##### 一个简单的flutter结构：

```dart
import 'package:flutter/material.dart';

// mian() => runApp(MyApp());

void main() {
  runApp(const MyApp());
}

//APP主体
class MyApp extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: BrathScaffoldPage()
    );
  }
}

//页面主体
class BrathScaffoldPage extends StatelessWidget{
    @override
  Widget build(BuildContext context) {
    return Scaffold(
      //appbar：顶部标签主体
      appBar: AppBar(
        centerTitle: true,
        title: Text("第一个Fullter程序",style: TextStyle(fontSize: 20),),
      ),
      body: BrathBodyPage()
    );
  }
}

//内容主体
class BrathBodyPage extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    return Text("Hello Fullter");
  }
}
```



##### 开始学习：

#### 下载Flutter SDK

配置Flutter的第一步就是下载Flutter SDK，然后进行安装，上面两个地址都有给SDK下载地址，这里的问题是有的SDK安装包有时会报 没有.git文件的错误，所以最稳妥的方法是通过git clone命令安装
在安装目录下面执行

```
git clone -b stable https://github.com/flutter/flutter.git
```

 ![img](https://brath.cloud/blogImg/202202090714320308.png)

安装完成之后，可以在安装根目录，找的 flutter_console.bat 文件，双击运行

![img](https://brath.cloud/blogImg/202202090714323989.png)

# 配置Flutter运行环境变量

在用户变量里面编辑或者添加 Path 条目，把Flutter的bin目录路径添加在里面

 

![img](https://brath.cloud/blogImg/202202090714326036.png)

# 运行Flutter

在命令行运行 flutter doctor，它会下载它自己的依赖项并自行编译，一般情况是会报错提示，多半是Android SDK找不到什么的，如果出错了，就按照错误信息网上查一下就解决了。
我的已经处理完成的

![img](https://brath.cloud/blogImg/202202090714328081.png)

# 编辑器设置

我用的Android Studio，上面连接里面有不同系统和编辑器的流程，详情可以前往查看

Android Studio的开发环境就不说了，需要的可以自行百度。Android Studio配置Flutter开发主要是 Flutter 和 Dart两个插件

![img](https://brath.cloud/blogImg/202202090714332173.png)

File -- Settings -- Plugins -- Marketplace 然后在搜索里面搜索Flutter和Dart安装就可以了。
安装完插件，重启一下 Android Studio 基本就配置完成了，可以新建Flutter项目了。

# 新建Flutter项目

File -- New -- New Flutter Project

![img](https://brath.cloud/blogImg/202202090714334854.png)



![img](https://brath.cloud/blogImg/202202090714337229.png)

选择Flutter Application

然后到这个最后一步的时候，会有一点小问题

![img](https://brath.cloud/blogImg/202202090714339364.png)

Flutter SDK path 这一栏第一次默认是空的，需要手动选择，选择我们最开始下载的Flutter SDK，选择根目录，就可以了



# 至此Flutter的开发环境安装完毕！



#### 现在开始学习Flutter的基础组件，以及进阶理论！

# flutter学习笔记  auther：Brath

## 所有的重点都在代码的注释中标注！

### 创建项目：

​		到想存储项目的文件路径，打开CMD，输入 flutter create 项目名称即可

![image-20220506084830778](https://brath.cloud/blogImg/image-20220506084830778.png)

​		vscode下载好插件，dart和flutter打开对应flutter文件，即可开始编写

```dart
import 'package:flutter/material.dart'; //导包 material

main() {
  runApp(MyApp()); //运行app
}

class MyApp extends StatelessWidget { //继承无状态widget
  @override
  Widget build(BuildContext context) {
    return MaterialApp( //运行根节点MaterialApp
    );
  }
}

```



## Widget：flutter模块/组件

#### 特性：

##### widget分为有状态（StatefulWidget）和无状态的 (StatelessWidget)

无状态的widget是静态页面

有状态的widget是动态页面

#### 要点：

##### tips：flutter的main入口调用第一个widget需要该widget使用 MaterialApp()作为首个widget

因为 MaterialApp 包含了路由主题等等组件，flutter规定只能用MaterialApp当作根节点



### 使用MaterialApp的home属性来指定页面

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}
```



## Container容器（相当于DIV）(widget)：下面有更详细的介绍

均为可选参数

```dart
Container({
    Key? key,
    this.alignment,
    this.padding, //边距
    this.color, //颜色 使用 Clolrs枚举
    this.decoration, //描述
    this.foregroundDecoration,
    double? width, //宽度 使用double 常量
    double? height, //高度 使用double 常量
    BoxConstraints? constraints,
    this.margin, //margin
    this.transform,
    this.transformAlignment,
    this.child, //子组件
    this.clipBehavior = Clip.none,
  }) : assert(margin == null || margin.isNonNegative),
       assert(padding == null || padding.isNonNegative),
       assert(decoration == null || decoration.debugAssertIsValid()),
       assert(constraints == null || constraints.debugAssertIsValid()),
       assert(clipBehavior != null),
       assert(decoration != null || clipBehavior == Clip.none),
       assert(color == null || decoration == null,
         'Cannot provide both a color and a decoration\n'
         'To provide both, use "decoration: BoxDecoration(color: color)".',
       ),
       constraints =
        (width != null || height != null)
          ? constraints?.tighten(width: width, height: height)
            ?? BoxConstraints.tightFor(width: width, height: height)
          : constraints,
       super(key: key);
```



## Text文本组件(widget)：

Text默认传一个文本：

```dart
 class TextDemo extends StatelessWidget 
   @override
   Widget build(BuildContext context) {
     return Container( //容器
       width: double.infinity, //宽度 使用double枚举
       color: Colors.blue, //颜色 使用Colors枚举
       child: Text( //容器的子组件 文本组件 
       "文本" * 20, //输入文本 20个
       maxLines: 1, //最大行数 1
       textDirection: TextDirection.ltr, //从左到右
       textAlign: TextAlign.center, //剧中
       style: TextStyle( //设置文本样式
         fontSize: 30, //字体大小 30
         color: Colors.teal //字体颜色
       ),
       )
     );
   }
 }
```



```dart
const Text(
    //必传参数
    String this.data, 
    //可选参数
    {
    Key? key,
    this.style, //文本风格，使用 TextStyle方法来指定
    this.strutStyle,
    this.textAlign, //设置文本居中 靠左 靠右，使用 TextAlign枚举
    this.textDirection, //文本排列：左到右 右到左 使用 TextDirection枚举
    this.locale,
    this.softWrap,
    this.overflow, //溢出后按照什么风格显示，使用TextOverflow的枚举
    this.textScaleFactor,
    this.maxLines,  //最大行数
    this.semanticsLabel,
    this.textWidthBasis,
    this.textHeightBehavior,
  }) : assert(
         data != null,
         'A non-null String must be provided to a Text widget.',
       ),
       textSpan = null,
       super(key: key);
```



## Button按钮组件(widget)：

flutter中有几种常用按钮组件：

在 2.0 版本后遗弃按钮 RaisedButton改为ElevatedButton ，  FlatButton改为TextButton

```
RaisedButton 已遗弃
FlatButton 已遗弃
```

#### ElevatedButton：漂浮按钮/升降按钮

![image-20220506094017377](https://brath.cloud/blogImg/image-20220506094017377.png)

```dart
class ButtonDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ElevatedButton(
          onPressed:(){
            //点击事件，如果为null未定义的话，按钮无法点击
          }, 
        child: Text( //这里是按钮文本，可以是图片可以是文本
          "漂浮按钮"
          )
        )
      ],
    );
  }
}
```



#### TextButton：扁平按钮/文本按钮

![image-20220506094026219](https://brath.cloud/blogImg/image-20220506094026219.png)

```dart
class ButtonDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextButton(
          onPressed: (){
            //点击事件
          }, 
          child: Text(
            "扁平按钮"
       ))
      ],
    );
  }
}

```



#### TextButton.icon：带图标的扁平按钮/文本按钮

![image-20220506094049981](https://brath.cloud/blogImg/image-20220506094049981.png)

```dart
class ButtonDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextButton.icon(onPressed: (){},
         icon: Icon(Icons.add), //使用Icons枚举选择图标
         label: Text("图标按钮"))
      ],
    );
  }
}

```



#### OutlinedButton.icon：无阴影按钮

![image-20220506094056747](https://brath.cloud/blogImg/image-20220506094056747.png)

```dart
class ButtonDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
         OutlinedButton(onPressed: (){}, 
         child: Text("无阴影按钮"))
      ],
    );
  }
}

```



#### OutlinedButton.icon：图标按钮

![image-20220506094100990](https://brath.cloud/blogImg/image-20220506094100990.png)

```dart
class ButtonDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
         IconButton(onPressed: (){}, 
         icon: Icon(Icons.home)) //图标用 Icons 枚举选择
      ],
    );
  }
}
```



## Image图片、图标组件(widget)：

flutter提供了四种图片加载方式：![image-20220506095911749](https://brath.cloud/blogImg/image-20220506095911749.png)

1、Image.network   //从网络获取图片

2、Image.asset   //从项目本地获取图片

3、Image.file   //从文件路径获取图片

4、Image.memory  //从手机内存，存储中获取图片

使用 asset 需要设置 pubspec.yaml 中的 assets ![image-20220506100017264](https://brath.cloud/blogImg/image-20220506100017264.png)

```dart
class ImageIconDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(Icons.home), //普通图标
        IconButton(onPressed: (){}, icon: Icon(Icons.home)), //带点击事件的图标
        Container(
          width: double.infinity, //最大宽度
          child: Image.network( //从网络获取图片
          "https://brath.cloud/love/GCLK6888.JPG?versionId=CAEQNxiBgID8yJjchBgiIDUzZGFiMWU3YWVlNDQ4YmJhMzMwNDY0Mzk1OGJiOTU1",
          fit: BoxFit.fill, //图片填充模式
          ),
        ),
        Image.asset("images/image.jpeg"), //项目加载图片
      ],
    );
  }
}
```



## Switch开关，CheckBox复选框组件(widget)：

因为开关和复选框是动态的，有状态的，所以我们要使用 StatefulWidget 来做他们的widget

```dart
//Tips：在 onChanged 使用 setState 来改变状态
```

Check 复选框![](https://brath.cloud/blogImg/image-20220506100951883.png)

```dart
class CheckDemo extends StatefulWidget {
  @override
  State<CheckDemo> createState() => _CheckDemoState();
}
class _CheckDemoState extends State<CheckDemo> {
  bool _check = false;
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Checkbox(
          value: _check, 
          onChanged: (res){ //在 onChanged 使用 setState 来改变状态
            setState(() {
              _check = res!;
            });
        }),
      ],
    );
  }
}
```



Switch开关![image-20220506101002490](https://brath.cloud/blogImg/image-20220506101002490.png)

```dart
class CheckDemo extends StatefulWidget {
  @override
  State<CheckDemo> createState() => _CheckDemoState();
}
class _CheckDemoState extends State<CheckDemo> {
  bool _switch = false;
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Switch(
          value: _switch, 
          onChanged: (res){ //在 onChanged 使用 setState 来改变状态
             setState(() {
                _switch = res;
             });
          })
      ],
    );
  }
}
```



## Progress 进度条，指示器组件(widget)：

flutter为我们提供了几种进度条和指示器样式

1、LinearProgressIndicator  线性指示器 ![image-20220506102352707](https://brath.cloud/blogImg/image-20220506102352707.png)

2、CircularProgressIndicator  圆圈指示器 ![image-20220506102400475](https://brath.cloud/blogImg/image-20220506102400475.png)

3、CupertinoActivityIndicator  IOS风格的进度指示器 ![image-20220506102404297](https://brath.cloud/blogImg/image-20220506102404297.png)

可以设置的参数：

value：可以设置 0 - 1，来表示当前进度

valueColor：使用 AlwaysStoppedAnimation(Colors.red)  动画包裹颜色设置进度指示器的颜色

```dart
class ProgressDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(10),
      child: Column(
        children: [
          LinearProgressIndicator( //线性指示器
            value: .5, //进度 从0-1， .5就是一半
            valueColor: AlwaysStoppedAnimation(Colors.red), //设置颜色要用动画包裹
          ),
          SizedBox(height: 16), //设置间隔 16 
          Container( //设置容器
            height: 100, //高 100
            width: 100, //宽 100
            child: CircularProgressIndicator( //圆圈指示器
              // value: .8,
              valueColor: AlwaysStoppedAnimation(Colors.red),
            ),
          ),
          SizedBox(height: 16),
          CupertinoActivityIndicator(), //IOS风格的进度指示器
      ]),
    );
  }
}
```



## Click 点击组件(widget)：

flutter为我们提供了 GestureDetector 手势检测器![image-20220506102924441](https://brath.cloud/blogImg/image-20220506102924441.png)

```dart
class ClickDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector( //创建手势检测器
      onTap: (){ //单击
        print("点击");
      },
      onDoubleTap: (){ //双击
        print("双击");
      },
      child: Text("点击组件"),
    );
  }
}
```



## Input 输入框组件(widget)：

flutter为我们提供了两种常用输入组件：

TextField：默认典型输入框，没有 validator 验证

TextFromField：特点是可以带参数校验 validator 一般用于登录注册表单验证

#### TextField 源码

```dart
 const TextField({
    Key? key,
    this.controller, //控制器
    this.focusNode, //焦点
    this.decoration = const InputDecoration(), //装饰器
    TextInputType? keyboardType,
    this.textInputAction, //输入动作 键盘右下角（完成，搜索，下一行）
    this.textCapitalization = TextCapitalization.none,
    this.style, //样式
    this.strutStyle,
    this.textAlign = TextAlign.start, //文本格式 默认从左开始
    this.textAlignVertical,
    this.textDirection, //文本方向
    this.readOnly = false,
    ToolbarOptions? toolbarOptions,
    this.showCursor,
    this.autofocus = false,
    this.obscuringCharacter = '•',
    this.obscureText = false,
    this.autocorrect = true,
    SmartDashesType? smartDashesType,
    SmartQuotesType? smartQuotesType,
    this.enableSuggestions = true,
    this.maxLines = 1, //最大行数
    this.minLines, //最小行数
    this.expands = false,
    this.maxLength, //最大字数
    @Deprecated(
      'Use maxLengthEnforcement parameter which provides more specific '
      'behavior related to the maxLength limit. '
      'This feature was deprecated after v1.25.0-5.0.pre.',
    )
    this.maxLengthEnforced = true,
    this.maxLengthEnforcement,
    this.onChanged, //当值改变
    this.onEditingComplete,
    this.onSubmitted,
    this.onAppPrivateCommand,
    this.inputFormatters,
    this.enabled,
    this.cursorWidth = 2.0,
    this.cursorHeight,
    this.cursorRadius,
    this.cursorColor,
    this.selectionHeightStyle = ui.BoxHeightStyle.tight,
    this.selectionWidthStyle = ui.BoxWidthStyle.tight,
    this.keyboardAppearance,
    this.scrollPadding = const EdgeInsets.all(20.0),
    this.dragStartBehavior = DragStartBehavior.start,
    this.enableInteractiveSelection = true,
    this.selectionControls,
    this.onTap,
    this.mouseCursor,
    this.buildCounter,
    this.scrollController,
    this.scrollPhysics,
    this.autofillHints = const <String>[],
    this.clipBehavior = Clip.hardEdge,
    this.restorationId,
    this.enableIMEPersonalizedLearning = true,
  })
```

#### TextFromField 源码

```dart
 Key? key,
    this.controller,
    String? initialValue,
    FocusNode? focusNode,
    InputDecoration? decoration = const InputDecoration(),
    TextInputType? keyboardType,
    TextCapitalization textCapitalization = TextCapitalization.none,
    TextInputAction? textInputAction,
    TextStyle? style,
    StrutStyle? strutStyle,
    TextDirection? textDirection,
    TextAlign textAlign = TextAlign.start,
    TextAlignVertical? textAlignVertical,
    bool autofocus = false,
    bool readOnly = false,
    ToolbarOptions? toolbarOptions,
    bool? showCursor,
    String obscuringCharacter = '•',
    bool obscureText = false,
    bool autocorrect = true,
    SmartDashesType? smartDashesType,
    SmartQuotesType? smartQuotesType,
    bool enableSuggestions = true,
    @Deprecated(
      'Use maxLengthEnforcement parameter which provides more specific '
      'behavior related to the maxLength limit. '
      'This feature was deprecated after v1.25.0-5.0.pre.',
    )
    bool maxLengthEnforced = true,
    MaxLengthEnforcement? maxLengthEnforcement,
    int? maxLines = 1,
    int? minLines,
    bool expands = false,
    int? maxLength,
    ValueChanged<String>? onChanged,
    GestureTapCallback? onTap,
    VoidCallback? onEditingComplete,
    ValueChanged<String>? onFieldSubmitted,
    FormFieldSetter<String>? onSaved,
    FormFieldValidator<String>? validator, //与TextFiled不同的点，增加了 validator验证方法
    List<TextInputFormatter>? inputFormatters,
    bool? enabled,
    double cursorWidth = 2.0,
    double? cursorHeight,
    Radius? cursorRadius,
    Color? cursorColor,
    Brightness? keyboardAppearance,
    EdgeInsets scrollPadding = const EdgeInsets.all(20.0),
    bool enableInteractiveSelection = true,
    TextSelectionControls? selectionControls,
    InputCounterWidgetBuilder? buildCounter,
    ScrollPhysics? scrollPhysics,
    Iterable<String>? autofillHints,
    AutovalidateMode? autovalidateMode,
    ScrollController? scrollController,
    String? restorationId,
    bool enableIMEPersonalizedLearning = true,
  })
```



简易登录

![image-20220506130535502](https://brath.cloud/blogImg/image-20220506130535502.png)

```dart
class InputDemo extends StatefulWidget { //创建有状态 widget
  @override
  State<InputDemo> createState() => _InputDemoState();
}

class _InputDemoState extends State<InputDemo> {
  GlobalKey _key = GlobalKey<FormState>(); //key的泛型是表单状态，这样就可以通过key提交
  TextEditingController _rootController = TextEditingController();//账号控制器
  TextEditingController _passController = TextEditingController();//密码控制器
  FocusNode _r = FocusNode(); //账号焦点
  FocusNode _p = FocusNode(); //密码焦点

  //当退出时销毁controller，否则占用内存
  @override
  void dispose() {
    super.dispose();  //销毁父类
    _rootController.dispose(); //销毁
    _passController.dispose(); //销毁
    _r.dispose(); //销毁
    _p.dispose(); //销毁
  }
  @override
  Widget build(BuildContext context) {
    return Form( //构建表单
      key: _key, //构建表单提交key
      child: Column(
        children: [
        TextFormField( //构建表单输入框
          autofocus: true, //默认焦点聚集
          focusNode: _r, //账号焦点
          controller: _rootController, //引用账号控制器
          decoration: InputDecoration( //输入框描述
            prefixIcon: Icon(Icons.add), //输入框图标
            labelText: "账号", //输入框标题
            hintText: "默认文字" //输入框默认value
          ),
          validator: (v){ //只有使用 TextFormField 才可以用验证 validator 不用验证使用 TextField
            if(v == null || v.isEmpty){
              return "账号不能为空!";
            }
          },
          textInputAction: TextInputAction.next, //回车后跳转下个输入框
          onFieldSubmitted: (v){ //监听回车键
            print("brath");
          },
        ),
        SizedBox(height: 8), //设置间隔高度
        TextFormField(
          focusNode: _p, //密码焦点
          controller: _passController,
          decoration: InputDecoration(
            prefixIcon: Icon(Icons.add),
            labelText: "密码",
            hintText: "输入密码"
          ),
          obscureText: true,
          validator: (v){
            if(v == null || v.length < 5){
              return "密码不能小于5位数!";
            }
          },
          textInputAction: TextInputAction.send, //将小键盘右下角的回车设置图标
        ),
        SizedBox(height: 16),
        ElevatedButton(
          onPressed: (){
            //当校验通过时输出 true 否则 false
            print((_key.currentState as FormState).validate().toString());
          },
          child: Text("提交"),
          ),
      ]),
    );
  }
}
```



## Flutter路由工具：

var res = await Navigator.of(context).push( //跳转路由到 MenuPage 并可以接受返回值

这段代码用异步来监听返回值，优点是，无论是否点击按钮返回，都可以接收到返回值

还可以用 .then((value) => print(value)); 的方式来获取，这样更简洁，只有返回的时候才会监听，不返回不监听

```dart
// ignore_for_file: prefer_const_constructors, use_key_in_widget_constructors
import 'package:flutter/material.dart'; //新页面导包

class LoginPage extends StatelessWidget { //无状态widget
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar( //标题
        title: Text("登录"),
        elevation: 10.0,
        centerTitle: true,
      ),
      body: ElevatedButton( //登录按钮
        onPressed: () async {
          var res = await Navigator.of(context).push( //跳转路由到 MenuPage 并可以接受返回值
            MaterialPageRoute(
              builder: (context) {
                return MenuPage( //传参 menuTitle
                  menuTitle: "菜单",
                );
              },
              settings: RouteSettings( //路由设置
                name: "参数",
                arguments: "我是参数", //向目标传参的数据
              ),
              maintainState: false,
              fullscreenDialog: true,
          ));
          print(res); //打印返回值
        },
        child: Text("登录"),
      ),
    );
  }
}

class MenuPage extends StatelessWidget {
  final String menuTitle;
  const MenuPage({Key? key,required this.menuTitle}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    //通过 ModalRoute.of(context)?.settings.arguments; 来获取传参
    dynamic arguments = ModalRoute.of(context)?.settings.arguments;
    return Scaffold(
      appBar: AppBar(
        title: Text(menuTitle + "  " + arguments),
      ),
      body: ElevatedButton(
        onPressed: (){
          Navigator.of(context).pop("Brath");
        },
        child: Text("返回按钮"),
      ),
    );
  }
}

```



Flutter中管理多个页面时有两个核心概念和类：`Route`和`Navigator`。
 一个`route`是一个屏幕或页面的抽象，`Navigator`是管理`route`的`Widget`。`Navigator`可以通过`route`入栈和出栈来实现页面之间的跳转。
 路由一般分为静态路由(即命名路由)和动态路由。

### 静态路由(即命名路由)

静态路由在通过`Navigator`跳转之前，需要在`MaterialApp`组件内显式声明路由的名称，而一旦声明，路由的跳转方式就固定了。通过在`MaterialApp`内的`routes`属性进行显式声明路由的定义。

```jsx
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      initialRoute: "/", // 默认加载的界面，这里为RootPage
      routes: { // 显式声明路由
       //"/":(context) => RootPage(),
        "A":(context) => Apage(),
        "B":(context) => Bpage(),
        "C":(context) => Cpage(),
      },
 	// home: LoginPage(),//当设置命名路由后，home不用设置
    );
  }
}
注意：如果指定了home属性，routes表则不能再包含此属性。
如上代码中【home: RootPage()】  和 【"/":(context) => RootPage()】两则不能同时存在。
```

例如：`RootPage`跳转`Apage`即：`RootPage`  —>`Apage`

```bash
Navigator.of(context).pushNamed("A");
```

一般方法中带有`Name`多数是通过静态路由完成跳转的，如`pushNamed`、`pushReplacementNamed`、`pushNamedAndRemoveUntil`等。

### 动态路由

动态路由无需在`MaterialApp`内的`routes`中注册即可直接使用：RootPage  —> Apage

```jsx
 Navigator.of(context).push(MaterialPageRoute(
   builder: (context) => Apage(),
 ));
```

动态路由中，需要传入一个`Route`,这里使用的是`MaterialPageRoute`，它可以使用和平台风格一致的路由切换动画,在iOS上左右滑动切换，Android上会上下滑动切换。也可以使用`CupertinoPageRoute`实现全平台的左右滑动切换。
 当然也可以自定义路由切换动画，使用`PageRouteBuilder`:使用`FadeTransition`
 做一个渐入过渡动画。

```dart
Navigator.of(context).push(
  PageRouteBuilder(
    transitionDuration: Duration(milliseconds: 250), // //动画时间为0.25秒
    pageBuilder: (BuildContext context,Animation animation,
        Animation secondaryAnimation){
      return FadeTransition( //渐隐渐入过渡动画
        opacity: animation,
        child: Apage()
       );
     }
  )
);
```

到现在为止，可能对路由有了一定的认识，，下面就结合具体方法来详细说明。
 在这之前有必要说明：
 `Navigator.of(context).push`和`Navigator.push`两着并没有特别的区别，看源码也得知，后者其实就是调用了前者。
 `of`：获取`Navigator`当前已经实例的状态。

### 路由拦截：

flutter提供了 onGenerateRoute 来使用路由拦截器，作用于强制登录

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: "/",
      routes: {
        "/" :(context) => LoginPage(),
        // "menu" :(context) => MenuPage(), 
      },
      onGenerateRoute: (RouteSettings s){ //路由拦截器
        print(s.name); //路由名称
        if(s.name != "menu"){ //当该路由不等于 menu 强制跳转回首页
              return MaterialPageRoute(builder: (context){
            return LoginPage();
          },settings: s);
        }
        switch(s.name){
          case "menu" : //当该路由等于 menu 跳转至 menu 菜单
          return MaterialPageRoute(builder: (context){
            return MenuPage();
          },settings: s);
          break;
        }
      },
      // home: LoginPage(),//当设置命名路由后，home不用设置
    );
  }
}
```



### 路由方法解释：

### pop

返回当前路由栈的上一个界面。
 `Navigator.pop(context);`

### push / pushNamed  ：

见上，两者运行效果相同，只是调用不同，都是将一个`page`压入路由栈中。直白点就是`push`是把界面直接放入，`pushNames`是通过路由名的方式，通过router使界面进入对应的栈中。
 结果：直接在原来的路由栈上添加一个新的 `page`。

### pushReplacement / pushReplacementNamed / popAndPushNamed

替换路由，顾名思义替换当前的路由。
 例如

![img](https:////upload-images.jianshu.io/upload_images/2675141-de7b4cb63fcb1d83.png?imageMogr2/auto-orient/strip|imageView2/2/w/985/format/webp)

Replacement.png

由图可知在`BPage`使用替换跳转到`Cpage`的时候，`Bpage`被`Cpage`替换了在堆栈中的位置而移除栈，`CPage`默认返回的是`APage`。

###### pushReplacement 使用的动态路由方式跳转：



```jsx
Navigator.of(context).pushReplacement(MaterialPageRoute(
  builder: (context) => Cpage(),
));
```

###### pushReplacementNamed 使用的静态路由方式，



```bash
Navigator.of(context).pushReplacementNamed("/C");
```

两者运行效果相同。

###### popAndPushNamed：



```bash
Navigator.of(context).popAndPushNamed("/C");
```

其实和上面两个方法运行的结果也是一致，区别就是动画效果不一样：`BPage` —>`CPage`的时候，`CPage`会同时有`pop`的转场效果和从`BPage`页`push`的转场效果。简单来说就是`CPage`先`pop`到`BPage`，在`push`到`CPage`。（不知道是不是卡顿的原因，笔者看起来区别不大）

综上：3中方法结果一样，只是调用方式和过渡动画的区别，开发者自行选择。

### pushAndRemoveUntil / pushNamedAndRemoveUntil

在使用上述方式跳转时，会按次序移除其他的路由，直到遇到被标记的路由（`predicate`函数返回了`true`）时停止。若 没有标记的路由，则移除全部。
 当路由栈中存在重复的标记路由时，默认移除到最近的一个停止。

###### 第一种



```tsx
// 移除全部
Navigator.pushAndRemoveUntil(context,
                MaterialPageRoute(builder: (_) => CPage()), (Route router) => router == null);
```

或



```tsx
// 移除全部
Navigator.of(context).pushNamedAndRemoveUntil("/C", (Route router) => router == null);
```

此时的路由栈示意图：



![img](https:////upload-images.jianshu.io/upload_images/2675141-364a8005348f7aec.png?imageMogr2/auto-orient/strip|imageView2/2/w/983/format/webp)

RemoveUntil_all.png

可知出了要`push`的`CPage`，当前路由栈中所有的路由都被移除，`CPage`变成根路由。

###### 第二种：移除到RootPage停止



```tsx
// "/"即为RootPage，标记后，移除到该路由停止移除
Navigator.pushAndRemoveUntil(context,
                MaterialPageRoute(builder: (_) => CPage()), ModalRoute.withName('/'))
或
Navigator.pushAndRemoveUntil(context,
                MaterialPageRoute(builder: (_) => CPage()), (Route router) => router.settings.name == "/");
// 只是写法不一样
```

或



```tsx
Navigator.of(context).pushNamedAndRemoveUntil("/C", (Route router) => router.settings.name == "/");
或
Navigator.of(context).pushNamedAndRemoveUntil("/C", ModalRoute.withName("/"));
```

此时的路由栈示意图：



![img](https:////upload-images.jianshu.io/upload_images/2675141-d03ce09352ff0619.png?imageMogr2/auto-orient/strip|imageView2/2/w/992/format/webp)

RemoveUntil_until.png

`push`到`CPage`的时候，移除到`RootPage`停止,`CPage`默认返回`RootPage`。

### popUntil

返回到指定的标记路由，若标记的路由为`null`，则程序退出，慎用！！！
 有时候我们需要根据业务需求判断：可能返回上一级路由，也可能返回上上级路由或是返回指定的路由等。这个时候就不能使用`Replacemen`t和`RemoveUntil`来替换、移除路由了。
 例如：

![img](https:////upload-images.jianshu.io/upload_images/2675141-7ca98d9fca946e7e.png?imageMogr2/auto-orient/strip|imageView2/2/w/453/format/webp)

until.png





```jsx
Navigator.of(context).popUntil((route) => route.settings.name == "/");
或
Navigator.of(context).popUntil(ModalRoute.withName("/"));
```

再例如：

![img](https:////upload-images.jianshu.io/upload_images/2675141-6c759f94d04bf0d9.png?imageMogr2/auto-orient/strip|imageView2/2/w/447/format/webp)


 要实现上述功能，从`CPage`返回到`APage`，并且不在`MaterialApp`内的`routes`属性进行显式声明路由。因为笔者觉得一个应用程序的界面太多了，如果每个界面都要显示声明路由，实在是不优雅。
 因为需要返回`APage`，还是需要标记路由，所有我们在之前跳转`APage`的时候设置`RouteSettings`，如下：





```jsx
// 设置APage的RouteSettings
Navigator.of(context).push(MaterialPageRoute(
  settings: RouteSettings(name:"/A"),
  builder: (context) => APage(),
));
```

在`CPage`需要返回的时候，调用就行：

```bash
Navigator.of(context).popUntil(ModalRoute.withName("/A"));
```

这样代码看起来很优雅，不会冗余。
 另：

```jsx
// 返回根路由
Navigator.of(context).popUntil((route) => route.isFirst);
```

### canPop

用来判断是否可以导航到新页面，返回的`bool`类型，一般是在设备带返回的物理按键时需要判断是否可以`pop`。

### maybePop

可以理解为`canPop`的升级，`maybePop`会自动判断。如果当前的路由可以`pop`，则执行当前路由的`pop`操作，否则将不执行。

### removeRoute/removeRouteBelow

删除路由，同时执行`Route.dispose`操作，无过渡动画，正在进行的手势也会被取消。

###### removeRoute

![img](https:////upload-images.jianshu.io/upload_images/2675141-b33464133f67a4db.png?imageMogr2/auto-orient/strip|imageView2/2/w/996/format/webp)

removeRoute.png

`BPage`被移除了当前的路由栈。
 如果在当前页面调用`removeRoute`，则类似于调用`pop`方法，区别就是无过渡动画，所以`removeRoute`也可以用来返回上一页。

###### removeRouteBelow

移除指定路由底层的临近的一个路由，并且对应路由不存在的时候会报错。
 同上。

综上：这个两个方法一般情况下很少用，而且必须要持有对应的要移除的路由。
 一般用于立即关闭，如移除当前界面的弹出框等。

------

# 路由传值

常见的路由传值分为两个方面：

- 向下级路由传值
- 返回上级路由时传值

要注意的是，我们一般说静态路由不能传值，并不是说一定不能用于传值，而是因为静态路由一般需要在`MaterialApp`内的`routes`属性进行显式声明，在这里使用构造函数传值无实际意义。
 如：



```jsx
 MaterialApp(
      initialRoute: "/", // 默认加载的界面，这里为RootPage
      routes: { // 显式声明路由
        "/":(context) => RootPage(),
        "/A":(context) => APage("title"),  // 在这里传参无实际意义，一般需要传入的参数都是动态变化的
        "/B":(context) => BPage(),
        "/C":(context) => CPage(),
      },
     // home: RootPage(),
    );
```

### 向下级路由传值

##### 1、构造函数传值

首先构造一个可以带参数的构造函数：



```dart
class APage extends StatefulWidget {
  String title;
  APage(this.title);
  @override
  _APageState createState() => _APageState();
}
```

在路由跳转的时候传值：



```jsx
Navigator.of(context).push(MaterialPageRoute(
  builder: (context) => APage("这是传入的参数"),
));
```

在APage拿到传入的值：



```cpp
// 在 StatefulWidget 使用[widget.参数名]
Container(
  child: Text(widget.title),
)
```

##### 2、ModalRoute 传值

在`Navigator.of(context).push`的跳转方式中，`MaterialPageRoute`的构造参数中 可以看到有`RouteSettings`的属性，`RouteSettings`就是当前路由的基本信息



```kotlin
const RouteSettings({
    this.name,
    this.isInitialRoute = false,
    this.arguments, // 存储路由相关的参数Object
  });
```

路由跳转时设置传递参数：



```tsx
Navigator.of(context).push(MaterialPageRoute(
  settings: RouteSettings(name:"/A",arguments: {"argms":"这是传入A的参数"}),
  builder: (context) => APage(),
));
或使用静态路由pushName：
Navigator.of(context).pushNamed("/A",arguments:{"argms":"这是传入A的参数"});
```

在`APage`中取值：



```dart
Map argms = ModalRoute.of(context).settings.arguments;
print(argms["argms"]);
```

### 返回上级路由时传值

就是在调用`APage`中调用`pop`返回路由的时候传参

```css
Navigator.of(context).pop("这是pop返回的参数值");
```

在上一级路由获取：

```csharp
Navigator.of(context).push(MaterialPageRoute(
  builder: (context) => APage(),
)).then((value){ // 获取pop的传值
  print(value);
});
或
String value = await Navigator.of(context).pushNamed('/xxx');
```



## Flutter 布局（Layout ）（Widget）：

```dart
    textDirection: TextDirection.ltr, //组件排列方式
    mainAxisSize: MainAxisSize.max, //主轴最大值
    mainAxisAlignment: MainAxisAlignment.spaceEvenly, //主轴布局
    crossAxisAlignment: CrossAxisAlignment.start, //纵轴排列方式
```

#### Column  - 纵向

概念：纵轴的宽度，默认使用子组件最大宽度

此时，红色和黄色容器宽度为 100 绿色为150，整个容器就会使用 最大的子组件宽度 150 来表示自己

![image-20220506141732333](https://brath.cloud/blogImg/image-20220506141732333.png)

Column 代码演示：

```dart
class LayoutDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("布局练习"),
      ),
      body: Container(
        color: Colors.grey,
        child: Column(children: [
        Container(
          width: 100,
          height: 100,
          color: Colors.red,
        ),
        Container(
          width: 150,
          height: 100,
          color: Colors.green,
        ),
            Container(
          width: 100,
          height: 100,
          color: Colors.yellow,
        ),
      ]),
      )
    );
  }
}
```

#### Row - 横向

概念：和Colunm相似，纵轴的宽度，默认使用子组件最大高度

此时，红色和黄色容器高度为 100 绿色为200，整个容器就会使用 最大的子组件高度 200 来表示自己

![image-20220506142159516](https://brath.cloud/blogImg/image-20220506142159516.png)

Row 代码演示

```dart
class LayoutDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("布局练习"),
      ),
      body: Container(
        color: Colors.grey,
      child: Row(
        textDirection: TextDirection.ltr, //组件排列方式
        mainAxisSize: MainAxisSize.max, //主轴最大值
        mainAxisAlignment: MainAxisAlignment.spaceEvenly, //主轴布局
        crossAxisAlignment: CrossAxisAlignment.start, //纵轴排列方式
        children: [
           Container(
          width: 100,
          height: 200,
          color: Colors.red,
        ),
            Container(
          width: 150,
          height: 100,
          color: Colors.green,
        ),
            Container(
          width: 100,
          height: 100,
          color: Colors.yellow,
        ),
      ]),
      )
    );
  }
}
```



## Flutter弹性布局(Flex)：

flutter为我们提供了 Flex 这个 widget 来制造弹性布局

Flex 默认 必传方向 Axis 

children使用 Expanded来包裹，可以设置 flex权重，根据数字大小来设置权重 

![image-20220506150504528](https://brath.cloud/blogImg/image-20220506150504528.png)

```dart
class LayoutDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("布局练习"),
        ),
        body: Container(
          color: Colors.grey,
          child: Flex(
            direction: Axis.vertical,
            children: [
              Expanded(child: 
              Container(
                width: 100,
                height: 200,
                color: Colors.red,
              ),flex: 2,),
              Expanded(child: 
              Container(
                width: 100,
                height: 200,
                color: Colors.green,
              ),flex: 2,),
               Expanded(child: 
              Container(
                width: 100,
                height: 200,
                color: Colors.yellow,
              ),flex: 2,),
            ],
          ),
        ));
  }
}
```



## Flutter流式布局(Wrap)：

flutter为我们提供了 Wrap 这个 widget 来制造弹性布局

使用 有状态的  StatefulWidget  来构建 wrap 布局

![image-20220506150443707](https://brath.cloud/blogImg/image-20220506150443707.png)

```dart
class WrapDemo extends StatefulWidget {
  @override
  State<WrapDemo> createState() => _WrapDemoState();
}

class _WrapDemoState extends State<WrapDemo> {
  var list = <int>[];
  @override
  void initState() {
    super.initState();
    for (var i = 0; i < 20; i++) { //初始化时向数组添加 20 个数据
      list.add(i);
    }
  }
  @override
  Widget build(BuildContext context) {
    return Wrap(
      direction: Axis.horizontal, //设置方向
      alignment: WrapAlignment.start, //布局参数
      spacing: 1.0, //边距
      runSpacing: 1.0, //边距
      children: list.map((e) => Container(
        height: 100,
        width: 100,
        child: Text(
          e.toString(),
          style: TextStyle(
            color: Colors.black,
            fontSize: 20
          )
          ),
        color: Colors.blue,
      )).toList()
    );
  }
}
```



## Flutter层叠布局(Stack)：

flutter为我们提供了 Stack这个 widget 来制造层叠布局

![image-20220506150429490](https://brath.cloud/blogImg/image-20220506150429490.png)

我们设置了两个容器div，在层叠布局中，如果后一个容器，比前面的容器大，那么就会遮挡，原理是为什么？

1. flutter在绘画时，从x 0 y 0开始绘画，也就是 左上角
2. 意味着两个容器绘画开始的坐标都是相同的，只不过宽高不一样
3. 那么如果第一个容器宽高为 100 第二个为150 就理所应当的遮住啦！

```dart
class StackDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.grey,
      width: double.infinity,
      child: Stack(
        alignment: AlignmentDirectional.center, //居中布局
        children: [
          Container(
            color: Colors.green,
            width: 150,
            height: 150,
          ),
          Container(
            color: Colors.red,
            width: 100,
            height: 100,
          ),
        ],
      ),
    );
  }
}
```



## Flutter定位布局(Positioned )：

flutter为我们提供了 Positioned 这个 widget 来制造层叠布局

如果 Positioned 设置了宽高，那么子组件不生效

![image-20220506151155616](https://brath.cloud/blogImg/image-20220506151155616.png)

```dart
//如果设置了 
​	top: 10,
​   bottom: 10,
​		那么就不能设置高度 height
//如果设置了
​     left: 10,
​     right: 10,
​		那么就不能设置宽度 width
```

![image-20220506151900799](https://brath.cloud/blogImg/image-20220506151900799.png)

代码演示：

```dart
class StackDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.grey,
      width: double.infinity,
      child: Stack(
        alignment: AlignmentDirectional.center,
        children: [
          Container(
            color: Colors.green,
            width: 150,
            height: 150,
          ),
          Container(
            color: Colors.red,
            width: 100,
            height: 100,
          ),
          Positioned(
            // width: 100,
            // height: 100,
            child: Container(
                color: Colors.yellow,
                width: 300,
                height: 300,
          ),
          top: 50,
          left: 150,
          right: 150,
          bottom: 50,
        )
        ],
      ),
    );
  }
}
```



## Flutter相对定位(Align)：

flutter为我们提供了 Align 这个 widget 来制造层叠布局

![image-20220506154713361](https://brath.cloud/blogImg/image-20220506154713361.png)

要点：只会相对于父组件来定位，而不是屏幕

```dart
class AlignDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      height: 200,
      color: Colors.green,
      child: Align(
        alignment: Alignment.center, //居中
        child: FlutterLogo( //flutter的logo
          size: 60, //宽高60
        ),
      ),
    );
  }
}
```



## Flutter的内外边距 Padding、Margin

flutter为我们提供了 padding 和 margin 这量个 属性来设置内外边距

内边距：当前容器内的组件对于当前容器的距离

外边距：当前容器距离父类容器的距离

![image-20220506154557035](https://brath.cloud/blogImg/image-20220506154557035.png)

代码演示：

```dart
class PaddingAndMarginDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 100,
      height: 100,
      color: Colors.red,
      //设置外边距（当前容器距离父类容器的距离）
      // margin: EdgeInsets.only(left: 10),//单独设置外边距
      margin: EdgeInsets.all(10),//四个方向设置外边距
      //设置内边距（当前容器内的组件对于当前容器的距离）
      padding: EdgeInsets.all(20),
      child: Text("我有边距"),
    );
  }
}
```



## Flutter尺寸限制容器（ConstrainedBox）widget：

要点：子widget没有设置宽高的时候取自己设置的最大宽高

ConstrainedBox的特点就是可以设置最大或者最小的宽高，子组件怎么设置都不可以超过这个宽高

![image-20220506155526846](https://brath.cloud/blogImg/image-20220506155526846.png)

代码演示：

```dart
class ConstrainedBoxDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: BoxConstraints(
        maxHeight: 100,
        maxWidth: 100,
        minHeight: 50,
        minWidth: 50,
      ),
      child: Container(
        width: 500,
        height: 500,
        color: Colors.red,
      ),
    );
  }
}
```



## Flutter尺寸限制容器（SizeBox）widget：

要点：如果父容器指定了宽高，那么子组件不可以修改宽高

![image-20220506155924950](https://brath.cloud/blogImg/image-20220506155924950.png)

代码演示：

```dart
class ConstrainedBoxDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
        // width: 100,
        // height: 100,
      child: Container(
        color: Colors.red,
        width: 200,
        height: 200,
      ),
    );
  }
}

```



## Flutter装饰器（BoxDecoration）widget：

flutter为我们提供了 BoxDecoration  这量个 widget 来设置样式装饰

![image-20220506161223872](https://brath.cloud/blogImg/image-20220506161223872.png)

代码演示：

```dart
class ConstrainedBoxDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(20),
      width: double.infinity,
      child: DecoratedBox( //装饰器
      decoration: BoxDecoration(
        // color: Colors.red
        gradient: LinearGradient( //渐变颜色
          colors: [
            Colors.red, //从红色
            Colors.green, //到绿色
          ],
        ),
        borderRadius: BorderRadius.circular(10.0), //圆角度
        boxShadow: [
          BoxShadow(
            color: Colors.black,
            offset: Offset(2.0,2.0),
            blurRadius: 2,
          )
        ],
      ),
      child: Padding(
        padding: EdgeInsets.only(
          left: 100,
          right: 100,
          top: 20,
          bottom: 20
          ),
        child: Text(
          "渐变色~",
          style: TextStyle(
            color: Colors.white
          ),
          textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}
```





## Flutter小容器（Container）widget：

要点：当Container设置了 foregroundDecoration（前景） 的背景颜色，那么子组件将不会显示

![image-20220506161715758](https://brath.cloud/blogImg/image-20220506161715758.png)

要点：当Container设置了 decoration（背景） 的背景颜色，那么子组件将会显示

![image-20220506161724860](https://brath.cloud/blogImg/image-20220506161724860.png)



设置内边距并旋转 0.5 

![image-20220506162019154](https://brath.cloud/blogImg/image-20220506162019154.png)

代码演示

```dart
class ContarinerDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(100), //设置内边距
      width: 100,
      height: 100,
      child: Text("data"), 
      decoration: BoxDecoration( //设置背景  foregroundDecoration设置前景，会遮挡
        color: Colors.red
      ),
      transform: Matrix4.rotationZ(0.5), //旋转，可选坐标轴
    );
  }
}
```



## Flutter小容器（MateriaApp，Scaffold）widget：

1.MateriaApp是flutter的根节点，flutter规定必须要 MateriaApp 来作为根节点展示

2.在MateriaApp可以设置路由，每个子页面必须由 Scaffold 来包裹

3.每个 Scaffold 包含两个部分 appBar（头部），body（展示体）



## Flutter的AppBar：

Scaffold 中的 AppBar 有很多特性：

![image-20220506164220445](https://brath.cloud/blogImg/image-20220506164220445.png)

代码演示

```dart
class PageDemo extends StatefulWidget {
  @override
  State<PageDemo> createState() => _PageDemoState();
}
class _PageDemoState extends State<PageDemo> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton( //设置左侧图标
            onPressed: () {
              print("点击了！");
            },
            icon: Icon(Icons.home) //左边房子图片
        ),
        // centerTitle: true, //设置centerTitle为true，可将标题居中
        title: Text(
          "演示",
          style: TextStyle(fontSize: 15),
        ),
        actions: [  //设置左侧图标
          IconButton(
              onPressed: () {
                print("点击了加！");
              },
              icon: Icon(Icons.add)),
          IconButton(
              onPressed: () {
                print("点击了减！");
              },
              icon: Icon(Icons.remove)),
          IconButton(
              onPressed: () {
                print("点击了灯！");
              },
              icon: Icon(Icons.wb_iridescent_rounded)),
        ],
        elevation: 10.0,
      ),
      // body: ,
    );
  }
}
```



## Flutter的顶部TabBar选项卡：

Flutter提供 顶部TabBar选项卡

![image-20220506170237419](https://brath.cloud/blogImg/image-20220506170237419.png)

代码演示：

```dart
class PageDemo extends StatefulWidget {
  @override
  State<PageDemo> createState() => _PageDemoState();
}
class _PageDemoState extends State<PageDemo> with SingleTickerProviderStateMixin{
  List tabs = ["Fullter", "Andiord", "IOS"]; //选项卡数组
  //选项控制器
  late TabController _controller = TabController(length: tabs.length, vsync: this);
  //选项索引  
  int _index = 0;

    /**
     * 初始化
     **/
  @override
  void initState() {
    _controller = TabController( //创建新控制器
      initialIndex: _index, //设置初始索引
      length: tabs.length, //长度为数组疮毒
      vsync: this
      );
      _controller.addListener(() { //监听器
        setState(() { //监听状态，当状态改变，把控制器索引赋值到选项索引，用来做内容切换
          _index = _controller.index;
        });
      });
    super.initState();
  }
    
   /**
    * 销毁
    **/
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
 
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 10.0, //阴影
        bottom: TabBar(
          controller: _controller, //选项接收控制器
          tabs: tabs.map((e) => Tab( //遍历选项
          text: e, //文本为map中的内容
        )).toList(), //转为集合
        ),
      ),
      body: Text(_index.toString()), //body可以根据index来输出不同内容
    );
  }
}
```



## Flutter的顶部TabBar选项卡（进阶）

使用Flutter提供 顶部TabBarView组件来设置选项卡

![image-20220506171550665](https://brath.cloud/blogImg/image-20220506171550665.png)

代码演示：

```dart
class PageDemo extends StatefulWidget {
  
  //指定三个容器页面，在下方调用 widget.widgets 因为泛型指定了 Widget 所以都是Widget数组
  List<Widget> widgets = [FlutterView(),AndroidView(),IOSView()];
    
  @override
  State<PageDemo> createState() => _PageDemoState();
}

class _PageDemoState extends State<PageDemo> with SingleTickerProviderStateMixin{
  List tabs = ["Fullter", "Andiord", "IOS"];
  late TabController _controller = TabController(length: tabs.length, vsync: this);

  @override
  void initState() {
    _controller = TabController(
      length: tabs.length, 
      vsync: this
      );
    super.initState();
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
 
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 10.0,
        bottom: TabBar(
          controller: _controller,
          tabs: tabs.map((e) => Tab(
          text: e,
        )).toList(),
        ),
      ),
      body: TabBarView( //使用 TabBarView 包裹body
        children: widget.widgets, //内容就是widgets
        controller: _controller, //通过控制器来切换
      )
    );
  }
}


class FlutterView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text("FlutterView"),
    );
  }
}

class AndroidView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text("AndroidView"),
    );
  }
}

class IOSView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text("IOSView"),
    );
  }
}
```



## Flutter的侧抽屉 Drawer 样式

使用Flutter提供 侧抽屉 Drawer 组件来设置抽屉样式

![image-20220506172420330](https://brath.cloud/blogImg/image-20220506172420330.png)

#### 要点：drawer是 Scaffold 中的属性，并不是 AppBar 的

![image-20220506172505516](https://brath.cloud/blogImg/image-20220506172505516.png)



代码演示：

```dart
class myDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: MediaQuery.removePadding( //删除边距
        context: context, 
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start, //从左开始
          children: [
            Padding(padding: EdgeInsets.only(top: 40),
            child: Text("Brath"),
            )
          ],
        ),
        removeTop: true, //删除顶部
        ),     
    );
  }
}
```



## Flutter的底部选项卡

使用 flutter 提供的 bottomNavigationBar 来做底部选项卡，做到点击卡片切换页面

![image-20220506190446130](https://brath.cloud/blogImg/image-20220506190446130.png)

代码演示：

```dart

class BottomNavigatorBarDemo extends StatefulWidget {
  const BottomNavigatorBarDemo({ Key? key }) : super(key: key);

  @override
  State<BottomNavigatorBarDemo> createState() => _BottomNavigatorBarDemoState();
}

class _BottomNavigatorBarDemoState extends State<BottomNavigatorBarDemo> {
  int _index = 0; //页面index
  @override
  Widget build(BuildContext context) {
       return Scaffold(
      appBar: AppBar(
        title: Text("底部选项卡"),
      ),
      bottomNavigationBar: BottomNavigationBar( //底部选项widget
        items: [
          //三个选项
          BottomNavigationBarItem(
            icon: Icon(Icons.add),
            label: "新增"
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "我的"
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.remove),
            label: "减少"
          ),
      ],
      currentIndex: _index, //当前index
      onTap: (v){ //当点击时，把当前索引状态改为点击的索引
      setState(() {
        _index = v;
      });
      },
      ),
      body: Center(child: Text(_index.toString())), //展示当前索引
    );
  }
}
```



## Flutter的底部选项卡（进阶版）

使用 flutter 提供的 bottomNavigationBar 来做底部选项卡，做到按钮居中布局

要点：两种实现方式，BottomNavigationBar中如果BottomNavigationBarItem超过三个需要设置type👇否则不显示

```
 type: BottomNavigationBarType.fixed
```

![image-20220507084730237](https://brath.cloud/blogImg/image-20220507084730237.png)

代码演示：

```dart
class BottomNavigatorBarDemo extends StatefulWidget {
  List<Widget> widgets = [ //四个页面数组
    PageDemo(),
    LayoutDemo(),
    LoginPage(),
      LoginPage(),
    ];
  @override
  State<BottomNavigatorBarDemo> createState() => _BottomNavigatorBarDemoState();
}

class _BottomNavigatorBarDemoState extends State<BottomNavigatorBarDemo> {
  int _index = 0; //页面index
  @override
  Widget build(BuildContext context) {
       return Scaffold(
      appBar: AppBar(
        title: Text("底部选项卡"),
      ),
      bottomNavigationBar: BottomNavigationBar( //底部选项widget
      type: BottomNavigationBarType.fixed, //设置超出三个页面显示
        items: [
          //三个选项
          BottomNavigationBarItem(
            icon: Icon(Icons.add),
            label: "首页"
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "我的"
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.remove),
            label: "登录"
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.remove),
            label: "登录"
          ),
      ],
      currentIndex: _index, //当前index
      onTap: (v){ //当点击时，把当前索引状态改为点击的索引
      setState(() {
        _index = v;
      });
      },
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked, //将按钮作为居中嵌入下方tabbar
      floatingActionButton: FloatingActionButton( //设置居中按钮
        onPressed: (){
          print("object");
        },
      ),
      body: widget.widgets[_index], //展示当前索引
    );
  }
}
```



第二种实现方式：

![image-20220507084943281](https://brath.cloud/blogImg/image-20220507084943281.png)



代码演示：

```dart
class _BottomNavigatorBarDemoState extends State<BottomNavigatorBarDemo> {
  int _index = 0; //页面index
  @override
  Widget build(BuildContext context) {
       return Scaffold(
      appBar: AppBar(
        title: Text("底部选项卡"),
      ),
      bottomNavigationBar: BottomAppBar(
        color: Theme.of(context).primaryColorDark, //设置tabbar颜色主题
        shape: CircularNotchedRectangle(), //设置按钮风格
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
           IconButton(
             onPressed: (){

             }, 
             icon: Icon(Icons.add)),
             SizedBox(height: 16),
                        IconButton(
             onPressed: (){

             }, 
             icon: Icon(Icons.home)),
          ]
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        onPressed: (){
          print("object");
        },
      ),
      body: widget.widgets[_index], //展示当前索引
    );
  }
}
```



## Flutter的列表 （ListView）Widget

flutter为我们提供了 ListView 这个 widget 来展示我们的列表

源码展示：

```dart
//均为可选参数
ListView({
    Key? key,
    Axis scrollDirection = Axis.vertical, //滑动方向，默认垂直
    bool reverse = false, //是否反向，默认否
    ScrollController? controller, //监听滑动距离回调 控制器
    bool? primary,
    ScrollPhysics? physics,
    bool shrinkWrap = false, //限制listview的高度为子组件的高度
    EdgeInsetsGeometry? padding,
    this.itemExtent, //设置list展示间距
    this.prototypeItem,
    bool addAutomaticKeepAlives = true,
    bool addRepaintBoundaries = true,
    bool addSemanticIndexes = true,
    double? cacheExtent,
    List<Widget> children = const <Widget>[],
    int? semanticChildCount,
    DragStartBehavior dragStartBehavior = DragStartBehavior.start,
    ScrollViewKeyboardDismissBehavior keyboardDismissBehavior = ScrollViewKeyboardDismissBehavior.manual,
    String? restorationId,
    Clip clipBehavior = Clip.hardEdge,
  }) 
```

##### 用 ListView 实现滑动列表，并且可以细粒度显示每个list数据，并且可以点击按钮返回顶部

<img src="https://brath.cloud/blogImg/image-20220507094032250.png" alt="image-20220507094032250" style="zoom: 67%;" /><img src="https://brath.cloud/blogImg/image-20220507094042244.png" alt="image-20220507094042244" style="zoom: 67%;" />

代码展示：

```dart
class ListViewDemo extends StatefulWidget { //创建无状态Widget
  @override
  State<ListViewDemo> createState() => _ListViewDemoState();
}

class _ListViewDemoState extends State<ListViewDemo> {
  List<int> list = []; //初始化list为空
  ScrollController _controller = ScrollController(); //控制器
  bool show = false; //是否展示按钮
  @override
  void initState() {
    super.initState();
    _controller = ScrollController(); //初始化时，初始控制器
    _controller.addListener(() { //增加控制器监听
      if(_controller.offset >= 100 && show == false){ //如果滑动距离大于100并且按钮没展示那就展示按钮
        setState(() {
          show = true;
        });
      }else if(_controller.offset < 100 && show == true){ //如果滑动距离小于100并且按钮展示那就关闭按钮
        setState(() {
          show = false;
        });
      }
    });
    for (var i = 0; i < 100; i++) {
      list.add(i); //循环添加到数组
    }
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    _controller.dispose(); //退出时，销毁控制器，否则内存会溢出
  }

  @override
  Widget build(BuildContext context) {
     return Scaffold(
      appBar: AppBar(
        title: Text("滚动列表"),
      ),
      floatingActionButton: show ? FloatingActionButton( //使用三元来控制按钮展示
        child: Icon(Icons.vertical_align_top_outlined),
       onPressed: (){
        _controller.animateTo( //设置回到顶部
        0, //回到哪个部分 0 就是顶端
        duration: Duration(milliseconds: 300),  //用Duration设置时间
        curve: Curves.slowMiddle //用Curves设置动效
        );
       },
      ): null, //如果show为false则不展示按钮
      body: Scrollbar(
        child: RefreshIndicator( //使用 RefreshIndicator 包裹listview使其可以下拉刷新
          //第一种方法：直接展示数组数据
      //     child: ListView(
      //   children: list.map((e) => Text(e.toString())).toList(),
      //   shrinkWrap: true, //限制listview的高度为子组件的高度
      //   reverse: false,//是否反向列表
      //   itemExtent: 50,//设置list展示间距
      // ),
          //第二种方法，构造展示数组数据，可以细粒度操作
      child: ListView.builder(
        itemBuilder: (BuildContext context,int index){ //itemBuilder构建列表
          if(index == 2){ //如果第索引 == 2那么就展示一个图标
            return Icon(Icons.add);
          }
          return Text(list[index].toString()); //返回所有list中的索引打印String类型
        },
        itemCount: list.length, //itemCount表示数组长度
        controller: _controller, //接入控制器
        ),
      onRefresh: _onRefresh, //使用_onRefresh方法决定下拉刷新时的操作
      )
      )
    );
  }
  Future _onRefresh() async{ //因为是异步操作所以加入 async ，在方法返回种使用 await 可以做到强制等待异步返回
    await Future.delayed( //处理返回
      Duration(seconds: 3), //等待3秒
      (){
        print("三"); //三秒后打印
      }
    );
    return "三";
  }
}
```



## Flutter的网格布局 （GridView）Widget：

flutter为我们提供了 GridView这个 widget 来展示我们的网格数据

源码展示：

```dart
GridView({
    Key? key,
    Axis scrollDirection = Axis.vertical, //展示方向，默认垂直
    bool reverse = false, //是否反向
    ScrollController? controller, //滑动控制器
    bool? primary,
    ScrollPhysics? physics,
    bool shrinkWrap = false, //是否跟随子组件显示最大高度
    EdgeInsetsGeometry? padding,
    required this.gridDelegate,
    bool addAutomaticKeepAlives = true,
    bool addRepaintBoundaries = true,
    bool addSemanticIndexes = true,
    double? cacheExtent,
    List<Widget> children = const <Widget>[],
    int? semanticChildCount,
    DragStartBehavior dragStartBehavior = DragStartBehavior.start,
    Clip clipBehavior = Clip.hardEdge,
    ScrollViewKeyboardDismissBehavior keyboardDismissBehavior = ScrollViewKeyboardDismissBehavior.manual,
    String? restorationId,
  })
```

![image-20220507095538462](https://brath.cloud/blogImg/image-20220507095538462.png)

代码展示：

```dart
class Grid_view_demo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true, //居中appbar标题
        title: Text("网格布局演示"),
      ),
      body: GridView(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2, //横向最大展示个数
          mainAxisSpacing: 10, //横向间距
          crossAxisSpacing: 10, //纵向间距
        ),
        children: [
          Container(
            color: Colors.amber,
          ),
          Container(
            color: Color.fromARGB(255, 85, 76, 51),
          ),
          Container(
            color: Color.fromARGB(255, 14, 223, 125),
          ),
          Container(
            color: Color.fromARGB(255, 42, 45, 209),
          ),
        ],
        ),
    );
  }
}
```



## Flutter的弹窗（AlertDialog）Widget：

flutter为我们提供了 AlertDialog 这个 widget 来展示我们的弹窗数据

源码阅读：

```dart
 const AlertDialog({
    Key? key,
    this.title, //弹窗标题
    this.titlePadding, //弹窗边距
    this.titleTextStyle, //文字风格
    this.content, //弹窗内容
    this.contentPadding = const EdgeInsets.fromLTRB(24.0, 20.0, 24.0, 24.0), //内容边距
    this.contentTextStyle, //内容风格
    this.actions, //确认展示结果
    this.actionsPadding = EdgeInsets.zero,
    this.actionsAlignment,
    this.actionsOverflowDirection,
    this.actionsOverflowButtonSpacing,
    this.buttonPadding,
    this.backgroundColor,
    this.elevation,
    this.semanticLabel,
    this.insetPadding = _defaultInsetPadding,
    this.clipBehavior = Clip.none,
    this.shape,
    this.alignment,
    this.scrollable = false,
  })
```

##### 图片为IOS风格的弹窗

**![image-20220507101536722](https://brath.cloud/blogImg/image-20220507101536722.png)**

代码展示：

```dart
class AlertDialogDemo extends StatefulWidget { //创建有状态widget
  @override
  State<AlertDialogDemo> createState() => _AlertDialogDemoState();
}

class _AlertDialogDemoState extends State<AlertDialogDemo> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("弹窗展示"),
      ),
      body: Column( //构建Column，展示按钮为对话框
        children: [
          ElevatedButton(
            onPressed: _showAlert, //设置弹窗方法 _showAlert
            child: Text("对话框"))
          ],
      ),
    );
  }

  void _showAlert() async{ //async异步弹窗
    var res = await showDialog( //await接收异步结果
      context: context, //传递上下文对象
      builder: (BuildContext context) { //builder构建方法，传入BuildContext
        //默认风格弹窗
        // return AlertDialog( //AlertDialog展示弹窗
        //   title: Text("与Brath的聊天"), //弹窗标题
        //   content: Text("确认删除"), //弹窗文本
        //   actions: [
        //     TextButton(onPressed: () {
        //       Navigator.of(context).pop(true); //第一种返回方式，of上下文然后pop关闭，并返回一个true
        //     }, child: Text("确认")),
        //     TextButton(onPressed: () {
        //       Navigator.pop(context,false); //第二种返回方式，先pop关闭。然后用of链接上线问，并返回一个false
        //     }, child: Text("取消")),
        //   ],
        // );
        //IOS风格弹窗 除了widget不一样，其他参数均为统一
         return CupertinoAlertDialog(
          title: Text("与Brath的聊天"),
          content: Text("确认删除"),
          actions: [
            TextButton(onPressed: () {
              Navigator.of(context).pop(true);
            }, child: Text("确认")),
            TextButton(onPressed: () {
              Navigator.pop(context,false);
            }, child: Text("取消")),
          ],
        );
      },
    );
    print(res); //打印路由返回结果
  }
}

```



## Flutter的弹框（SimpleDialog） Widget：

flutter为我们提供了 SimpleDialog 这个 widget 来展示我们的弹框数据

源码展示：

```dart
const SimpleDialog({
    Key? key,
    this.title, //弹框标题
    this.titlePadding = const EdgeInsets.fromLTRB(24.0, 24.0, 24.0, 0.0),
    this.titleTextStyle,
    this.children, 
    this.contentPadding = const EdgeInsets.fromLTRB(0.0, 12.0, 0.0, 16.0),
    this.backgroundColor,
    this.elevation,
    this.semanticLabel,
    this.insetPadding = _defaultInsetPadding,
    this.clipBehavior = Clip.none,
    this.shape,
    this.alignment,
  })
```

![image-20220507102533285](https://brath.cloud/blogImg/image-20220507102533285.png)

代码演示

```dart
class AlertDialogDemo extends StatefulWidget { //创建有状态widget
  @override
  State<AlertDialogDemo> createState() => _AlertDialogDemoState();
}

class _AlertDialogDemoState extends State<AlertDialogDemo> {
  List<int> list = []; //初始化空数组
@override
  void initState() {
    // TODO: implement initState
    super.initState();
    for (var i = 0; i < 20; i++) {
      list.add(i);//加入循环数据
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("弹窗展示"),
      ),
      body: Column( //构建Column，展示按钮为对话框
        children: [
          ElevatedButton(
            onPressed: _showAlert, //设置弹窗方法 _showAlert
            child: Text("对话框")),
          ElevatedButton(
            onPressed: _showList, //设置弹窗方法 _showAlert
            child: Text("列表框")),
          ],
      ),
    );
  }

  void _showList() async{ //async异步弹框
 var res = await showDialog( //await接收异步结果
      barrierDismissible: false, //展示弹窗，点击空白不会关闭
      context: context, //传递上下文对象
      builder: (BuildContext context) { //builder构建方法，传入BuildContext
         return SimpleDialog( //创建弹框展示列表
          title: Text("与Brath的聊天"), //弹框标题
          children: list.map((e) => GestureDetector( //用GestureDetector展示list
            child: Text(e.toString()), //每个孩子都是list中的String输出
            onTap: (){
              Navigator.pop(context,e); //点击每个list，路由返回并打印当前数组数值
            },
            )).toList(),
        );
      },
    );
    print(res);
  }

```



## Flutter的表格（Table）Widget：

flutter为我们提供了 Table 还有 DataTable 这两个常用 widget 来展示我们的表格

![image-20220507110417537](https://brath.cloud/blogImg/image-20220507110417537.png)

代码展示：

```dart

class TableDemo extends StatefulWidget {
  @override
  State<TableDemo> createState() => _TableDemoState();
}

class _TableDemoState extends State<TableDemo> {
  List<Map> list = []; //初始化表格数据
  int _sortColumnIndex = 0; //初始化排序索引
  bool _sortAscending = true; //初始化排序方式 ture为 ASC false为 DESC
  
@override
  void initState() {
    super.initState();
    for (var i = 0; i < 10; i++) {
      list.add({ //循环添加map数据
        "name": "b" * i,
        "gender": i % 1 == 0 ? "男" : "女", //取余等于0是男 否则是女
        "isSelect": false, //选中状态默认为不选中
        "age": i.toString() + i.toString(),
      });
    }
  }

  @override
  Widget build(BuildContext context) {
      return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("表格演示"),
      ),
      body: Padding(
        padding: EdgeInsets.all(10), //设置10边距
        //普通表格
      //   child: Table(
      //   border: TableBorder.all(
      //     color: Colors.green
      //   ),
      //   children: list.map((e) => TableRow(
      //     children: [
      //       Text(e["name"]), //展示name列
      //       Text(e["gender"]), //展示性别列
      //     ],
      //   )).toList(),
      // ),

      //H5表格，常用,可排序，可选中
      child: DataTable(
        sortColumnIndex: _sortColumnIndex, //设置排序索引
        sortAscending: _sortAscending, //设置排序方式
        columns: [
          DataColumn(
            onSort: (columnIndex, ascending) { //DataColumn的排序方法
              setState(() {
                _sortAscending = ascending; //设置ascending（排序方式）为当前的_sortAscending
                _sortColumnIndex = columnIndex; //设置columnIndex（排序索引）为当前的_sortColumnIndex
                list.sort((begin,end){ //对数组排序
                  if(!ascending){ //如果为desc的排序方式
                    var c = begin; //新建c变量等于 begin
                    begin = end; //begin 赋值到 end
                    end = c; //edn赋值到c ，完成数据转换
                  }
                  //返回begin的name数据，转换成edn的name数据
                  return begin["name"].toString().length.compareTo(end["name"].toString().length);
                });
              });
            },
            label: Text("姓名") //展示标题为姓名
          ),
          DataColumn(
            label: Text("性别") //展示标题为性别
          ), 
          DataColumn(
            label: Text("年龄") //展示标题为年龄
          ), 
        ], //表头列
        rows: list.map((e) => DataRow(
          selected: e["isSelect"],
          onSelectChanged: (v){ //点击数据
            setState(() { //改变状态
              if(e["isSelect"] != v){ //如果当前选中状态不等于传过来的状态（选中|不选中）
                e["isSelect"] = v; //就把他传过来的状态设置为当前状态
            }
            });
          },
          cells: [
            DataCell(Text(e["name"])), //设置姓名内容列
            DataCell(Text(e["gender"])), //设置性别内容列
            DataCell(Text(e["age"])), //设置年龄内容列
          ]
        )
        ).toList(),//数组打印
      ),
      )
    );
  }
}
```



## Flutter卡片（Card） Widget：

flutter为我们提供了 Card 这个 widget 来展示我们的卡片数据

![image-20220507111422728](https://brath.cloud/blogImg/image-20220507111422728.png)

代码展示：

```dart
class CardDemo extends StatefulWidget {
  @override
  State<CardDemo> createState() => _CardDemoState();
}

class _CardDemoState extends State<CardDemo> {
  List<Map> list = []; 
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    for (var i = 0; i < 10; i++) {
          list.add({
            "age": 10 + i,
            "name": "barth" + i.toString(),
          });
    }
  }

  /**
   * list构建方法，一定要在 build 方法上面，init方法下面构建，因为代码从上到下执行
   */
  Widget _itemBuilder(BuildContext context,int index){
    return Card( //返回卡片集合
      color: Colors.green, //设置卡片背景色
      shadowColor: Colors.grey, //设置阴影背景色
      elevation: 5.0, //设置阴影度
      child: Column(
        children: [
          SizedBox(height: 8), //于顶部间隔 8
          Text(list[index]["name"]),//展示list中的name
          SizedBox(height: 8), //与上个name间隔8
          Text(list[index]["age"].toString()), //展示age内容
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("卡片数据演示"),
      ),
      body: Padding( //边距 Widget
        padding: EdgeInsets.all(10), //设置上下左右10边距
        child: ListView.builder( //构建listView
          itemBuilder: _itemBuilder, //设置builder方法
          itemCount: list.length, //设置list大小
          )
      ),
    );
  }
}
```



## Flutter的（ListTitle）Widget（类似于聊天标签）：

Flutter为我们提供了 ListTile 这个 Widget 来展示标签

![image-20220507112500603](https://brath.cloud/blogImg/image-20220507112500603.png)



代码演示：

```dart
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        centerTitle: true,
        title: Text("卡片数据演示"),
      ),
      body: Padding( //边距 Widget
        padding: EdgeInsets.all(10), //设置上下左右10边距
        //listView卡片
        child: ListView(
          children: [
            ListTile( //创建listTitle
              tileColor: Color.fromARGB(255, 204, 184, 128), //标签颜色
              leading: Icon(Icons.token_sharp), //左边图标
              title: Text("Brath"),//主标题数据
              textColor: Color.fromARGB(255, 49, 54, 42),//标题文字颜色
              subtitle: Text("Flutter卡片数据演示数据 1 "), //副标题数据
              trailing: Icon(Icons.account_circle_rounded),//右边图标
            ),
            SizedBox(height: 8),
            ListTile(
              tileColor: Color.fromARGB(255, 197, 124, 55),
              leading: Icon(Icons.token_sharp),
              title: Text("Braht 2"),
              textColor: Color.fromARGB(255, 49, 54, 42),
             subtitle: Text("Flutter卡片数据演示数据 2 "),
              trailing: Icon(Icons.account_circle_rounded),
            ),        
          ],
        ),
      
      ),
    );
  }
```



## Flutter性能优化：

先看图片：

![image-20220507114818793](https://brath.cloud/blogImg/image-20220507114818793.png)

​		我们以看到，这张图片由三个容器构成，并且点击黄色容器，其数字会增加，理论上来说代码并没有任何问题。

​		但是，在我们打开 检测工具后，发现，当点击黄色容器时，所有容器都会重新渲染，这就造成了性能的损耗！



​		如何优化？

​		代码演示：

##### 使用一个单独的 CountDemo 来对 黄色的容器进行封装，这样就可以做到单独渲染

##### 因为 setState 会重新绘制当前组件（Column），单独封装后，他自己就是一个单独组件（CountDemo）

```dart

class performanceDemo extends StatefulWidget {
  @override
  State<performanceDemo> createState() => _performanceDemoState();
}

class _performanceDemoState extends State<performanceDemo> {
  int count = 0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("性能优化专题"),
      ),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            height: 100,
            color: Colors.red,
          ),
          Container(
            width: double.infinity,
            height: 100,
            color: Colors.yellow,
            child: CountDemo(),
          ),
          Container(
            width: double.infinity,
            height: 100,
            color: Colors.blue,
          )
        ],
      ),
    );
  }
}

/**
 * 使用一个单独的 CountDemo 来对 黄色的容器进行封装，这样就可以做到单独渲染
 * 因为 setState 会重新绘制当前组件（Column），单独封装后，他自己就是一个单独组件（CountDemo）
 **/
class CountDemo extends StatefulWidget {
  @override
  State<CountDemo> createState() => _CountDemoState();
}
class _CountDemoState extends State<CountDemo> {
  int count = 0;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
              child: Text(count.toString()),
              onTap: (){
                setState(() {
                  count ++;
                });
        },
    );
  }
}
```



## Flutter的全局状态管理 Provider 非常重要！

##### 我们分为四个步骤来学习全局状态管理 Provider 

##### 1、因为全局状态管理是单独的插件，所以我们第一步一定是导包

选择根目录下的 pubspec.yaml 依赖配置文件

以作者Brath的flutter版本 2.0 为例，使用5.0.0版本![image-20220507123010044](https://brath.cloud/blogImg/image-20220507123010044.png)

##### 2、下载好依赖后，我们在 lib 目录创建文件夹：Provider 并在文件夹内创建一个 Count_provider.dart，作为我们的第一个全局状态类

![image-20220507123111058](https://brath.cloud/blogImg/image-20220507123111058.png)

​		在类中写入代码：

##### 	要点：notifyListeners() 这个方法的作用就是实现局部刷新

```dart
class CountProvider extends ChangeNotifier{
  int _count = 0; //定义初始数量为0
  get count => _count; //get方法用于外部获取count
  void add(){ //增加方法
    _count ++; //总数+1
    notifyListeners();//通知监听方法
  }
}
```

##### 3、我们写一个新的类用于测试全局状态数据

​		要点：

​			1.获取全局变量：

##### 				通过Provider的of方法（泛型我们的全局状态类）传入上下文对象，就可以获取count

```dart
Provider.of<CountProvider>(context).count.toString()
```

​			2.修改全局变量：

##### 				通过上下文对象的read方法（泛型我们的全局状态类），就可以获取状态类中的方法，来操作

###### 				Tips：不是从当前页使用方法修改全局变量，而是全局变量提供了方法供外部修改！

```dart
 context.read<CountProvider>().add();
```



```dart
class ProviderDemo extends StatefulWidget {
  @override
  State<ProviderDemo> createState() => _ProviderDemoState();
}

class _ProviderDemoState extends State<ProviderDemo> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("Provider全局状态管理"),
      ),
      body: Column(
        children: [
          ElevatedButton(
          onPressed: (){
            Navigator.of(context).pushNamed("ProviderDemo2"); //点击跳转到ProviderDemo2页面
          }, 
          child: Icon(Icons.add_task_rounded)),
          Text(
          Provider.of<CountProvider>(context).count.toString() //通过Provider展示count数据
        )
        ],
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.sanitizer_sharp),
        onPressed: (){
          context.read<CountProvider>().add(); //通过上下文对象获取add方法实现新增
        },
      ),
    );
  }
}

/**
 * 第二个页面
 */
class ProviderDemo2 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
     return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("Provider2"),
      ),
     body: FloatingActionButton(
        child: Icon(Icons.sanitizer_sharp),
        onPressed: (){
          context.read<CountProvider>().add(); //通过上下文对象获取add方法实现新增
        },
      ),
    );
  }
}
```

4、在main.dart中修改启动方式

```dart
main() {
  runApp(
      //只用 ChangeNotifierProvider 来包裹就只可以调用一个全局类
      // ChangeNotifierProvider(
      //   create: (context)=>CountProvider(),
      //   child: MyApp(),
      //   ),
      //使用 MultiProvider 多状态管理来包裹，即可实现多个状态类
      MultiProvider(
          providers: [
            ChangeNotifierProvider(
            create: (context) => CountProvider(),
          ), 
          //   ChangeNotifierProvider(
          //   create: (context) => CountProvider2(),
          // ), 
          ],
    child: MyApp(),
  ));
}
```



## Flutter的网络请求（DIO）

##### Flutter在 pub.dev 为我们提供了许多网络请求组件，我们选择用DIO来做请求组件

使用方法：

##### 1、因为网络请求是单独的插件，所以我们第一步一定是导包

选择根目录下的 pubspec.yaml 依赖配置文件

以作者Brath的flutter版本 2.0 为例，使用4.0.0版本![image-20220507124040380](https://brath.cloud/blogImg/image-20220507124040380.png)

##### 2、编写代码：

```dart
class DioDemo extends StatefulWidget {
  @override
  State<DioDemo> createState() => _DioDemoState();
}

class _DioDemoState extends State<DioDemo> {
  Dio _dio = Dio(); //定义DIO

@override
  void initState() {
    // TODO: implement initState
    super.initState();
    //初始化baseUrl基URL
    _dio.options.baseUrl = "https://www.XXX.XXX:0000/";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("网络请求演示"),
      ),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: _get,
            child: Text("getUserinfo")
          ),
        ]
        ),
    );
  }

  void _get() async{
    //第一种传参方式：名文传输
    // var res = await _dio.get("get/getData?id=1");
    // print(res.toString()); 

  //第二种传参方式：queryParameters包装传输
    var res2 = await _dio.get(
      "get/getData",
      queryParameters: {
        "id": 1
      },
      //通过Options来添加 headers 请求头
      options: Options(
        headers: {
          "token": "header-Token"
        }
      )
    );
    print(res2.toString()); 
  }
}
```

##### 3、如果小伙伴们的请求报错：有以下原因 （参考博客：https://blog.csdn.net/txaz6/article/details/119168489）

##### 	1.请求本地连接，ip地址错误

##### 	2.未添加网络请求权限

##### 	3.请求的地址是http，不是https

##### 	4.与服务端的请求参数不同，导致无法请求到接口

### 

## Flutter的设计模式（MVVM）（Model View ViewModel）

#### MVVM就是Model View ViewModel的简写。

##### 		Model ：处理接口请求数据

##### 		View ：展示页面

##### 		ViewModel：处理业务逻辑（相当于Model、View的链接层）

###### 	简单流程：view通知viewModel层，viewModel通知Model层调用接口，viewModel层接收Model的数据，响应给view层展示

#### 我们通过几个步骤来演示 MVVM 模式的请求流程，以及他的优缺点

##### 1、首先创建   Model View ViewModel 三个文件夹![image-20220507133147052](https://brath.cloud/blogImg/image-20220507133147052.png)

##### 2、编写 Model 层 （请求数据）

```dart
class MvvmModel{
  dynamic get(int id) async {
    /**
     * 获取用户信息方法
     */
    print("开始调用userinfo接口");
    var res = await Dio().get(
      "https://xxx:0000/gerUserInfo",
      queryParameters: { //设置请求参数
        "userId": id //id = viewModel传来的ID
      },
    );
     print("调用完毕");
     return res;
  }
}
```

##### 3、编写 View 层 （接收、展示数据）

```dart
class MvvmViewDemo extends StatefulWidget {
  @override
  State<MvvmViewDemo> createState() => _MvvmViewDemoState();
}

class _MvvmViewDemoState extends State<MvvmViewDemo> {
  dynamic res;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("View展示页面"),
      ),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () async {
             //使用上下文对象的read泛型 ViewModel 类来使用get方法传入 id 获取信息
             context.read<MvvmViewModel>().get(1);
            },
            child: Text("调用ViewwModel获取用户userinfo")
          ),
        ],
      ),
    );
  }
}
```

##### 4、编写 ViewModel 层 （整合view以及model：view调用ViewModel ，ViewModel 调用 model 返回结果给view）

tips：在调用完接口后跳转时，因为 Navigator 需要一个上下文对象，但是我们当前没有上下文对象，所以要在main入口定义一个对象：

main.dart👇

```dart
final GlobalKey<NavigatorState> navigatorkey = GlobalKey<NavigatorState>();

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: navigatorkey, //在 MaterialApp 中 将 navigatorKey 设置为我们定义的navigatorkey，这也是为什么flutter要求使用 MaterialApp 作为mian根节点的原因
    );
  }
}
```

MvvmViewModel.dart👇

```dart
class MvvmViewModel extends ChangeNotifier{
 MvvmModel _model = MvvmModel(); //实例化 model 的对象，因为model是做请求的所以我们调用model
  void get(int id) async {
    //使用model的get方法传入id来获取数据，注意使用 async 和 await 来做异步调用防止接口错误导致程序等待超时
    Response res = await _model.get(id); 
    print(res.data); //获取 Response 的数据
    print(res.headers); //获取 Response 的请求头
    print(res.statusCode); //获取 Response 的状态码
    print(res.realUri);     //获取 Response 的请求地址
    //使用mian中的 navigatorkey 的 currentContext 来获取当前的上下文对象，如果是dart2.0以后需要加一个 ！否则会报错，因为参数必须不能为空
    Navigator.of(navigatorkey.currentContext!).pushNamed("DioDemo"); //我们在调用完接口后跳转到 DioDemo页面
  }
}
```

##### 5、DIO返回值 **Response** 介绍

```dart
    Response res = await _model.get(id); 
    print(res.data); //获取 Response 的数据
    print(res.headers); //获取 Response 的请求头
    print(res.statusCode); //获取 Response 的状态码
    print(res.realUri);     //获取 Response 的请求地址
```



本篇至此就结束啦！如果你读到了这里，不妨给我点个赞，我叫Brath，是一个非科班出身的技术狂！

我的博客 brath.top 欢迎访问！





## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
