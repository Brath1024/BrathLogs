---
date: 2021-09-15 23:09:50

title: Vue的生命周期
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)





> 看过很多人讲vue的[生命周期](https://so.csdn.net/so/search?q=生命周期&spm=1001.2101.3001.7020)，但总是被绕的云里雾里，尤其是自学的同学，可能js的基础也不是太牢固，听起来更是吃力，那我就已个人之浅见，以大白话的方式给大家梳理一下，如有不准确的地方，欢迎指正！🤞🤞

# 什么是生命周期？

生命周期，以个人之浅见，**即一个事物从诞生到消亡的一个过程**！

以人的一生来做类比，其实就可以简单粗暴的将生命周期看作人的一生，人这一出生就开始了一段美好（艰难）的旅程，一生中每个成长的阶段都会对应的去做每个阶段该做的事，比如，上幼儿园，小学，中学，高中，大学，工作（比如我就在辛苦的码字），结婚等等直到百年以后，尘归尘，土归土，这就是人的生命周期！

vue也有这样的一个生命周期，也会在执行到每个阶段做一些事情，不同的是vue在每个对应的阶段是通过生命周期函数去做的，此刻再去看一下vue官网对生命周期的描述就好理解多了！

- **vue官网的描述：**

> 每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己的代码的机会。

**简单来说就是：** 在 Vue 从创建实例到最终完全消亡的过程中，会执行一系列的方法，用于对应当前 Vue 的状态，这些方法我们叫它：**生命周期钩子**！

来看我给大家找的一张图，可以保存起来，等待后学学习使用的深入，再看这张图：
![img](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/91f2362a720e435b19afbe3ccd23ef51.png)

> 根据上图可知，vue的生命周期一共有8个钩子函数，这8个函数描绘了一个vue的一生，下来我们详细来看看这8个生命周期函数，以便更好的理解**Vue的生命周期！**

## vue的8个生命周期函数

- 配合上图观看

1. **beforeCreate**：在实例初始化之后，数据观测 (Data Observer) 和 event/watcher 事件配置之前被调用。
2. **created**：在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)、属性和方法的运算，watch/event 事件回调；然而，挂载阶段还没开始，$el 属性目前不可见。
3. **beforeMount**：在挂载开始之前被调用，相关的 render 函数首次被调用。
4. **mounted**：el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。

> 如果 `root` 实例挂载了一个文档内元素，当 mounted 被调用时 `vm.$el` 也在文档内（PS：注意 `mounted` 不会承诺所有的子组件也都一起被挂载。
> 如果你希望等到整个视图都渲染完毕，可以用 `vm.$nextTick` 替换掉 `mounted：`,
> `vm.$nextTick`会在后面的篇幅详细讲解，这里大家需要知道有这个东西。

1. **beforeUpdate**：数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
2. **updated**：由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。当这个钩子被调用时，组件 DOM 已经更新，所以现在可以执行依赖于 DOM 的操作，然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 `watcher` 取而代之（PS：计算属性与 watcher 会在后面的篇幅中进行介绍）。
3. **beforeDestroy**：实例销毁之前调用，在这一步，实例仍然完全可用。
4. **destroyed**：Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

### **代码验证：**

> 下面的例子我故意将生命周期钩子函数的顺序打乱，并编号，但它还是会自动按照执行顺序输出，就可以验证其上图中的流程，你也手动试试吧！

```js
<div id="app">
    <button @click="clickCounter()">点击</button>
    <p>{{ count }}</p>
</div>
    
    <script type="text/javascript">
      var app = new Vue({
        el: '#app',
        data:{
          count: 1
        },
        methods:{
          clickCounter(){
            this.count += 1
          }
        },
        created: function(){
          console.log('2. 实例已经创建')
        },
        beforeCreate: function(){
          console.log('1. 实例初始化')
        },
        mounted:function(){
          console.log('4. 挂载到实例')
        },
        beforeMount:function(){
          console.log('3. 挂载开始之前')
        },
        beforeUpdate: () => {
          console.log('数据更新时调用')
        },
        updated:function(){
          console.log('更新数据重新渲染DOM')
        },
        beforeDestroy:function(){
          console.log('实例销毁之前调用')
        },
        destroyed:function(){
          console.log('实例销毁之后调用')
        }
      })
      
      /*点击页面销毁vue对象, 销毁之后实例将会释放*/
      // 销毁之后,再次点击就不起作用了
      document.onclick=function(){
          app.$destroy();
      };
    </script>
123456789101112131415161718192021222324252627282930313233343536373839404142434445464748
```

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/20201228173046120.gif)

- **注意**： 最后我手动将这个实例销毁了，点击之后执行一次，后边再点击就不起作用了，测试的时候先把销毁代码端注释掉，然后再放开，进行测试！

## 3个关于vue组件的生命周期钩子

1. **activated**：keep-alive 组件激活时调用（PS：与组件相关，关于 keep-alive 会在讲解组件时介绍）。
2. **deactivated**：keep-alive 组件停用时调用（PS：与组件相关，关于 keep-alive 会在讲解组件时介绍）。
3. **errorCaptured** ：当捕获一个来自子孙组件的错误时被调用，此钩子会收到三个参数：**错误对象**、**发生错误**的组件实例以及一个包含**错误来源信息的字符串**，此钩子可以**返回 false 以阻止该错误继续向上传播**。

## 写在最后

生命周期这块知识点，在这一块我们只需要有所了解，对其大概使用有个基本的掌握，等待学习的深入以及理解的深入，在回过头来看着一块的内容，结合Vue的源码去看会收获良多！
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
