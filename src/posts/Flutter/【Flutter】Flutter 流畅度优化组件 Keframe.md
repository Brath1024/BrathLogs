---
date: 2022-04-12 21:30:55

title: Flutter 流畅度优化组件 Keframe
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



最近在开发一款APP，核心场景类似于帖子这类的，所以下拉加载页面的流畅度成为最棘手的问题，在掘金上看见了这篇文章： https://juejin.cn/post/6979781997568884766

Nayuta 的 Keframe 组件正好可以满足帧率优化的问题

### 项目依赖：

在 `pubspec.yaml` 中添加 `keframe` 依赖

```yaml
dependencies:
  keframe: version
```

组件仅区分非空安全与空安全版本

非空安全使用： `1.0.2`

空安全版本使用： `2.0.2`

github 地址：[github.com/LianjiaTech…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FLianjiaTech%2Fkeframe)

pub 查看：[pub.dev/packages/ke…](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fkeframe)



```dart
#SizeCacheWidget用来包裹最外层的list
#FrameSeparateWidget用来包裹list的子集即可    
example:
SizeCacheWidget(
	child：ListView || CustomScrollView(
    	slivers[
            SliverList(
            	delegate: SliverChildBuilderDelegate
                (BuildContext context, int index){
                    return FrameSeparateWidget(
                    	child: ···
                    )
                }
            )
        ]
    )
)
```



### 快速上手：

如下图所示

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83d16f3b2a3e45b79fc73d7a52774696~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

假如现在页面由 A、B、C、D 四部分组成，每部分耗时 10ms，在页面时构建为 40ms。使用分帧组件  `FrameSeparateWidget` 嵌套每一个部分。页面构建时会在第一帧渲染简单的占位，在后续四帧内分别渲染 A、B、C、D。

对于列表，在每一个 item 中嵌套 `FrameSeparateWidget`，并将 `ListView` 嵌套在 `SizeCacheWidget` 内即可。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffecd49bf9ba4379984a22ef79663104~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

------

## 构造函数说明

FrameSeparateWidget ：分帧组件，将嵌套的 widget 单独一帧渲染

| 类型   | 参数名      | 是否必填 | 含义                                                         |
| ------ | ----------- | -------- | ------------------------------------------------------------ |
| Key    | key         | 否       |                                                              |
| int    | index       | 否       | 分帧组件 id，**使用 SizeCacheWidget 的场景必传**，SizeCacheWidget 中维护了 index 对应的 Size 信息 |
| Widget | child       | 是       | 实际需要渲染的 widget                                        |
| Widget | placeHolder | 否       | 占位 widget，尽量设置简单的占位，不传默认是 Container()      |

SizeCacheWidget：缓存子节点中，分帧组件嵌套的**实际 widget 的尺寸信息**

| 类型   | 参数名        | 是否必填 | 含义                                                   |
| ------ | ------------- | -------- | ------------------------------------------------------ |
| Key    | key           | 否       |                                                        |
| Widget | child         | 是       | 子节点中如果包含分帧组件，则缓存**实际的 widget 尺寸** |
| int    | estimateCount | 否       | 预估屏幕上子节点的数量，提高快速滚动时的响应速度       |

------

## 方案设计与分析：

卡顿的本质，就是 **单帧的绘制时间过长**。基于此自然衍生出两种思路解决：

1、减少一帧的绘制耗时，因为导致耗时过长的原因有很多，比如不合理的刷新，或者绘制时间过长，都有可能，需要具体问题具体分析，后面我会分享一些我的优化经验。

**2、在不对耗时优化下，将一帧的任务拆分到多帧内，保证每一帧都不超时。这也是本组件的设计思路，分帧渲染。**

如下图所示:

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb09c9aadc5d45c9b966661c8d73e4c1~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

原理并不复杂，问题在于如何在 Flutter 中实践这一机制。

因为涉及到帧与系统的调度，自然联想到看 `SchedulerBinding` 中有无现成的 API。

发现了 `scheduleTask` 方法，这是系统提供的一个执行任务的方法，但这个方法存在两个问题：

