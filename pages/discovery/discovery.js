// pages/discovery/discovery.js
const config = require('../../config');
const { bannersUrl, acticlesUrl} = config;

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    articles: [],
    indicatorActiveColor: "#fff",
    circular: true,
    nowDay: new Date().getDate()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          swiperHeight: res.windowWidth*3/5
        })
      },
    })
    this.getData();
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
   * 进入分类查找
   */
  bindClassifyTap: function() {
    wx.navigateTo({
      url: '../classification/index',
    })
  },

  /**
   * 开发中...
   */
  showCommonModal: function () {
    app.showCommonModal();
  },

  /**
   * 每日电影卡片
   */
  toCard: function() {
    wx:wx.navigateTo({
      url: '../card/card'
    })
  },

  /**
   * 获取数据
   */
  getData: function() {
    this.getBanners();
    this.getArticles();
  },

  /**
   * 获取轮播数据
   */
  getBanners: function() {
    let _this = this;
    wx.request({
      url: bannersUrl,
      header: {
        "Content-Type": "json"
      },
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        _this.setData({
          banner: res.data
        });
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 文章数据
   */
  getArticles: function() {
    let _this = this;
    wx.request({
      url: acticlesUrl,
      header: {
        "Content-Type": "json"
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        _this.setData({
          articles: res.data
        });
      },
    })
  },

  onBannerTap: function(event) {
    const {banner} = this.data;
    const {index}=event.currentTarget.dataset;
    const urls = [];
    for(let item of banner) {
      urls.push(item.image)
    }
    wx.previewImage({
      current: urls[index],
      urls
    })
  },

  toDropDown: function() {
    wx.navigateTo({
      url: './../marked/marked',
    })
  },
  /**
   * 影院热映
   */
  toTheatre: function() {
    if(app.globalData.hasPermission) {
      wx.navigateTo({
        url: './../intheaters/in_theaters',
      })
    } else {
      app.showCommonModal();
    }
  }
})