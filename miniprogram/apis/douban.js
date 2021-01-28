/**
 * @file 豆瓣 API
 */

const BASE_URL = 'https://frodo.douban.com/api/v2'; // 来自豆瓣小程序

/**
 * 
 * @param {WechatMiniprogram.RequestOption} params 
 */
const request = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${params.url}`,
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
 */
export const getDetail = (params) => {
  return request({
    url: `/movie/${params.id}`
  });
};

/**
 * 短评列表
 * @param {object} params
 * @param {string} params.id
 * @param {number} params.start
 * @param {number} params.count
 * @param {'done'} [params.status]
 */
export const getInterests = (params) => {
  const { id, ...data } = params;
  return request({
    url: `/movie/${id}/interests`,
    data
  });
};

/**
 * 剧照
 * @param {object} params
 * @param {string} params.id
 * @param {number} params.start
 * @param {number} params.count
 */
export const getPhotos = (params) => {
  const { id, ...data } = params;
  return request({
    url: `/movie/${id}/photos`,
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