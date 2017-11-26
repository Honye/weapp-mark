// components/article/article.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    aid: {
      type: String,
      value: ''
    },
    image: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    likeCount: {
      type: Number,
      value: 0
    }
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
    toggleLike(e){
      console.log("开关", e);
    }
  }
})
