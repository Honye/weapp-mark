// components/btn-fav/FavButton.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: String,
      value: '2em'
    },
    width: {
      type: String,
      value: '2em'
    },
    checked: {
      type: Boolean,
      value: false
    },
    iconNormal: {
      type: String,
      // value: '/assets/images/daily_card_like_unchecked.png'
      value: '/assets/images/icon-unlike.png'
    },
    iconChecked: {
      type: String,
      // value: '/assets/images/daily_card_like_checked.png'
      value: '/assets/images/icon-liked.png'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onToggle: function(e) {
      const { checked } = this.data;
      this.triggerEvent('change', { checked })
    }
  }
})
