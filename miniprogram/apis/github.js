/**
 * [GitHub API v3](https://docs.github.com/en/rest)
 */
import { store } from '../store/index';

/**
 * 
 * @param {WechatMiniprogram.RequestOption} options 
 * @returns {Promise<WechatMiniprogram.RequestSuccessCallbackResult['data']>} result
 */
const request = (options) => {
  const { header, method, url, ...restOpt } = options;
  const token = store.user.info?.githubToken;
  return new Promise((resolve, reject) => {
    wx.request({
      header: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${token}`,
        ...header
      },
      method: method || 'GET',
      url: `https://api.github.com${url}`,
      success: ({ statusCode, data }) => {
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data);
        } else {
          reject({
            ...data,
            message: data.message || '服务器开小差了'
          });
        }
      },
      fail: (err) => {
        reject(err);
      },
      ...restOpt
    })
  });
};

/**
 * [Get a repository](https://docs.github.com/en/rest/reference/repos#get-a-repository)
 * 
 * @param {Object} params
 * @param {string} params.owner
 * @param {string} params.repo
 */
export const getRepoInfo = (params) => {
  return request({
    method: 'GET',
    url: `/repos/${params.owner}/${params.repo}`
  });
};

/**
 * [Get repository README](https://docs.github.com/en/rest/reference/repos#get-a-repository-readme)
 * 
 * @param {object} params 
 * @param {'raw'|'html'} [params.media] [Custom media types for repository contents](https://docs.github.com/en/rest/reference/repos#custom-media-types-for-repository-contents)
 * @param {string} params.owner
 * @param {string} params.repo
 * @param {string} [params.ref]
 */
export const getRepoReadme = (params) => {
  const { owner, repo, ...query } = params;
  return request({
    header: {
      Accept: params.media ? `application/vnd.github.v3.${params.media}` : `application/vnd.github.v3+json`
    },
    method: 'GET',
    url: `/repos/${owner}/${repo}/readme`,
    data: query
  });
};

/**
 * 
 * @param {object} params 
 * @param {string} params.username
 * @param {number} params.per_page
 * @param {number} params.page 
 */
export const getEvents = (params) => {
  const { username, ...reset } = params;
  return request({
    method: 'GET',
    url: `/users/${username}/received_events`,
    data: reset
  });
};

/**
 * [List notifications for the authenticated user](https://docs.github.com/en/rest/reference/activity#list-notifications-for-the-authenticated-user)
 * 
 * @param {object} params 
 * @param {boolean} [params.all]
 * @param {boolean} [params.participating]
 * @param {string} [params.since] a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
 * @param {string} [params.before]
 * @param {number} [params.per_page]
 * @param {number} [params.page]
 */
export const getNotifications = (params) => {
  return request({
    method: 'GET',
    url: '/notifications',
    data: params
  });
};

/**
 * https://docs.github.com/en/rest/reference/search#constructing-a-search-query
 * 
 * @typedef {object} Query
 * @property {string} q
 * @property {string} sort
 * @property {number} per_page
 * @property {number} page
 */

/**
 * [Search repositories](https://docs.github.com/en/rest/reference/search#search-repositories)
 * 
 * @param {Query} params 
 */
export const searchRepositories = (params) => {
  return request({
    header: {
      Accept: 'application/vnd.github.v3.text-match+json'
    },
    method: 'GET',
    url: '/search/repositories',
    data: params
  });
};

/**
 * [Search users](https://docs.github.com/en/rest/reference/search#search-users)
 * 
 * @param {Query} params 
 */
export const searchUser = (params) => {
  return request({
    header: {
      Accept: 'application/vnd.github.v3.text-match+json'
    },
    method: 'GET',
    url: '/search/users',
    data: params
  });
};

/**
 * 获取用户 Star repositories
 * 
 * [List repositories starred by the authenticated user](https://docs.github.com/en/rest/reference/activity#list-repositories-starred-by-the-authenticated-user)
 * 
 * @param {object} params
 * @param {'created'|'updated'} params.sort
 * @param {'asc'|'desc'} params.direction
 * @param {number} params.per_page max 100
 * @param {number} params.page
 */
export const getStarredList = (params) => {
  return request({
    url: '/user/starred',
    method: 'GET',
    data: params
  });
};

