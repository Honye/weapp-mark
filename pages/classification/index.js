// pages/classification/index.js
const classifyUrl = require('../../config').classifyUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classify: [],
    loaded: false
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

  /**
   * 获取数据
   */
  initData: function() {
    wx.showLoading({
      title: 'loading...',
    })
    let _this = this;
    wx.request({
      url: classifyUrl,
      header: {
        "Content-Type": "json"
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        _this.setData({
          classify: res.data
        }, function() {
          _this.modifyData();
        });
      }
    })
  },

  /**
   * 调整数据
   */
  modifyData: function() {
    let classify = this.data.classify;
    for (let item of classify) {
      if (item.children.length < 6) {
        for(let i=0,length=(6-item.children.length);i<length;i++) {
          item.children.push(" ");
        }
      } else if((item.children.length-6)%4 !== 0) {
        for (let i = 0,length = (4 - (item.children.length - 6)%4);i<length;i++) {
          item.children.push(" ");
        }
      }
    }
    wx.hideLoading();
    this.setData({
      classify,
      loaded: true
    });
  }
})