// pages/discovery/discovery.js
import utils from './../../utils/util.js';
import { Honye } from './../../utils/apis.js';

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
    Honye.get(Honye.CONFIG).then(res => {
      app.globalData.config = res;
      that.setData({
        published: app.globalData.version.versionCode <= res.newestVersion,
        remoted: true
      })
      if (app.globalData.version.versionCode > res.newestVersion) {
        that.initBing()
      }
      wx.hideLoading();
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