// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  handleChange(e) {
    this.setData({
      rating: e.detail.value
    })
  },
})