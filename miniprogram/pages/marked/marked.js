// pages/marked/marked.js
const WxParse = require('../../templates/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentNav: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHTML();
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

  onNavChange: function (e) {
    const { nav } = e.currentTarget.dataset,
      { currentNav } = this.data;
    if (nav === currentNav) {
      this.setData({
        currentNav: 0
      })
    } else {
      this.setData({
        currentNav: nav
      })
    }
  },

  getHTML: function() {
    const that = this;
    wx.request({
      url: 'https://hongye567.github.io/2017/06/22/React-Native-集成极光推送-jpush-react-native/#more',
      header: {
        'content-type': 'text/html; charset=utf-8'
      },
      success: res => {
        console.log("HTML", res);
        WxParse.wxParse('article', 'html', res.data, that, 5);
      }
    })
  }
})