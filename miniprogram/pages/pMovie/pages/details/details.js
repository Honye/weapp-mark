import { getDetail, getInterests, getPhotos } from '../../../../apis/douban.js';
import { mtime } from '../../../../utils/apis.js'
import Cast from '../../../../models/Cast'
import Comment from '../../../../models/Comment'

const origins = {
  douban: '豆瓣',
  mtime: '时光',
}
Page({

  data: {
    origin: {
      key: 'douban',
      name: '豆瓣',
    },
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
    if (options.origin) {
      newData.origin = {
        key: options.origin,
        name: origins[options.origin],
      }
    }
    this.setData(newData)
    if (options.origin === 'mtime') {
      this.getMtimeDetail(options.id)
      this.getCredits(options.id)
      this.getMtimeComments(options.id)
    } else {
      this.getDetails(options.id);
      this.getComments(options.id);
      this.getPhotos(options.id);
    }
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
   * 影片详情（时光网）
   * @param {Number} movieId
   */
  getMtimeDetail(movieId) {
    mtime.getMovieDetail({
      movieId,
      locationId: 290,
    }).then(res => {
      const { videos, ...details } = res
      this.setData({
        details,
        trailers: videos,
        loaded: true,
      })
    })
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

  /** 影视短评（时光网） */
  getMtimeComments(movieId) {
    mtime.getMovieComments({
      movieId,
    }).then(res => {
      this.setData({
        comments_count: res.totalCommentCount || 0,
        comments: res.cts.slice(0, 6).map(item => Comment.fromMtime(item)),
      })
    })
  },

  /**
   * 演职员（时光网）
   */
  getCredits(movieId) {
    mtime.getMovieCredits({
      movieId,
    }).then(({ types=[] }) => {
      const directorObj = types[0] ? types[0] : []
      const directorList = directorObj.persons.map(item => {
        const cast = Cast.fromMtime(JSON.stringify({
          ...item,
          type: directorObj.typeNameEn,
        }))
        return cast
      })
      const actorObj = types[1] ? types[1] : []
      const actorList = actorObj.persons.slice(0, 20).map(item => {
        const cast = Cast.fromMtime(JSON.stringify({
          ...item,
          type: actorObj.typeNameEn,
        }))
        return cast
      })
      this.setData({
        directorList,
        actorList,
      })
    })
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