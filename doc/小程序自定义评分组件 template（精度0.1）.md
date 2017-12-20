
![小程序评分组件](http://upload-images.jianshu.io/upload_images/3762216-f09f5b490abcd954.jpg)

### 说明
在豆瓣评分中，最终影视评分最大值是10分，而在影评时最大值是5星。因此评分的最大值是可调的。

### 如何实现
五角星也就两种状态，实星和空星。底部放置空星代表最大评分，顶部放置实星代表实际评分，只需计算出实星与空星的比例，使实星遮盖空星即可得到最终效果。前面的整星不用计算百分比，只需计算最后一个实星与空星的百分比即可。

简单计算流程：
> 五角星数量num: 5
最大评分max: 10
一颗星代表unit: max/num = 2
实际评分value: 7.3
去除整星剩余百分比percent: value%unit/unit
为避免计算精确问题从而使用整数运算
最终: percent = (value*10)%(unit*10)/(unit*10)

![计算精度问题](http://upload-images.jianshu.io/upload_images/3762216-c9d30d25207ee000.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 使用外部字体
这里使用到了 [FontAwesome](http://fontawesome.io/icons/)，可以查看 [小程序使用外部字体](./小程序使用外部字体.md)

### 源码

#### rating.wxml
```html
<template name="rating">
  <view class='com-rating'>
    <block wx:for='{{[1,2,3,4,5]}}' wx:key='*this'>
      <view class='rating-on' 
        style='width:{{rating >= (max/5)*item ? 1 : rating < (max/5)*(item-1) ? 0 : (rating*10)%(max/5*10)/(max/5*10)}}em'
      ><i class='fa fa-star'></i></view>
      <view class='rating-off'><i class='fa fa-star'></i></view>
    </block>
  </view>
</template>
```

#### rating.wxss
```css
.com-rating {
  display: inline-block;
  font-size: 1.2em;
  letter-spacing: .3em;
}
.com-rating .rating-on,
.com-rating .rating-off {
  display: inline-block;
}
.com-rating .rating-on {
  color: black;
  position: absolute;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.com-rating .rating-off {
  color: #DBDBDB;
  padding: 0;
  margin: 0;
}
```

#### 使用
**page.wxml**
```html
<import src='../rating/rating' />
...
<template is='rating' data='{{rating:7.3, max:10}}'></template>
```
**page.wxss**
```css
@import '../rating/rating';
...
```

因为图标使用的是字体文件，所以星星也可以改为任何文字、颜色，我这里只讲了如何去实现。

### TODO
 - 用户可操作评分
 - 大小及间距可调
 - 默认配置

完整源码及使用可查看我的开源项目 [weapp-mark](https://github.com/Hongye567/weapp-mark)
