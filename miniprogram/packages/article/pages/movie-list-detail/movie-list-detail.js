import { Douban } from '../../../../utils/apis'

Page({
  data: {
    info: {},
    movieList: [],
  },
  onLoad() {
    this.getMovielistInfo()
    this.getMovieList()
  },
  /** 获取影单信息 */
  getMovielistInfo() {
    const info = {
      title: '一眼一万年',
      cover: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2570039912.jpg',
      author: '猫猫不爱鱼',
      updateAt: '2019.04.30',
      intro: '一眼一瞬间，一眼一万年，我的青春有你的陪伴，足矣。一眼一瞬间，一眼一万年，我的青春有你的陪伴，足矣。',
      isLiked: false,
    }
    this.setData({ info })
    wx.setNavigationBarTitle({
      title: info.title,
    })
  },
  /** 获取影单影视列表 */
  getMovieList() {
    Douban.get(
      Douban.IN_THEATERS,
      {
        start: 0,
        count: 10,
      },
    )
      .then(res => {
        wx.stopPullDownRefresh()
        let subjects = res.subjects
        for (let item of subjects) {
          item.genres = item.genres.join('/')
        }
        this.setData({
          movieList: subjects,
        })
      })
  },
  /** 去影视详情 */
  toMovieDetail(e) {
    const { id, title } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/packages/movie/pages/details/details?id=${id}&title=${title}`
    })
  },
  /** 喜欢/取消喜欢 */
  handleLikeTap(e) {
    const { isLiked } = this.data.info
    this.setData({
      'info.isLiked': !isLiked,
    })
  },
  onShareAppMessage() {
    const { info } = this.data
    return {
      title: info.intro,
    }
  },
})