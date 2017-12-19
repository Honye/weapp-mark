// pages/discovery/discovery.js
import { Honye } from './../../utils/apis.js';
import Bing from './../common/bing/bing.js';

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    published: false,
    remoted: false,
    banner: [],
    articles: [],
    nowDay: new Date().getDate(),
    bings: []
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
    this.getRemoteConfig();
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
    let that = this;
    Honye.get(Honye.BANNERS).then( res => {
      that.setData({
        banner: res
      })
    })
  },

  /**
   * 文章数据
   */
  getArticles: function() {
    let that = this;
    Honye.get(Honye.ARTICLES).then( res => {
      that.setData({
        articles: res
      })
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
   * 转发
   */
  onShareAppMessage: function (opt) {
    console.log("转发", opt);
    return {
      title: "好用得不得了",
      path: "/pages/discovery/discovery",
      imageUrl: "http://xpic.588ku.com/figure/00/00/00/08/56/5355a15b1f68dfd.jpg!/fw/800",
      success: res => {
      },
      complete: res => {
      }
    };
  },

  /**
   * 获取在线配置
   */
  getRemoteConfig: function() {
    const that = this;
    wx.showLoading({
      title: 'loading...',
    })
    app.hasPublished(res => {
      that.setData({
        published: res,
        remoted: true
      })
      if(!res) new Bing()
      wx.hideLoading()
    });
  }

})