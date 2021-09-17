// @ts-check
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import {
  getDetail,
  getInterests,
  getPhotos,
  markMovie,
  unmarkMovie,
  doingMovie
} from '../../../../apis/douban.js';
import Cast from '../../../../models/Cast'
import Comment from '../../../../models/Comment'
import wxCloud from '../../../../utils/wxCloud';

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    id: '',
    details: /** @type {import('../../../../apis/douban.js').DouBan.MovieDetail} */ ({}),
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
    this.submitSearchPage();
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
    if (!store.douban.accessToken) {
      // case 未登录豆瓣
      wx.navigateTo({
        url: '/pages/douban/pages/login/login'
      });
      return;
    }

    /** @type {{ action: import('../../../../apis/douban.js').DouBan.InterestStatus }} */
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
    this.getMovielistList();
    this.selectComponent('#movielist').show();
  },

  /** 加入影单 */
  addToMovieList(e) {
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
    const list = Array(6).fill({}).map((item, index) => ({
      id: index,
      title: '阳光掉进回忆里',
      cover: 'https://img1.doubanio.com/view/photo/m_ratio_poster/public/p1756402567.jpg',
      count: 10
    }));
    this.setData({
      movielistList: list
    });
  },

  handleOnlineTap (e) {
    this.selectComponent('#onlineSource').show();
  },

  /** 复制播放地址 */
  handleSourceCopy (e) {
    const {url} = e.currentTarget.dataset;
    wx.setClipboardData({
      data: url,
      success: res => {
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
    wxCloud('site', {
      action: 'submitPages',
      payload: {
        pages: [
          {
            path: pages[pages.length - 1].route,
            query: `id=${details.id}&title=${details.title}`
          }
        ]
      }
    });
  }
})
