// discovery
import { Honye } from '../../../utils/apis.js'
import Bing from '../../common/bing/bing.js'

var app = getApp()
const db = wx.cloud.database()

Page({

  data: {
    published: false,
    remoted: false,
    banners: [],
    articles: [],
    nowDay: new Date().getDate(),
    bings: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          swiperHeight: res.windowWidth*3/5
        })
      },
    })
    this.getData()
    this.getRemoteConfig()
  },

  /**
   * 获取数据
   */
  getData() {
    this.getBanners();
    this.getArticles();
  },

  /** 获取轮播数据 */
  getBanners() {
    db.collection('banners').get().then( ({ data }) => {
        this.setData({
            banners: data,
        })
    })
  },

  /** 文章数据 */
  getArticles() {
    db.collection('articles').get().then(({ data }) => {
        this.setData({
            articles: data
        })
    })
  },

  onBannerTap(event) {
    const { banners } = this.data
    const { index }=event.currentTarget.dataset
    const urls = [];
    for(let item of banners) {
      urls.push(item.image)
    }
    wx.previewImage({
      current: urls[index],
      urls,
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
  onShareAppMessage(opt) {
    return {
      title: "好用得不得了",
      path: "/pages/discovery/discovery",
      imageUrl: "http://xpic.588ku.com/figure/00/00/00/08/56/5355a15b1f68dfd.jpg!/fw/800",
      success: res => {
      },
      complete: res => {
      }
    }
  },

  /**
   * 获取在线配置
   */
  getRemoteConfig() {
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
    })
  }
})
