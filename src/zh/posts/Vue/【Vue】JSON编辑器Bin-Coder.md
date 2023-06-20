---
date: 2021-01-02 02:18:05

title: 【Vue】JSON编辑器Bin-Coder
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Vue】JSON编辑器Bin-Coder

[Bin Code Editor](https://wangbin3162.gitee.io/bin-code-editor/#/guide)

# 1 安装

## 1.1 CDN 安装

```javascript
<!-- import Vue.js -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<!-- import stylesheet -->
<link rel="stylesheet" href="https://unpkg.com/bin-code-editor@0.1.0/lib/styles/index.css">
<!-- import bin-code-editor -->
<script src="https://unpkg.com/bin-code-editor@0.1.0/lib/bin-code-editor.min.js"></script>
```

@0.1.0 表示版本号，我们建议锁定版本号来保证代码的稳定性

## 1.2 npm 安装

推荐使用npm安装，它能更好地和[webpack打包](https://so.csdn.net/so/search?q=webpack打包&spm=1001.2101.3001.7020)工具配合使用。而且可以更好的和 es6配合使用。并且支持按需引入

```javascript
npm i bin-code-editor -S
# or 
yarn add bin-code-editor
```

# 2 引入

在 main.js 中写入以下内容：

```javascript
import Vue from 'vue';
import CodeEditor from 'bin-code-editor';
import 'bin-code-editor/lib/style/index.css';
import App from './App.vue';

Vue.use(CodeEditor);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

# 3 用法

注意，初始化如果有数据，则会默认格式化一次，格式化快捷键默认为F7,使用时可以进行格式化结构!

```
JSON.stringify(JSON.parse(jsonData),null,2)`可以将默认json进行预格式化,也可以手动触发formatCode()来格式化
`JSON.stringify(value[, replacer[, space]])
```

参数说明：

- value:必需， 要转换的 JavaScript 值（通常为对象或数组）。
- replacer:可选。用于转换结果的函数或数组。如果 replacer 为函数，则 JSON.stringify 将调用该函数，并传入每个成员的键和值。使用返回值而不是原始值。如果此函数返回 undefined，则排除成员。根对象的键是一个空字符串：“”。如果 replacer 是一个数组，则仅转换该数组中具有键值的成员。成员的转换顺序与键在数组中的顺序一样。
- space:可选，文本添加缩进、空格和换行符，如果 space 是一个数字，则返回值文本在每个级别缩进指定数目的空格，如果 space 大于 10，则文本缩进 10 个空格。space 也可以使用非数字，如：\t。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ba155f2c67e14cc0b063a92a683220ff.png)

```javascript
<template>
<div>
  <b-code-editor v-model="jsonStr" :indent-unit="4" height="auto"/>
</div>
</template>
<script>
  const jsonData = `{"title":"测试json数据","children":[{"name":"子项名称", "desc":"子项说明" },{"name":"子项名称1", "desc":"子项说明1" }]}`

  export default {
    data() {
      return {
        jsonStr: jsonData
      }
    }
  }
</script>
```

# 4 其他配置项

| 参数         | 说明                         | 类型    | 可选值                               | 默认值             |
| ------------ | ---------------------------- | ------- | ------------------------------------ | ------------------ |
| value        | 绑定数据，可用v-model        | String  | —                                    | 0                  |
| show-number  | 显示行号                     | Boolean | —                                    | true               |
| mode         | 模式                         | String  | ‘application/json’,‘text/javascript’ | ‘application/json’ |
| theme        | 提供若干个默认比较好看的皮肤 | String  | 可选值参考其他配置项中列出           | idea               |
| lint         | 是否进行lint检查             | Boolean | 暂时只支持json                       | true               |
| readonly     | 只读模式                     | Boolean | -                                    | false              |
| auto-format  | 是否自动格式化               | Boolean | -                                    | true               |
| indent-unit  | 缩进字符                     | Number  | -                                    | 2                  |
| smart-indent | 是否自动缩进                 | Boolean | -                                    | true               |
| line-wrap    | 代码换行                     | Boolean | -                                    | true               |
| gutter       | 代码折叠                     | Boolean | -                                    | true               |
| height       | 默认编辑器高度               | String  | —                                    | 300px              |

# 5 Events 事件

```javascript
<template>
	<div>
	  <b-code-editor v-model="jsonStr" :indent-unit="4" height="auto"/>
	  <p><b-button @click="$refs['editor'].formatCode()">手动触发格式化</b-button></p>
	</div>
</template>
```

| 事件名     | 说明               | 返回值 |
| ---------- | ------------------ | ------ |
| on-change  | 输入项改变事件     | value  |
| formatCode | 手动触发格式化方法 | -      |
| refresh    | 手动刷新方法       | -      |
| getValue   | 自行获取值         | -      |

# 6 theme 皮肤属性

`theme`属性可选值

- idea
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/774c7c41e1fd4dad81c4a8c4d56fb608.png)
- eclipse
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/97d00490aa2c452e96cc64717798c9d5.png)
- duotone-light
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/a9a97cd2eff84e60b687ddf8368c6e50.png)
- mdn-like
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/68288d52b01d41fab7653d9c3dcfb10a.png)
- xq-light
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/988f7ebe12ff42ef80f6b1a527bed1c7.png)
- dracula
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/2aa62e024dbd41158a8bc66db799ef82.png)
- rubyblue
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/04b909ae46234a0c871daa0545215526.png)
- monokai
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/7baa723e068747a885ae2fa3b80048d2.png)
- material
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/f949cc3c5f7344dc98c38751bd8db085.png)
- material-darker
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/48f9a957450641e4b0ebb269f09aba7d.png)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
