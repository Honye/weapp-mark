
![简单预览](http://upload-images.jianshu.io/upload_images/3762216-0f69a5369523e855.jpg)

网上一直再埋怨小程序没有组件化，现在小程序升级了，提供了自定义组件 Component，目前处于公测阶段。今天体验一回，将之前使用 template 写的评分组件重写了下。
[小程序自定义评分组件 template（精度0.1）](http://www.jianshu.com/p/daede61f2d72)

从小程序基础库版本 1.6.3 开始，小程序支持简洁的组件化编程。

### 自定义组件
自定义组件类似页面，由  `json` `wxml` `wxss` `js` 4个文件组成。

1. rating.json
    必需在 json 文件中声明为组件

    ```json
    {
        "component": true
    }
    ```

2. rating.wxml
    wxml 文件中编写布局

    ```html
    <view class='com-rating'>
      <view class='rating-icon' wx:for='{{[1,2,3,4,5]}}' wx:key='*this'
        bindtap='_handleTap' data-num='{{item}}'>
        <view class='rating-on' style='width:{{rating >= (max/5)*item ? 1 : rating < (max/5)*(item-1) ? 0 : (rating*10)%(max/5*10)/(max/5*10)}}em'>
          <image src='./../../images/rating_on_icon.png' mode='widthFix' style='width:1em' />
        </view>
        <view class='rating-off' style='width:1em;'>
          <image src='./../../images/rating_off_icon.png' mode='widthFix' style='width:1em' />
        </view>
      </view>
    </view>
    ```

3. rating.wxss
    修饰组件样式

    ```css
    .com-rating {
      display: inline-block;
      letter-spacing: .3em;
      position: relative;
    }
    .com-rating .rating-icon,
    .com-rating .rating-on,
    .com-rating .rating-off {
      display: inline-block;
    }
    .com-rating .rating-icon:not(:last-child) {
      margin-right: .2em;
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

4. rating.js
    初始化组件属性及事件

    ```js
    Component({
      // 声明组件属性及默认值
      properties: {
        rating: {
          type: Number,  // 必需 指定属性类型 [String, Number, Boolean, Object, Array, null(任意类型)]
          value: 10
        },
        max: {
          type: Number,
          value: 5
        },
        disabled: {
          type: Boolean,
          value: false
        }
      },
    
      // 组件私有和公开的方法，组件所使用的方法需在此声明
      methods: {
        _handleTap: function (e) {
          if (this.data.disabled) return;
          const { max } = this.data;
          const { num } = e.currentTarget.dataset;
          this.setData({
            rating: max / 5 * num
          })
          // 自定义组件事件
          this.triggerEvent('change', { value: max / 5 * num }, e);
        }
      }
    
    })
    ```

### 使用
组件除了在 page 中使用外，在组件中也可以使用。以 page 举例。
1. .json
    在 json 文件中需声明组件

    ```json
    {
      "usingComponents": {
        "com-rating": "/components/rating/rating"
      }
    }
    ```

2. .wxml
    ```html
    <!-- bindchange 事件需与组件中定义的自定义事件保持一致，如组件定义的 change，这里使用的是 bindchange -->
    <com-rating max="10" rating='6.5' bindchange='handleChange' />
    ```

3. .js
    在 js 文件中监听事件

    ```js
    /**
     *@param {Object} e 组件自定义事件传递的数据
     */
    handleChange: function(e) {
        this.setData({
          rating: e.detail.value
        })
     }
    ```

组件样式有限制，这里没有使用 FontAwesome，如需使用字体图标可查看[小程序自定义评分组件 template（精度0.1）](http://www.jianshu.com/p/daede61f2d72)

完整源码及使用可查看 [weapp-mark](https://github.com/Hongye567/weapp-mark)