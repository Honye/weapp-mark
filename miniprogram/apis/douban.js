/**
 * @file 豆瓣 API
 */
import { request as baseRequest } from '../utils/request';
import wxCloud from '../utils/wxCloud';
import { store } from '../store/index';

const BASE_URL = 'https://d.imarkr.com/douban';

/**
 * @template T
 * @param {RequestOption<T>} params
 * @returns {Promise<T>}
 */
const request = (params) => {
  const accessToken = store.douban.accessToken;
  const { header, data, ...rest } = {
    baseURL: BASE_URL,
    ...params,
  };

  return baseRequest({
    header: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...header,
    },
    data: {
      apikey: '054022eaeae0b00e0fc068c0c0a2102a',
      ...data,
    },
    ...rest,
  })
    .then((resp) => {
      if (resp.ok) {
        return resp.data;
      } else {
        return Promise.reject(resp.data);
      }
    });
};

/**
 * 使用云函数代理请求
 * @param {WechatMiniprogram.RequestOption & { baseURL?: string }} params
 */
const request1 = (params) => {
  const accessToken = store.douban.accessToken;
  const { baseURL = BASE_URL } = params;
  return wxCloud('douban', {
    action: 'api.proxy',
    payload: {
      url: `${baseURL}${params.url}`,
      header: Object.assign(
        {},
        accessToken && { Authorization: `Bearer ${accessToken}` },
        params.header
      ),
      data: {
        apikey: '054022eaeae0b00e0fc068c0c0a2102a',
        ...(params.data || {})
      }
    }
  });
};

/**
 * 搜索
 * @param {object} params
 * @param {string} params.q 关键字
 * @param {number} params.start 起始位置
 * @param {number} params.count 查询数量
 * @returns {Promise<DouBan.SearchResult>}
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
 * @returns {Promise<DouBan.MovieDetail>}
 */
export const getDetail = (params) => {
  const { id, type = 'movie' } = params;
  return request({
    url: `/${type}/${id}`
  });
};

/**
 * 影人列表
 * @param {object} params
 * @param {string} params.id
 * @param {'movie'|'tv'} [params.type]
 * @returns {Promise<{
 *   actors: DouBan.Actor[];
 *   directors: DouBan.Actor[];
 *   total: number;
 * }>}
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
 * @returns {Promise<DouBan.InterestResult>}
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
 * @returns {Promise<DouBan.PhotosResult>}
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
 * @returns {Promise<DouBan.TrailersResult>}
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
 * @returns {Promise<{
 *   count: number;
 *   subject_collection_items: DouBan.MovieItem[];
 *   total: number;
 *   start: number;
 * }>}
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
 * @returns {Promise<Douban.SubjectCollectionItemsResult>}
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
 * @returns {Promise<Douban.SubjectCollectionShowingItemsResult>}
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
 * @returns {Promise<Douban.SubjectCollectionSoonItemsResult>}
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
 * @returns {Promise<Douban.UserInterestsResult>}
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
 * @param {DouBan.SubjectType} [params.type = 'movie']
 * @param {number} [params.rating]
 * @param {0|1} [params.sync_douban]
 * @returns {Promise<DouBan.Interest>}
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
 * @param {DouBan.SubjectType} [params.type = 'movie']
 * @returns {Promise<{
 *   comment: string;
 *   status: DouBan.InterestStatus;
 *   id: string;
 * }>}
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
 * @returns {Promise<DouBan.Interest>}
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
 * @param {DouBan.SubjectType} [params.type = 'movie']
 * @param {number} [params.rating]
 * @param {string} [params.comment]
 * @param {0|1} [params.sync_douban]
 * @returns {Promise<DouBan.Interest>}
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
