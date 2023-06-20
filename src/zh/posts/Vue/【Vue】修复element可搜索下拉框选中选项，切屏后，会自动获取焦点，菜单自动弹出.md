---
date: 2023-04-24 09:45:16

title: 【Vue】修复element可搜索下拉框选中选项，切屏后，会自动获取焦点，菜单自动弹出
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Vue】修复element可搜索下拉框选中选项，切屏后，会自动获取焦点，菜单自动弹出



### 1.添加自定义指令 v-select-blur

##### 在main.js添加：

```js
Vue.directive('select-blur', {
  bind(el, binding) {
    let inputDom = el.getElementsByTagName('input')[0]
    if (!inputDom) return 
    let isOpen = false
    inputDom.addEventListener('focus', function (event) {
      if (isOpen) {
        inputDom.blur()
      } else {
        isOpen = true
      }
    })
  }
})
```

##### 用法：

```vue
<el-select
    v-select-blur
    v-model="value"
    :placeholder="请选择"
    clearable
    filterable
>
 <el-option
     v-for="item in countryList"
     :key="item.id"
     :label="item.name"
     :value="item.name"
     :title="item.name"
 />
</el-select>          
```



### 存在的问题：

​	虽然有效，但是会导致第二次点下拉框时，无法继续搜索
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
