import { Douban, mtime } from '../../../../utils/apis.js'
import Cast from '../../../../models/Cast'
import Comment from '../../../../models/Comment'

const origins = {
  douban: '豆瓣',
  mtime: '时光',
}
Page({

  /**
   * 页面的初始数据
   */
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
    loaded: false,
    isFold: true,
    showMovieListPopup: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
    }
  },
  
  /**
   * 获取影视详情（豆瓣）
   */
  getDetails(id) {
    wx.showLoading({
      title: 'loading...',
    });
    Douban.get(`${Douban.DETAILS}/${id}`).then(res => {
      const {
        directors = [],
        casts = [],
        trailers = [],
        ...details,
      } = res
      const _casts = casts.map(item => item.name)
      const directorList = directors.map(item => {
        const cast = Cast.fromDouban(JSON.stringify({
          ...item,
          type: 'Director',
        }))
        return cast
      })
      const actorList = casts.map(item => {
        const cast = Cast.fromDouban(JSON.stringify({
          ...item,
          type: 'Actor',
        }))
        return cast
      })
      const _trailers = trailers.map(item => ({
        image: item.medium,
        url: item.resource_url,
      }))
      this.setData({
        details,
        directorList,
        actorList,
        casts: _casts.join(' / '),
        loaded: true,
        comments_count: details.comments_count,
        trailers: _trailers,
      })
      wx.setNavigationBarTitle({
        title: res.title,
      })
      wx.hideLoading()
    })
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
  getComments(id) {
    Douban.get(
        `${Douban.DETAILS}/${id}/comments`,
        { start: 0, count: 6 }
      ).then(res => {
        this.setData({
          comments: res.comments.map(item => Comment.fromDouban(item)),
        })
      }
    )
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
    const { details } = this.data;
    let urls = [];
    for(let item of details.photos) {
      urls.push(item.image)
    }
    wx.previewImage({
      current: img,
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