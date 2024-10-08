/**
 * @file 豆瓣 API
 */
import { request as baseRequest } from '../utils/request';
import { store } from '../store/index';

/**
 * @type {{ params: RequestOption<any>, resolve: (data: any) => void, reject: (err: any) => void }[]}
 */
const queue = [];

export let isLoginIng = false;
/**
 * @param {boolean} value
 */
export const setLoginIng = (value) => {
  isLoginIng = value;
};

const BASE_URL = 'https://mmovie.imarkr.com/douban/api';

/**
 * @template T
 * @param {RequestOption<T>} params
 * @returns {Promise<T>}
 */
const request = (params) => {
  const accessToken = store.douban.accessToken;
  const { header, notAuthorization, ...rest } = {
    baseURL: BASE_URL,
    ...params,
  };

  return new Promise((resolve, reject) => {
    baseRequest({
      header: {
        ...(!notAuthorization && accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...header,
      },
      ...rest,
    })
      .then((resp) => {
        if (resp.ok) {
          resolve(resp.data);
        } else if (resp.statusCode === 400 && [103, 106].includes(resp.data.code)) {
          queue.push({ params, resolve, reject });
          if (!isLoginIng) {
            isLoginIng = true;
            wx.navigateTo({
              url: '/packages/douban/pages/login-phone/login-phone'
            });
          }
        } else {
          reject(resp.data);
        }
      });
  });
};

/** 登录成功后重放登录失效接口 */
export const replayRequest = () => {
  while (queue.length) {
    const { params, resolve, reject } = queue.shift();
    request(params).then(resolve, reject);
  }
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
    data: params,
    notAuthorization: true
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
