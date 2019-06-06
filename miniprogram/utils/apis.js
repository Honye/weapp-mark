// API 

const HY_HOST = 'https://hongye567.github.io';
const DB_HOST = 'https://api.douban.com';

export const Honye = {
  // 域名
  HOST: HY_HOST,
  // 默认配置
  CONFIG: `${HY_HOST}/static/json/config`,
  // 首页轮播图
  BANNERS: `${HY_HOST}/static/json/banner`,
  // 首页文章
  ARTICLES: `${HY_HOST}/static/json/articles`,
  // 文章详情
  ARTICLE_DETAIL: `${HY_HOST}/static/json/article/detail`,
  // 分类类别
  CLASSIFY: `${HY_HOST}/static/json/classify`,
  // 每日卡片
  CARDS: `${HY_HOST}/static/json/cards`,
  // 关于
  ABOUT: `${HY_HOST}/static/json/about`,
}

export const Douban = {
  // 域名
  HOST: DB_HOST,
  // 豆瓣热映
  IN_THEATERS: `${DB_HOST}/v2/movie/in_theaters`,
  // 即将上映
  COMMING: `${DB_HOST}/v2/movie/coming_soon`,
  // 影视条目信息
  DETAILS: `${DB_HOST}/v2/movie/subject`,
  // 影视搜索
  SEARCH: `${DB_HOST}/v2/movie/search`,
}

Honye.get = (path, params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: path,
      success: ({ statusCode, data }) => {
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data)
        } else {
          reject({
            ...data,
            message: data.message || data.msg || '服务器开小差了',
          })
        }
      },
      fail: err => {
        reject(err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  })
}

Douban.get = (path, params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: path,
      header: {
        "Content-Type": "json"
      },
      data: {
        apikey: '0b2bdeda43b5688921839c8ecb20399b',
        ...params
      },
      success: ({ statusCode, data }) => {
        if (statusCode >= 200 && statusCode < 300 ) {
          resolve(data)
        } else {
          reject({
            ...data,
            message: data.message || data.msg || '服务器开小差了',
          })
        }
      },
      fail: err => {
        reject(err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  })
}

const request = (method, url, params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      header: {
        'Content-Type': 'json',
      },
      data: params,
      success: ({ statusCode, data }) => {
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data)
        } else {
          reject({
            ...data,
            message: data.message || data.msg || '服务器开小差了',
          })
        }
      },
      fail: (err) => {
        reject(err)
      },
      complete(res) {
        wx.hideLoading()
      }
    })
  })
}

const MTIME_HOST = 'https://api-m.mtime.cn'

const mRequest = (method, path, params) => {
  return request(method, `${MTIME_HOST}${path}`, params)
}

/** 时光网 */
export const mtime = {
  // 域名
  HOST: MTIME_HOST,
  /**
   * 城市列表
   */
  getCities() {
    return mRequest('get', '/Showtime/HotCitiesByCinema.api')
  },
  /**
   * 正在热映
   * @param {Number} cityId 城市ID
   */
  getLocationMovies(cityId = 290) {
    return mRequest('get', '/Showtime/LocationMovies.api', {
      locationId: cityId,
    })
  },
  /**
   * 即将上映
   * @param {Number} cityId 城市ID
   */
  getComingMovies(cityId = 290) {
    return mRequest('get', '/Movie/MovieComingNew.api', {
      locationId: cityId,
    })
  },
  /**
   * 搜索，每页 20 条
   * @param {Object} params
   * @param {String} params.keyword 关键词
   * @param {Number} params.pageIndex 页码
   * @param {Number} params.type
   * @param {Number} params.locationId 城市ID
   */
  searchMovie(params = {}, keywords, pageIndex = 1, type = 3, cityId = 290) {
    let defaultParams = {
      type: 3,
      locationId: 290,
      pageIndex: 1,
    }
    return mRequest('get', '/Showtime/SearchVoice.api', {
      ...defaultParams,
      ...params,
    })
  },
  /**
   * 影片详情
   * @param {Number} params.movieId 影片ID
   * @param {Number} params.locationId 城市ID
   */
  getMovieDetail(params) {
    return mRequest('get', '/movie/detail.api', params)
  },
}

export default {
  Honye,
  Douban,
  mtime,
}