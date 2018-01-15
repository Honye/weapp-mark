// pages/discovery/discovery.js
import { Honye } from './../../utils/apis.js';
import Bing from './../common/bing/bing.js';
import AV from './../../assets/libs/av-live-query-weapp-min.js';
import bind from './../../assets/libs/live-query-binding.js';

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
    return AV.Promise.all([
      this.fetchBanners.call(this),
      this.fetchArticles()
    ])
  },

  /**
   * 文章数据
   */
  getArticles: function() {
    let that = this;
    return Honye.get(Honye.ARTICLES).then( res => {
      that.setData({
        articles: res
      })
    })
  },

  /**
   * Banner 点击事件
   */
  onBannerTap: function(event) {
    const {banner} = this.data;
    const {index} = event.currentTarget.dataset;
    console.log(index, banner);
    const urls = [];
    for(let item of banner) {
      urls.push(item.get('image'))
    }
    wx.previewImage({
      current: urls[index],
      urls
    })
  },

  /**
   * 转发
   */
  onShareAppMessage: function (opt) {
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
    }).then(res => {
      that.setData({
        published: res,
        remoted: true
      })
      if (!res) new Bing()
      wx.hideLoading()
    });
  },

  login() {
    return AV.Promise.resolve(AV.User.current())
      .then( user => (
        user ? (user.isAuthenticated().then(authed => {
          authed ? user : null
        })) : null
      ))
      .then(user => (
        user ? user : AV.User.loginWithWeapp()
      ))
      .catch(error => console.error(error.message))
  },

  fetchBanners() {
    const query = new AV.Query('Banner').descending('createdAt');
    const setBanners = this.setBanners.bind(this)
    return AV.Promise.all([query.find().then(setBanners), query.subscribe()])
      .then(([banners, subscription]) => {
        this.subscription = subscription;
        if(this.unbind) this.unbind()
        this.unbind = bind(subscription, banners, setBanners)
      }).catch(error => console.error(error.message))
  },

  fetchArticles() {
    const that = this
    const query = new AV.Query('Article').descending('createdAt').limit(6)
    return query.find().then(articles => {
      that.setData({ articles })
    })
  },

  setBanners(banners) {
    this.setData({banner: banners})
    return banners;
  },

  onUnload(options) {
    this.subcription.unsubscribe()
    this.unbind()
  }

})