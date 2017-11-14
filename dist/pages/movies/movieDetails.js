// pages/movies/movieDetails.js
const {subjectInfoUrl} = require('../../config');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {},
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
    this.setData({ id: options.id })
    this.getDetails(options.id);
    this.getComments(options.id);
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
          pubdates,
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
      url: `${subjectInfoUrl}/${id}/comments`,
      data: {
        apikey: '0b2bdeda43b5688921839c8ecb20399b',
        start: 0,
        count: 6
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