---
date: 2022-04-22 10:20:16

title: 【Flutter】flutter发展前景如何？
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



![img](https://pic1.zhimg.com/80/v2-184c74e7aa102e484165122bb5cec4bd_720w.webp?source=1940ef5c)

> 在 **Flutter** 刚刚从 **Google** 刚刚推向 **Android** 市场的时候，我就开始对 **Flutter** 开始了**学习之路**；但由于当时 **Flutter** 许多东西**尚未完善**而没有推出**稳定的版本**，所以也就没有对其进行**深入**的学习，直到如今 **Flutter** 又**重出江湖**，在**市场**上也得到**了蓬勃发展**及许多业内**大佬**的**力推**，我便又再次**入坑 Flutter**

**实现 UI 和交互**是**高级开发者**的**必备技能**，也是**掌握 Flutter 开发**的**重点**；同样 **Flutter** **跨平台**的**特性**是**原生**不能比拟的，更何况还有不弱的**性能**表现；而**性能**往往是由**生命周期**来决定的

### **何为 Flutter 的生命周期？**

如果你是一名**开发**人员，那么你一定不会对**生命周期**感到陌生；当你在学习 **Flutter** 的时候，**Flutter 也有自己的生命周期**，只有通过了解 **Flutter** 的**生命周期**，才能知道应该在哪里来写**业务逻辑**

### **Flutter 生命周期**

![img](https://picx.zhimg.com/80/v2-6ae547ee1a88db89634eb9c6567146d8_720w.webp?source=1940ef5c)



如上图所示,**Flutter 生命周期**大体上可以分为**三个阶段：** **初始化、状态变化、销毁**；下面依次说明各个阶段的工作

**初始化阶段**（插入[渲染树](https://www.zhihu.com/search?q=渲染树&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2734680490})）

- 对应执行构造方法和 initState

**状态变化阶段**（在渲染树中存在）

- 开新的 widget 或者调用setState方法

**销毁阶段**（从渲染树种移除）

- [deactivate](https://www.zhihu.com/search?q=deactivate&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2734680490})和 dispose

如果之前你对 **Flutter** 有一点点了解的话，你会发现 **Flutter** 中有**两个**主要的 **Widget：** **StatelessWidget（无状态）** 和 **StatefulWidget（有状态）**

### **StatelessWidget**

- **[无状态组件](https://www.zhihu.com/search?q=无状态组件&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2734680490})]是不可变的**，这意味着它们的**属性不能变化**，所有的值都是最终的；可以理解为将**外部传入的数据转化为界面展示的内容，只会渲染一次**
- **对于无状态组件生命周期只有 build 这个过程**；无状态组件的构建方法通常只在三种情况下会被调用：**小组件第一次被插入树中，小组件的父组件改变其配置，以及它所依赖的 InheritedWidget 发生变化时**

### **StatefulWidget**

- 有状态组件持有的状态可能在 Widget 生命周期中发生变化，是定义[交互逻辑](https://www.zhihu.com/search?q=交互逻辑&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2734680490})和业务逻辑；可以理解为具有动态可交互的内容界面，会根据数据的变化进行多次渲染

### **实现一个 StatefulWidget 至少需要两个类：**

**一个是 StatefulWidget 类** **另一个是 Sate 类**

- **StatefulWidget 类本身是不可变的**，但是 **State 类**在 **Widget 生命周期中始终存在**
- **StatefulWidget** 将其**可变**的**状态存储**在由 **createState** 方法创建的 **State** 对象中，或者存储在该 **State 订阅**的对象中

### **Fultter 的优势在哪里？**

### **快速开发和迭代**

**Flutter 自身具有热修复（[热重载](https://www.zhihu.com/search?q=热重载&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2734680490})）**的功能，尽管有使用的限制，但是它依然能够为**开发过程**提供**更高的效率**；另外，**Flutter SDK** 还允许我们**修复崩溃**和继续从**应用程序**停止的地方进行**调试**

### **页面流畅、样式美观**

**对于不同的平台（Android和iOS）**，**Flutter** 提供了**风格不同**的**控件**，以**满足不同平台**的**设计理念**

### **提供原生性能**

**Flutter** 提供了一种**[响应式视图](https://www.zhihu.com/search?q=响应式视图&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2734680490})**，无须 **JavaScript** 做**桥接**；强大的 **API** 使得**实现复杂的页面效果**成为可能；高性能的**[渲染机制](https://www.zhihu.com/search?q=渲染机制&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2734680490})**使得 **120 FPS 的高频率** 可以轻而易举的实现；**当界面上的图片数量越来越多时，与 React Native 相比，Flutter的优势会越来越明显**

### **灵活的跨平台开发**

**Flutter** 可以单独作为**开发框架**完成整个 **App 的开发**，也可以与现有**原生代码**相结合实现 **Hybrid 混合模式的开发**

### **那 Flutter 需要学吗？**

**Flutter** 抛弃了**原生系统控件**和 **Webview**，使用**自研高性能渲染引擎**来绘制 **Widget**，预先 (AOT) 编译，**运行时直接执行 Native(arm) 代码**，**Dart 代码**执行(在 UI TaskRunner)，**图片下载** (IO TaskRunner)，**真正的渲染** (GPU TaskRunner) ，**同平台的通信**等 (Platform TaskRunner 即 **Native 概念**下的**[主线程](https://www.zhihu.com/search?q=主线程&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2734680490})**)是**互相隔离**的

针对**布局**等的**优**化；**布局**计算时单次树走动即可完成；**Relayout Boundary** 机制:如果 **Child** 的 **size** 是**固定**的，那么不会因为 **Child** 的 **Relayout** 导致 **Parent ReLayout** 等**布局优化**，都让 **Flutter 脱颖而出**

如上所述 **Flutter** 于谷歌而言，这是他们重新整理 **跨平台生态环境** 决心的体现，**Flutter** 所展现的内容，也是谷歌想拓展和维护的方向；对于长期苦恼于 **跨平台** 选择的广大 **Android 开发者** 而言，**Flutter** 可谓是谷歌为我们提供的 **指路明灯**

以**目前**的**开发速度**，只要不出**大的纰漏**，**按部就班**的**往前推进**，在**不久的将来**， **Google** 一定可以把 **Flutter** 平台打造得非常完美，届时又会改变**[移动开发技术](https://www.zhihu.com/search?q=移动开发技术&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2734680490})**的**格局**了

也许，**Flutter** 系列的**部分库**还没成熟到成为你**工作的第一选择**，但是，深入学习 **Flutter** 组件会为你日常的开发带来一些想法

**总的来说，Flutter** 对广大开发者而言是 **利远远大于弊的**
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
