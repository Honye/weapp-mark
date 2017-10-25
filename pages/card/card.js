// pages/card/card.js
const cardsUrl = require('../../config').cardsUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [{}],
    current: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  initData: function() {
    let _this = this;
    wx.request({
      url: cardsUrl,
      header: {
        "Content-Type": "json"
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        _this.setData({
          cards: res.data
        });
      }
    })
  },

  /**
   * 切换卡片
   */
  onChange: function(event) {
    this.setData({
      current: event.detail.current
    })
  }
})