- 1、其中的渲染任务是优先级进行堆排序，而堆排序是**不稳定**排序，这会导致任务的执行顺序并非 FIFO。从效果上来看，就是列表不会按照顺序渲染，而是会出现跳动渲染的情况
- 2、这个方法本身存在调度问题，我已经提交 issue 与 pr，不过一直卡在单元测试上，如果感兴趣可以以在这里交流谈论。

[fix: Tasks scheduled through 'SchedulerBinding.instance.scheduleTask'… #82781 ](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fflutter%2Fflutter%2Fpull%2F82781)

最终，参考这个设计结合 `endOfFrame` 方法的使用，完成了分帧队列。整个渲染流程变为下图所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb9d177b4b0847339eaf952a7ef67cca~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

对于列表构建场景来说，假设屏幕上能显示五个 item。首先在第一帧的时候，列表会渲染 5 个占位的 Widget，同时添加 5 个高优先级任务到队列中，这里的任务可以是简单的将占位 Widget 和实际 item进行替换，也可通过渐变等动画提升体验。在后续的五帧中占位 Widget 依次被替换成实际的列表 item。

在  [ListView流畅度翻倍！！Flutter卡顿分析和通用优化方案](https://juejin.cn/post/6940134891606507534)  这篇文章中有更加详细的分析。

## 一些展示效果（Example 说明请查看 [Github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FLianjiaTech%2Fkeframe%2Fblob%2Fmaster%2FREADME-ZH.md)）

卡顿的页面往往都是由多个复杂 widget 同时渲染导致。通过为复杂的 widget 嵌套分帧组件 `FrameSeparateWidget`。渲染时，分帧组件会在第一帧同时渲染多个 `palceHolder`，之后连续的多帧内依次渲染复杂子项，以此提升页面流畅度。

例如 example 中的优化前示例：

```dart
ListView.builder(
              itemCount: childCount,
              itemBuilder: (c, i) => CellWidget(
                color: i % 2 == 0 ? Colors.red : Colors.blue,
                index: i,
              ),
            )
复制代码
```

其中 `CellWidget` 高度为 60，内部嵌套了三个 `TextField` 的组件（整体构建耗时在 9ms 左右）。

优化仅需为每一个 item 嵌套分帧组件，并为其设置 `placeHolder`（placeHolder 尽量简单，样式与实际 item 接近即可）。

在列表情况下，给 ListView 嵌套 `SizeCacheWidget`，同时建议将预加载范围 `cacheExtent` 设置大一点，例如 500（该属性默认为 250），提升慢速滑动时候的体验。

![Screenrecording_20210611_194905.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f33ddd7d9de4e369b0e457f84171cc8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp) (占位与实际列表项不一致时，首次渲染抖动，二次渲染正常)

此外，也可以给 item 嵌套透明度/位移等动画，优化视觉上的效果。

效果如下图：

| ![Screenrecording_20210315_133310.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb7d1361ae7842df954bb1c559e2ec54~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp) | ![Screenrecording_20210315_133848.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ee6827f7eed4463a1a8a5b00a58fd6e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

------

## 分帧的成本

当然分帧方案也非十全十美，在我看来主要有两点成本：

1、额外的构建开销：整个构建过程的构建消耗由「n * widget消耗 」变成了「n *（ widget + 占位）消耗 + 系统调度 n 帧消耗」。可以看出，额外的开销主要由占位的复杂度决定。如果占位只是简单的 Container，测试后发现整体构建耗时大概提升在 15 % 左右。这种额外开销对于当下的移动设备而言，成本几乎可以不计。

2、视觉上的变化：如同上面的演示，组件会将 item 分帧渲染，页面在视觉上出现占位变成实际 widget 的过程。但其实由于列表存在缓存区域（建议将缓存区调大），在高端机或正常滑动情况下用户并无感知。而在中低端设备上快速滑动能感觉到切换的过程，但比严重顿挫要好。

------

## 优化前后对比演示

注：gif 帧率只有20

| 优化前                                                       | 优化后                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![优化前](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f20f593cc144b72a1df4bdae57a165c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp) | ![优化后](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05aea6de421545b9bbf868c344a9afe9~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp) |

------

## 最后：一点点思考

列表优化篇到此告一段落，在整个开源实践过程中，有两点感触较深：


作者：Nayuta
链接：https://juejin.cn/post/6979781997568884766
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
