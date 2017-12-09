// pages/discovery/discovery.js
const config = require('../../config');
import utils from './../../utils/util.js';
const { bannersUrl, acticlesUrl} = config;

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    published: app.globalData.version.versionCode <= app.globalData.config.newestVersion,
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
   * 进入分类查找
   */
  bindClassifyTap: function() {
    wx.navigateTo({
      url: '../classification/index',
    })
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
    wx.navigateTo({
      url: './../intheaters/in_theaters',
    })
  },

  /**
   * 搜索
   */
  toSearch: function() {
    if (app.globalData.config.hasPermission) {
      wx.navigateTo({
        url: './../search/search',
      })
    }
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
        console.log("成功", res);
      },
      complete: res => {
        console.log("完成", res);
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
    wx.request({
      url: config.configUrl,
      success: res => {
        app.globalData.config = res.data;
        that.setData({
          published: app.globalData.version.versionCode <= res.data.newestVersion,
          remoted: true
        })
        wx.hideLoading();
        if (app.globalData.version.versionCode > res.data.newestVersion) {
          that.initBing()
        }
      }
    })
  },

  /**
   * 必应壁纸数据（三方）
   */
  initBing() {
    let bings = [];
    for(let i=0; i<10; i++) {
      let bing = {};
      bing.title = utils.getPreDate(i);
      bing.image = `https://bing.ioliu.cn/v1?d=${i}`;
      bings.push(bing);
    }
    this.setData({ bings });
  }

})