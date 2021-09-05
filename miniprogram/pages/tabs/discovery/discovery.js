// discovery
// import wxCloud from '../../../utils/wxCloud';
import * as GitHubApis from '../../../apis/github';
import { getHotMovies } from '../../../apis/douban.js';

const db = wx.cloud.database();

Page({

  data: {
    circles: [
      { url: '/pages/pArticle/pages/categories/categories', image: '/assets/images/discovery/icon_classification.png', title: '分类查找' },
      { url: '/pages/pMovie/pages/cards/card', image: '/assets/images/discovery/icon_daily.png', title: '每日电影卡片' },
      { url: '/pages/pMovie/pages/intheaters/in_theaters', image: '/assets/images/discovery/icon_mood.png', title: '影院热映' },
    ],
    cardCur: 0,
    swiperHide: false,
    banners: [],
    articles: [],
    nowDay: new Date().getDate(),
    intheaters: null,
    movieStart: 0,
    movieHasMore: true,
    movieLoading: false
  },

  onLoad (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          swiperHeight: res.windowWidth*3/5
        })
      },
    });
    this.getData();
    // wxCloud('wxacode')
    //   .then((res) => {
    //     console.log('app code ===', res);
    //   });
  },

  onShow () {
    this.selectComponent('#tabBar').setData({ selected: 0 });
  },

  handleSwitchTab (e) {
    const { index, list } = e.detail;
    wx.switchTab({
      url: list[index].pagePath
    });
  },

  /**
   * 获取数据
   */
  getData () {
    this.getBanners();
    this.getHotMovies();
    this.getArticles();
  },

  /** 获取轮播数据 */
  getBanners () {
    db.collection('banners').orderBy('id', 'desc').limit(4).get().then( ({ data }) => {
      this.setData({
        banners: data,
      });
    });
  },

  /** 豆瓣热门 */
  async getHotMovies () {
    const { movieStart, intheaters } = this.data;
    this.setData({ movieLoading: true });
    const res = await getHotMovies({
      start: movieStart
    });
    const list = res.subject_collection_items || [];
    this.setData({
      intheaters: movieStart === 0 ? list : [...intheaters, ...list],
      movieStart: movieStart + res.count,
      movieHasMore: res.start + res.count < res.total,
      movieLoading: false
    });
  },

  loadMoreHot () {
    const { movieLoading, movieHasMore } = this.data;
    if (!movieLoading && movieHasMore) {
      this.getHotMovies();
    }
  },

  /** 文章数据 */
  getArticles () {
    db.collection('articles').get().then(({ data }) => {
        this.setData({
            articles: data
        })
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
    });
  },

  toDropDown: function() {
    wx.navigateTo({
      url: './../marked/marked',
    })
  },

  onShareAppMessage (opt) {
    return {
      title: "好用得不得了",
      imageUrl: "http://xpic.588ku.com/figure/00/00/00/08/56/5355a15b1f68dfd.jpg!/fw/800"
    }
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
