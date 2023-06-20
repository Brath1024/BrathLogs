---
date: 2022-04-02 11:32:07

title: 【Vue】vue-json-editor json编辑器.md
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Vue】vue-json-editor json编辑器.md

# 一、概述

现有一个[vue项目](https://so.csdn.net/so/search?q=vue项目&spm=1001.2101.3001.7020)，需要一个json编辑器，能够格式化json数据，同时也支持编辑功能。

vue-json-editor 插件就可以实现这个功能



# 二、vue-json-editor 使用

## 安装插件

```sql
npm install vue-json-editor --save
```



## 使用

test.vue

```html

<template>
  <div style="width: 70%;margin-left: 30px;margin-top: 30px;">
    <vue-json-editor
      v-model="resultInfo"
      :showBtns="false"
      :mode="'code'"
     
      @json-change="onJsonChange"
      @json-save="onJsonSave"
      @has-error="onError"
    />
    <br>
    <el-button type="primary" @click="checkJson">确定</el-button>
  </div>
</template>
 
<script>
  // 导入模块
  import vueJsonEditor from 'vue-json-editor'
 
  export default {
    // 注册组件
    components: { vueJsonEditor },
    data() {
      return {
        hasJsonFlag:true,  // json是否验证通过
        // json数据
        resultInfo: {
          'employees': [
            {
            'firstName': 'Bill',
            'lastName': 'Gates'
            },
            {
              'firstName': 'George',
              'lastName': 'Bush'
            },
            {
              'firstName': 'Thomas',
              'lastName': 'Carter'
            }
          ]
        }
      }
    },
    mounted: function() {
    },
    methods: {
      onJsonChange (value) {
        // console.log('更改value:', value);
        // 实时保存
        this.onJsonSave(value)
      },
      onJsonSave (value) {
        // console.log('保存value:', value);
        this.resultInfo = value
        this.hasJsonFlag = true
      },
      onError(value) {
        // console.log("json错误了value:", value);
        this.hasJsonFlag = false
      },
      // 检查json
      checkJson(){
        if (this.hasJsonFlag == false){
          // console.log("json验证失败")
          // this.$message.error("json验证失败")
          alert("json验证失败")
          return false
        } else {
          // console.log("json验证成功")
          // this.$message.success("json验证成功")
          alert("json验证成功")
          return true
        }
      },
    }
  }
</script>
 
<style>
</style>
```



插件参数说明：

```html
<vue-json-editor
      v-model="resultInfo"  // 绑定数据resultInfo
      :showBtns="false"  // 是否显示保存按钮
      :mode="'code'"  // 默认编辑模式
       // 显示中文，默认英文
      @json-change="onJsonChange"  // 数据改变事件
      @json-save="onJsonSave"  // 数据保存事件
      @has-error="onError"  // 数据错误事件
    />
```



相关说明：

**resultInfo 默认绑定的变量，这个变量可以为空，编辑器会显示为{}**

**:showBtns 这里不显示保存按钮，为什么呢？原因有2个。1. 默认样式不好看。2. 只能当json数据正确，才能点击保存按钮，否则禁止点击。**

**json-change，json-save，has-error 这3个事件，是会实时触发的。**



这里我额外加了一个检测方法，用来判断json数据是否正确。默认标记为true，当不正确时，会改变状态为false。



## 访问

点击确定，提示成功

![img](https://img-blog.csdnimg.cn/img_convert/f9195e9eeb26d90a8751d345ccdc6c16.png)





 改为错误的，点击确定，会提示失败。

![img](https://img-blog.csdnimg.cn/img_convert/c290d807c751bfc2b24672522aa35b6d.png)



注意：这个json编辑会带有下来菜单，实际项目中，需要去除，比较用户误操作。

在实际使用中发现几个问题：

\1. 输入中文时，传给后端的值不多

\2. 输入大量json时，会有部分数据丢失。

因此，我们使用下面的编辑器bin-code-editor 



# 三、bin-code-editor

## 安装模块

```javascript
npm install bin-code-editor -d
```



## 引入

在 main.js 中写入2行

```javascript
import CodeEditor from 'bin-code-editor';
Vue.use(CodeEditor);
```



test.vue

```javascript
<template>
  <div style="width: 70%;margin-left: 30px;margin-top: 30px;">
    <b-code-editor v-model="jsonStr" :auto-format="true" :smart-indent="true" theme="dracula" :indent-unit="4" :line-wrap="false" ref="editor"></b-code-editor>
    <br>
    <el-button type="primary" @click="onSubumit">提交</el-button>
  </div>
</template>
 
<script>
  const jsonData =`{
    "employees": [{
      "firstName": "Bill",
      "lastName": "Gates"
    }, {
      "firstName": "George",
      "lastName": "Bush"
    }, {
      "firstName": "Thomas",
      "lastName": "Carter"
    }]
  }`
  export default {
    data() {
      return {
        jsonStr:jsonData
      }
    },
    methods: {
      // 检测json格式
      isJSON(str) {
        if (typeof str == 'string') {
          try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
              return true;
            }else{
              return false;
            }
 
          } catch(e) {
            return false;
          }
        }else if (typeof str == 'object'  && str) {
          return true;
        }
      },
      onSubumit(){
        if (!this.isJSON(this.jsonStr)){
          this.$message.error(`json格式错误`)
          return false
        }
        this.$message.success('json格式正确')
      }
    }
  }
</script>
 
<style>
 
</style>
```





访问测试页面，效果如下：

![img](https://img-blog.csdnimg.cn/img_convert/a4e861d97e8c5834037dd0c38546c01c.png)





输入错误的值，点击执行，会有提示

![img](https://img-blog.csdnimg.cn/img_convert/0d0f360a6b1cc9c221a0d8608dfe81da.png)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
