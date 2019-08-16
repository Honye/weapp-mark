// pages/movies/movieDetails.js
import { Douban, mtime } from '../../../../utils/apis.js';
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
    pubdates: '',
    comments_count: 0,
    comments: [],
    loaded: false,
    isFold: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          bgImgHeight: res.windowWidth/2
        })
      },
    })
    const title = decodeURIComponent(options.title)
    wx.setNavigationBarTitle({
      title: title || '详情',
    })
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
      const data = res;
      let pubdates = '';
      for (let item of res.pubdates) {
        if (item.indexOf("中国") > 0) {
          pubdates = item + "上映";
        }
      }
      let casts = [];
      for (let item of data.casts) {
        casts.push(item.name);
      }
      wx.hideLoading();
      let directorList = res.directors || []
      directorList = directorList.map(item => {
        const cast = Cast.fromDouban(JSON.stringify({
          ...item,
          type: 'Director',
        }))
        return cast
      })
      let actorList = res.casts || []
      actorList = actorList.map(item => {
        const cast = Cast.fromDouban(JSON.stringify({
          ...item,
          type: 'Actor',
        }))
        return cast
      })

      this.setData({
        details: res,
        pubdates,
        casts: casts.join(' / '),
        loaded: true,
        comments_count: data.comments_count,
        directorList,
        actorList,
      });
      wx.setNavigationBarTitle({
        title: res.title,
      })
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
      this.setData({
        details: res,
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

  onShareAppMessage() {
    const { details } = this.data
    return {
      title: details.title || details.titleCn,
    }
  },
})