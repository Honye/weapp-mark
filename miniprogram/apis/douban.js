/**
 * @file 豆瓣 API
 */
import wxCloud from '../utils/wxCloud';
import { store } from '../store/index';

const BASE_URL = 'https://frodo.douban.com/api/v2'; // 来自豆瓣小程序

/**
 * 
 * @param {WechatMiniprogram.RequestOption & { baseURL?: string }} params 
 */
const request = (params) => {
  const accessToken = store.douban.accessToken;

  return new Promise((resolve, reject) => {
    const { baseURL = BASE_URL } = params;
    wx.request({
      url: `${baseURL}${params.url}`,
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
 * 影人列表
 * @param {string} params.id
 * @param {'movie'|'tv'} [params.type]
 */
export const getCelebrities = (params) => {
  const { id, type = 'movie' } = params;
  return request({
    url: `/${type}/${id}/celebrities`
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
 * 豆瓣热门
 * @param {object} params
 * @param {number} [params.start]
 * @param {number} [params.count]
 */
export const getHotMovies = (params) => {
  return request({
    url: '/subject_collection/movie_hot_gaia/items',
    data: params
  });
}

/**
 * 榜单合集
 * @param {object} params 
 * @param {string} params.type
 * @param {number} [params.start]
 * @param {number} [params.count]
 * @returns 
 */
export const getCollectionList = (params) => {
  const { type, ...data } = params;
  return request({
    url: `/subject_collection/${type}/items`,
    data
  });
}

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
    url: `/${type}/${movieID}/doing`,
    data
  });
}
