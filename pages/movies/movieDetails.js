// pages/movies/movieDetails.js
const {subjectInfoUrl} = require('../../config');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {},
    genres: '',
    pubdates: '',
    comments_count: 0,
    comments: [],
    loaded: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          bgImgHeight: res.windowWidth/2
        })
      },
    })
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.getDetails(options.id);
    this.getComments(options.id);
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
   * 获取影视详情
   */
  getDetails: function(id) {
    wx.showLoading({
      title: 'loading...',
    });
    let _this = this;
    wx.request({
      url: `${subjectInfoUrl}/${id}`,
      data: {
        apikey: '0b2bdeda43b5688921839c8ecb20399b'
      },
      header: { "Content-Type": "json" },
      method: 'GET',
      success: function(res) {
        const data = res.data;
        let pubdates = '';
        for (let item of res.data.pubdates) {
          if(item.indexOf("中国")>0) {
            pubdates = item+"上映";
          }
        }
        let casts = [];
        for (let item of data.casts) {
          casts.push(item.name);
        }
        wx.hideLoading();
        _this.setData({
          details: res.data,
          genres: res.data.genres.join(' / '),
          pubdates,
          countries: res.data.countries.join(' / '),
          casts: casts.join(' / '),
          loaded: true,
          comments_count: data.comments_count
        });
      }
    })
  },

  /**
   * 获取影视短评
   */
  getComments: function(id) {
    const that = this;
    wx.request({
      url: `https://api.douban.com/v2/movie/subject/${id}/comments`,
      data: {
        apikey: '0b2bdeda43b5688921839c8ecb20399b'
      },
      header: { "Content-Type": "json" },
      method: 'GET',
      success: (res) => {
        that.setData({
          comments: res.data.comments
        })
      }
    })
  },

  onMoreTap: function(e) {
    const {url} = e.currentTarget.dataset;
    wx.setClipboardData({
      data: url,
      success: res => {
        wx.showModal({
          content: '因小程序限制无法直接查看，请前往浏览器粘贴访问更多',
          showCancel: false,
        })
      }
    })
  }
})