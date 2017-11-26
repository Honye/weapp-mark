// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  handleChange(e) {
    console.log("事件", e.detail);
    this.setData({
      rating: e.detail.value
    })
  },
})