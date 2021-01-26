// discovery
import Bing from '../../common/bing/bing.js';
import wxCloud from '../../../utils/wxCloud';
import * as GitHubApis from '../../../apis/github';

var app = getApp()
const db = wx.cloud.database()

Page({

  data: {
    circles: [
      { url: '/pages/pArticle/pages/categories/categories', image: '/assets/images/discovery/icon_classification.png', title: '分类查找' },
      { url: '/pages/pMovie/pages/cards/card', image: '/assets/images/discovery/icon_daily.png', title: '每日电影卡片' },
      { url: '/pages/pMovie/pages/intheaters/in_theaters', image: '/assets/images/discovery/icon_mood.png', title: '影院热映' },
    ],
    cardCur: 0,
    swiperHide: false,
    published: true,
    remoted: false,
    banners: [],
    articles: [],
    nowDay: new Date().getDate(),
    bings: [],
    intheaters: []
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
    // this.getRemoteConfig()
    // wxCloud('wxacode')
    //   .then((res) => {
    //     console.log('app code ===', res);
    //   });
    
    this.getActivityEvents();
  },

  /**
   * 获取数据
   */
  getData() {
    this.getBanners();
    this.getIntheaters();
    this.getArticles();
  },

  /** 获取轮播数据 */
  getBanners() {
    db.collection('banners').orderBy('id', 'desc').limit(4).get().then( ({ data }) => {
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

  /** 影院热映 */
  getIntheaters () {
    wxCloud('nowPlaying')
      .then(res => {
        this.setData({
          intheaters: res
        });
      });
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
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  hideSwiperBg() {
    this.setData({
      swiperHide: true,
    })
  },

  showSwiperBg() {
    this.setData({
      swiperHide: false,
    })
  },

  getActivityEvents () {
    GitHubApis.getEvents({
      username: 'Honye'
    })
      .then((res) => {
        console.log('GitHub ', res);
      })
      .catch((err) => {
        console.error(err);
      });
  }
})
