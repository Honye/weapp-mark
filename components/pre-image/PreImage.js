// components/pre-image/PreImage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: ''
    },
    mode: {
      type: String,
      value: 'scaleToFill'
    },
    lazyLoad: {
      type: Boolean,
      value: false
    },
    placeImg: {
      type: String,
      value: '/assets/images/img-loding.jpg'
    },
    width: {
      type: String,
      value: '100%'
    },
    height: {
      type: String,
      value: '0'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loaded: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onImageLoad: function(e) {
      const width = e.detail.width,
           height = e.detail.height;
      this.setData({
        loaded: true
      })
      this.triggerEvent('load', e.detail);
    },
    _onImgeErr: function(e) {
      let msgs = e.detail.errMsg.split('(');
      this.setData({
        error: "(" + msgs[msgs.length-1]
      })
      this.triggerEvent('error', e.detail);
    }
  }
})
