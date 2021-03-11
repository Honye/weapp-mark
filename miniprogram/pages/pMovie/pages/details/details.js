import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import {
  getDetail,
  getInterests,
  getPhotos,
  markMovie,
  unmarkMovie,
  doneMovie,
  doingMovie
} from '../../../../apis/douban.js';
import Cast from '../../../../models/Cast'
import Comment from '../../../../models/Comment'

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    /** @type {import('../../../../apis/douban.js').DouBan.MovieDetail} */
    details: {},
    directorList: [],
    actorList: [],
    trailers: [],  // 预告片 { url: string, image: string }
    pubdates: '',
    comments_count: 0,
    comments: [],
    /** @type {import('../../../../apis/douban.js').DouBan.Photo[]} */
    photos: [],
    loaded: false,
    isFold: true,
    showMovieListPopup: false
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
    const directors = res.directors.map(item => Cast.fromDouban(JSON.stringify({ ...item, type: 'Director' })));
    const actors = res.actors.map(item => Cast.fromDouban(JSON.stringify({ ...item, type: 'Actor' })));
    const trailers = res.trailer && [{
      image: res.trailer.cover_url,
      url: res.trailer.video_url
    }];
    wx.hideLoading();
    wx.setNavigationBarTitle({
      title: res.title
    });
    this.setData({
      details: res,
      directorList: directors,
      actorList: actors,
      casts: casts.join('/'),
      loaded: true,
      comments_count: res.comment_count,
      trailers
    });
  },

  /**
   * 获取影视短评
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
    /** @type {{ action: import('../../../../apis/douban.js').DouBan.InterestStatus }} */
    const { action } = e.currentTarget.dataset;
    const { id, details } = this.data;
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
            wx.showLoading();
            const res = await unmarkMovie({ movieID: id, type: details.type });
            wx.hideLoading();
            this.setData({
              'details.interest.status': res.status
            });
          }
        }
      });
      return;
    }

    wx.showLoading();
    let res;
    switch (action) {
      case 'mark': {
        res = await markMovie({ movieID: id, type: details.type });
        break;
      }
      case 'done': {
        res = await doneMovie({ movieID: id, type: details.type });
        break;
      }
      case 'doing': {
        res = await doingMovie({ movieID: id, type: details.type });
        break;
      }
      default:
    }
    wx.hideLoading();
    this.setData({
      'details.interest.status': res.status
    });
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
    this.setData({
      popupMovieListVisible: true,
    })
  },

  hideMovieListPopup() {
    this.setData({
      popupMovieListVisible: false,
    })
  },

  /** 加入影单 */
  addToMovieList(e) {
    wx.showToast({
      icon: 'none',
      title: '成功加入影单',
    })
    this.setData({
      popupMovieListVisible: false,
    })
  },

  onShareAppMessage() {
    const { details } = this.data
    return {
      title: details.title || details.titleCn,
    }
  },
})