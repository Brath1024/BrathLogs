---
date: 2022-03-15 09:39:26

title: 【Vue】el-upload限制只上传一张图片并隐藏右侧的上传区域
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Vue】el-upload限制只上传一张图片并隐藏右侧的上传区域

使用 element UI 中的el-upload 如何限制上传一张图片后隐藏右侧的上传区域

![img](https://img-blog.csdnimg.cn/img_convert/8c0456f090629e60b774748ac33ee22b.png)



主要代码块：

```javascript
监听事件
watch: {
  onChangeImgUrl: {
    handler(newName) {
      var aa = document.querySelector('.el-upload--picture-card')
      if (newName) {
        aa.style.display = 'none' 
      } else {
        setTimeout(() => {
          aa.style.display = 'inline-block'
        }, 1100)
      }
    }
  }
```

原理：

因为只上传一张图片，监听图片的url 即可。听过监听图片的url存在与否，通过获取dom元素设置不同的样式。



以下完整代码实现如下效果:

![img](https://img-blog.csdnimg.cn/img_convert/b3c00ea22f8c0efde7e61125a35a7083.png)

```xml

父组件setBank.vue
<template>
  <div class="setBank">
    <el-button type="primary" @click="addInfo">入驻</el-button>
    <el-dialog :visible.sync="checkDialogVisible" title="入驻">
      <Upload />
    </el-dialog>
  </div>
</template>
 
<script>
import Upload from './upload.vue'
export default {
  components: {
    Upload
  },
  data() {
    return {
      checkDialogVisible: false
    }
  },
 
  methods: {
    //  入驻
    addInfo() {
      this.checkDialogVisible = true
    }
  }
}
</script>
```



```xml

子组件 upload.vue
<template>
  <div class="con_form">
    <el-form ref="addForm" :model="addForm" class="demo-comCreditForm" label-width="200px">
      <el-form-item label="企业名称：" prop="name"> <el-input v-model="addForm.name" placeholder="转贷机构名称" /> </el-form-item>
      <el-form-item label="统一社会信用代码：" prop="code"> <el-input v-model="addForm.code" placeholder="请输入统一社会信用代码" /> </el-form-item>
      <div class="upload_icon">
        <el-form-item label="上传：" prop="addForm">
          <el-upload
            :auto-upload="false"
            :limit="limitCount"
            :on-remove="handleRemove"
            :on-change="onChange"
            :on-success="handleSuccess"
            :file-list="fileList"
            :data="uploadData"
            :before-upload="beforeAvatarUpload"
            action="#"
            class="avatar-uploader"
            list-type="picture-card"
            accept="image/jpg,image/jpeg,image/png">
            <img v-if="url" :src="url" class="el-upload-list__item-thumbnail"></img>
            <i v-else slot="default" class="el-icon-plus" />
          </el-upload>
          <div class="el-upload__tip">jpg.jpeg、png格式，大小5M以内</div>
        </el-form-item>
      </div>
    </el-form>
  </div>
 
</template>
 
<script>
export default {
  data() {
    return {
      limitCount: 1,
      url: '',
      onChangeImgUrl: '',
      uploadData: {
        name: 'testFile'
      },
      fileList: [],
      //  申请入驻银行 表单
      addForm: {
        name: '',
        code: '' //  社会信用代码
      }
    }
  },
  watch: {
    onChangeImgUrl: {
      handler(newName) {
        var aa = document.querySelector('.el-upload--picture-card')
        if (newName) {
          aa.style.display = 'none'
        } else {
          setTimeout(() => {
            aa.style.display = 'inline-block'
          }, 1100)
        }
      }
    }
  },
  methods: {
    onChange(file, fileList) {
      this.onChangeImgUrl = file.url
    },
    handleRemove(file, fileList) {
      this.onChangeImgUrl = ''
    },
    handleSuccess(file, fileList) {
      this.$set(this.myForm, 'netTgThumbnail', fileList.response.bean.result.fileUrlPath)
    },
    // 限制图片大小
    beforeAvatarUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt5M
    }
  }
}
</script>
 
<style scoped lang="scss">
/deep/.upload_icon .el-form-item__content {
  position: relative;
  height: 190px;
}
.avatar-uploader {
  width: 145px;
  height: 145px;
  position: absolute;
  left: 0;
  top: 0;
}
.con_form .upload_icon .el-form-item__content .el-upload__tip {
  position: absolute;
  left: 0;
  bottom: 0;
  color: red;
}
</style>
```
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
