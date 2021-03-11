/**
 * @file 豆瓣 API
 */
import storage from '../utils/storage';

const BASE_URL = 'https://frodo.douban.com/api/v2'; // 来自豆瓣小程序
/** 豆瓣小程序 AppID */
const AppID = 'wx2f9b06c1de1ccfca';

/**
 * 
 * @param {WechatMiniprogram.RequestOption} params 
 */
const request = (params) => {
  const accessToken = storage.get('douban.token');

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${params.url}`,
      header: Object.assign(
        {},
        accessToken && { Authorization: `Bearer ${accessToken}` },
        params.header
      ),
      data: {
        apikey: '054022eaeae0b00e0fc068c0c0a2102a',
        ...(params.data || {})
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
      fail: err => reject(err)
    })
  });
};

/**
 * 搜索
 * @param {object} params
 * @param {string} params.q
 * @param {number} params.start
 * @param {number} params.count
 */
export const search = (params) => {
  return request({
    url: '/search/weixin',
    data: params
  });
};

/**
 *  影视详情
 * @param {object} params
 * @param {string} params.id
 * @param {'movie'|'tv'} [params.type]
 */
export const getDetail = (params) => {
  const { id, type = 'movie' } = params;
  return request({
    url: `/${type}/${id}`
  });
};

/**
 * 短评列表
 * @param {object} params
 * @param {string} params.id
 * @param {number} params.start
 * @param {number} params.count
 * @param {'done'} [params.status]
 * @param {'movie'|'tv'} [params.type = 'movie']
 */
export const getInterests = (params) => {
  const { id, type = 'movie', ...data } = params;
  return request({
    url: `/${type}/${id}/interests`,
    data
  });
};

/**
 * 剧照
 * @param {object} params
 * @param {string} params.id
 * @param {number} params.start
 * @param {number} params.count
 * @param {'movie'|'tv'} [params.type = 'movie']
 */
export const getPhotos = (params) => {
  const { id, type = 'movie', ...data } = params;
  return request({
    url: `/${type}/${id}/photos`,
    data
  });
};

/**
 * 预告片列表
 * @param {object} params
 * @param {string} params.id
 */
export const getTrailers = (params) => {
  return request({
    url: `/movie/${params.id}/trailers`
  });
};

/**
 * 影院热映
 * @param {object} params 
 * @param {number} [params.start]
 * @param {number} [params.count]
 */
export const getShowingMovies = (params) => {
  return request({
    url: '/subject_collection/movie_showing/items',
    data: params
  });
}

/**
 * 即将上映
 * @param {object} params
 * @param {number} [params.start]
 * @param {number} [params.count]
 */
export const getSoonMovies = (params) => {
  return request({
    url: '/subject_collection/movie_soon/items',
    data: params
  });
}

/**
 * 获取用户的书影音
 * @param {string} userID
 * @param {object} params
 * @param {'movie'} params.type
 * @param {'doing'} params.status
 * @param {number} [params.start]
 * @param {number} [params.count]
 * @returns 
 */
export const getUserInterests = (userID, params) => {
  return request({
    url: `/user/${userID}/interests`,
    data: params
  });
}

/**
 * 登录
 * @param {object} params
 * @param {string} params.name 用户名
 * @param {string} params.password 密码
 * @param {string} [params.appid]
 * @param {string} [params.phone]
 * @param {string} [params.captcha_id]
 * @param {string} [params.captcha_solution]
 * @param {string} [params.ticket]
 * @param {string} [params.randstr]
 * @returns 
 */
export const login = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://accounts.douban.com/j/wxa/login/basic',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'POST',
      data: {
        appid: AppID,
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
      fail: err => reject(err)
    });
  });
}

/**
 * 标记影视为想看
 * @param {object} params
 * @param {string} params.movieID
 * @param {'movie'|'tv'} [params.type = 'movie']
 * @param {number} [params.rating]
 * @param {0|1} [params.sync_douban]
 */
export const markMovie = (params) => {
  const { movieID, type = 'movie', ...rest } = params;
  const data = Object.assign({}, { raing: 0, sync_douban: 0 }, rest);
  return request({
    url: `/${type}/${movieID}/mark`,
    data
  });
}

/**
 * 删除影视标记
 * @param {object} params
 * @param {string} params.movieID
 * @param {'movie'|'tv'} [params.type = 'movie']
 */
export const unmarkMovie = (params) => {
  return request({
    url: `/${params.type || 'movie'}/${params.movieID}/unmark`,
  });
}

/**
 * 标记影视为已看
 * @param {object} params
 * @param {string} params.movieID
 * @param {'movie'|'tv'} [params.type = 'movie']
 * @param {number} [params.rating]
 * @param {string} [params.comment]
 * @param {0|1} [params.sync_douban]
 */
export const doneMovie = (params) => {
  const { movieID, type = 'movie', ...rest } = params;
  const data = Object.assign({},
    {
      rating: 0,
      sync_douban: 0
    },
    rest
  );
  return request({
    url: `/${type}/${movieID}/done`,
    data
  });
}

/**
 * 标记影视为已看
 * @param {object} params
 * @param {string} params.movieID
 * @param {'movie'|'tv'} [params.type = 'movie']
 * @param {number} [params.rating]
 * @param {string} [params.comment]
 * @param {0|1} [params.sync_douban]
 */
 export const doingMovie = (params) => {
  const { movieID, type = 'movie', ...rest } = params;
  const data = Object.assign({},
    {
      rating: 0,
      sync_douban: 0
    },
    rest
  );
  return request({
    url: `${type}/${movieID}/doing`,
    data
  });
}
