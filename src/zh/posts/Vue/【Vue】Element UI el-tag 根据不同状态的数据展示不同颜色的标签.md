---
date: 2021-09-17 03:37:39

title: 【Vue】Element UI el-tag 根据不同状态的数据展示不同颜色的标签
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Vue】Element UI el-tag 根据不同状态的数据展示不同颜色的标签

## Element UI 根据不同状态的数据展示不同颜色的标签

展示标签可以使用el-tag，不同的数据可以使用三目运算进行管控
代码如下：

```css
<el-tag :type="(scope.row.auditstatus == '0' ? '' : (scope.row.auditstatus == '1' ? 'success' : (scope.row.auditstatus == '2' ? 'danger' : (scope.row.auditstatus == '3' ? 'warning' : 'danger'))))" size="mini">
	{{ scope.row.auditstatus == '0' ? '初始值' : (scope.row.auditstatus == '1' ? '审核通过' : (scope.row.auditstatus == '2' ? '审核不通过' : (scope.row.auditstatus == '3' ? '待审核' : '删除'))) }}
</el-tag>
123
```

效果图如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200918092202308.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200918092237888.png#pic_center)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
