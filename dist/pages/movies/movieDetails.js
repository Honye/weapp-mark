// pages/movies/movieDetails.js
import { Douban } from './../../utils/apis.js';

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
    isFold: true
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
      title: options.title || '详情',
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
    Douban.get(`${Douban.DETAILS}/${id}`).then(res => {
      const data = res;
      let pubdates = '';
      for (let item of res.pubdates) {
        if (item.indexOf("中国") > 0) {
          pubdates = item + "上映";
        }
      }
      let casts = [];
      for (let item of data.casts) {
        casts.push(item.name);
      }
      wx.hideLoading();
      _this.setData({
        details: res,
        pubdates,
        casts: casts.join(' / '),
        loaded: true,
        comments_count: data.comments_count
      });
      wx.setNavigationBarTitle({
        title: res.title,
      })
    })
  },

  /**
   * 获取影视短评
   */
  getComments: function(id) {
    const that = this;
    Douban.get(
        `${Douban.DETAILS}/${id}/comments`,
        { start: 0, count: 6 }
      ).then(res => {
        that.setData({
          comments: res.comments
        })
      }
    )
  },

  /**
   * 折叠开关
   */
  foldToggle() {
    const {isFold} = this.data;
    this.setData({
      isFold: !isFold
    })
  }
})