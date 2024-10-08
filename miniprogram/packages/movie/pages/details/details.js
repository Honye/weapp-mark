// @ts-check
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import {
  getDetail,
  getInterests,
  getPhotos,
  markMovie,
  unmarkMovie,
  doingMovie,
  getCelebrities,
} from '../../../../apis/douban.js';
import Comment from '../../../../models/Comment'
import { apiSubmitPages } from '../../../../apis/vercel';
import { emitter, events } from '../../../../utils/events';

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    id: '',
    details: /** @type {DouBan.MovieDetail} */ ({}),
    /** @type {DouBan.Actor[]} */
    directorList: [],
    /** @type {DouBan.Actor[]} */
    actorList: [],
    crewCount: 0,
    /** @type {{ image: string; url: string }[]} */
    trailers: [],  // 预告片
    pubdates: '',
    comments_count: 0,
    /** @type {Comment[]} */
    comments: [],
    /** @type {DouBan.Photo[]} */
    photos: [],
    loaded: false,
    isFold: true,
    /** @type {{ id: number; title: string; cover: string; count: number; }[]} */
    movielistList: []
  },

  storeBindings: {
    store,
    fields: ['app']
  },

  /**
   * @param {object} options
   * @param {string} options.id
   * @param {string} [options.title]
   * @param {'movie'|'tv'} [options.type = 'movie']
   */
  onLoad (options) {
    options = Object.assign({}, { type: 'movie' }, options);
    if (options.title) {
      const title = decodeURIComponent(options.title)
      wx.setNavigationBarTitle({ title })
    }
    this.setData({
      id: options.id,
      type: options.type
    })

    this.getDetails(options.id, options.type);
    this.getCelebrities(options.id, options.type);
    this.getComments(options.id, options.type);
    this.getPhotos(options.id, options.type);
  },
  
  /**
   * 获取影视详情（豆瓣）
   * @param {string} id
   * @param {'movie'|'tv'} [type = 'movie']
   */
  async getDetails (id, type = 'movie') {
    wx.showLoading({
      title: 'loading...',
    });

    const res = await getDetail({ id, type });
    const casts = res.actors.map(item => item.name);
    const [trailer] = res.trailers || [];
    const trailers = trailer && [{
      image: trailer.cover_url,
      url: trailer.video_url
    }];
    wx.hideLoading();
    wx.setNavigationBarTitle({
      title: res.title
    });
    this.setData({
      details: res,
      casts: casts.join('/'),
      loaded: true,
      comments_count: res.comment_count,
      trailers
    });
    this.submitSearchPage();
  },

  /**
   * 获取影人列表
   * @param {string} id
   * @param {'movie'|'tv'} [type = 'movie']
   */
  async getCelebrities (id, type = 'movie') {
    const { directors, actors, total } = await getCelebrities({ id, type });
    this.setData({
      directorList: directors,
      actorList: actors,
      crewCount: total,
    });
  },

  /**
   * 获取影视短评
   * @param {string} id
   * @param {'movie'|'tv'} [type = 'movie']
   */
  async getComments (id, type = 'movie') {
    const res = await getInterests({
      id,
      start: 0,
      count: 10,
      type
    });
    const comments = res.interests.map(item => Comment.fromDouban(item));
    this.setData({
      comments
    });
  },

  /** 想看/已看/在看 */
  async handleAction (e) {
    if (!store.douban.accessToken) {
      // case 未登录豆瓣
      wx.navigateTo({
        url: '/packages/douban/pages/login-phone/login-phone'
      });
      return;
    }

    /** @type {{ action: DouBan.InterestStatus }} */
    const { action } = e.currentTarget.dataset;
    const { id, details } = this.data;

    if (action === 'done') {
      wx.navigateTo({
        url: `../mark/mark?movieID=${id}&type=${details.type}`,
        events: {
          change: ({ status, rating, create_time }) => {
            this.setData({
              'details.interest.status': status,
              'details.interest.rating': rating,
              'details.interest.create_time': create_time
            });
            emitter.emit(events.TAB_MOVIES_UPDATE, { status });
            wx.createInterstitialAd({ adUnitId: 'adunit-56316cd90de2e91c' }).show();
          }
        }
      });
      return;
    }

    const { interest } = details;
    if (interest && action === interest.status) {
      // 取消标记
      wx.showModal({
        title: '提醒',
        content: '确认删除标记吗？',
        confirmText: '删除',
        cancelText: '再想想',
        success: async ({ confirm }) => {
          if (confirm) {
            wx.showLoading({ title: '' });
            const res = await unmarkMovie({ movieID: id, type: details.type });
            wx.hideLoading();
            this.setData({
              'details.interest.status': res.status
            });
            emitter.emit(events.TAB_MOVIES_UPDATE, { status: res.status });
            wx.createInterstitialAd({ adUnitId: 'adunit-56316cd90de2e91c' }).show();
          }
        }
      });
      return;
    }

    wx.showLoading({ title: '' });
    let res;
    switch (action) {
      case 'mark':
        res = await markMovie({ movieID: id, type: details.type });
        break;
      case 'doing':
        res = await doingMovie({ movieID: id, type: details.type });
        break;
      default:
    }
    wx.hideLoading();
    this.setData({
      'details.interest.status': res.status
    });
    emitter.emit(events.TAB_MOVIES_UPDATE, { status: res.status });
    wx.createInterstitialAd({ adUnitId: 'adunit-56316cd90de2e91c' }).show();
  },

  /**
   * 剧照
   * @param {'movie'|'tv'} [type = 'movie']
   */
  async getPhotos (id, type = 'movie') {
    const res = await getPhotos({
      id,
      start: 0,
      count: 12,
      type
    });
    this.setData({
      photos: res.photos
    });
  },

  /**
   * 折叠开关
   */
  foldToggle() {
    const {isFold} = this.data;
    if (!isFold) return;

    this.setData({
      isFold: !isFold
    })
  },

  /**
   * 剧照预览
   */
  onImagePre(e) {
    const { img } = e.currentTarget.dataset;
    const { photos } = this.data;
    const urls = photos.map(item => item.image.large.url)
    wx.previewImage({
      current: img.large.url,
      urls
    })
  },

  handlePreviewImage (e) {
    const { img } = e.currentTarget.dataset;
    if (!img) return;
    wx.previewImage({
      current: img,
      urls: [img]
    });
  },

  /** 复制页面路径 */
  handleCopyPath () {
    const pages = getCurrentPages();
    const { route, options } = pages[pages.length - 1];
    const query = Object.keys(options).map((key) => `${key}=${options[key]}`).join('&');
    wx.setClipboardData({
      data: `${route}?${query}`,
      success: () => {
        wx.showToast({
          icon: 'none',
          title: '复制成功'
        });
      }
    });
  },

  /** 显示影单弹窗 */
  showMovieListPopup() {
    this.getMovielistList();
    this.selectComponent('#movielist').show();
  },

  createList() {
    wx.showModal({
      content: '正在开发中...',
      showCancel: false
    });
  },

  /** 加入影单 */
  addToMovieList() {
    wx.showToast({
      icon: 'none',
      title: '成功加入影单',
    })
    this.selectComponent('#movielist').hide();
  },

  onShareAppMessage() {
    const { details } = this.data
    return {
      title: details.title,
    }
  },

  /** 影单列表 */
  async getMovielistList () {
    // const list = Array(6).fill({}).map((item, index) => ({
    //   id: index,
    //   title: '阳光掉进回忆里',
    //   cover: 'https://img1.doubanio.com/view/photo/m_ratio_poster/public/p1756402567.jpg',
    //   count: 10
    // }));
    // this.setData({
    //   movielistList: list
    // });
  },

  handleOnlineTap () {
    this.selectComponent('#onlineSource').show();
  },

  /** 复制播放地址 */
  handleSourceCopy (e) {
    const {url} = e.currentTarget.dataset;
    wx.setClipboardData({
      data: url,
      success: () => {
        wx.showToast({
          icon: 'none',
          title: '已复制链接'
        });
        wx.showModal({
          content: `播放地址已复制到剪贴板 \n 前往浏览器粘贴访问`,
          showCancel: false
        })
      }
    })
  },

  submitSearchPage () {
    const { details } = this.data;
    const pages = getCurrentPages();
    console.log({
      path: pages[pages.length - 1].route,
      query: `id=${details.id}&title=${details.title}`
    });
    apiSubmitPages({
      pages: [
        {
          path: pages[pages.length - 1].route,
          query: `id=${details.id}&title=${details.title}`
        }
      ]
    });
  }
})
