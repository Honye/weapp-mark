import { getDetail, getInterests, getPhotos } from '../../../../apis/douban.js';
import Cast from '../../../../models/Cast'
import Comment from '../../../../models/Comment'

Page({

  data: {
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
    showMovieListPopup: false,
  },

  onLoad(options) {
    if (options.title) {
      const title = decodeURIComponent(options.title)
      wx.setNavigationBarTitle({ title })
    }
    const newData = {
      id: options.id,
    }
    this.setData(newData)

    this.getDetails(options.id);
    this.getComments(options.id);
    this.getPhotos(options.id);
  },
  
  /**
   * 获取影视详情（豆瓣）
   */
  async getDetails (id) {
    wx.showLoading({
      title: 'loading...',
    });

    const res = await getDetail({ id });
    const casts = res.actors.map(item => item.name);
    const directors = res.directors.map(item => Cast.fromDouban(JSON.stringify({ ...item, type: 'Director' })));
    const actors = res.actors.map(item => Cast.fromDouban(JSON.stringify({ ...item, type: 'Actor' })));
    const trailers = [{
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
   */
  async getComments (id) {
    const res = await getInterests({
      id,
      start: 0,
      count: 10
    });
    const comments = res.interests.map(item => Comment.fromDouban(item));
    this.setData({
      comments
    });
  },

  /** 剧照 */
  async getPhotos (id) {
    const res = await getPhotos({
      id,
      start: 0,
      count: 12
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