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
      success: res => {
        resolve(res.data)
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
      success: res => {
        resolve(res.data)
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

export default {
  Honye,
  Douban
}