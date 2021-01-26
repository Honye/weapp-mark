/**
 * [GitHub REST API](https://docs.github.com/en/rest) 封装
 * 
 * 使用原生 fetch api
 * 
 */
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const fetch = require('node-fetch');
const qs = require('querystring');
const db = cloud.database();
const baseURL = 'https://api.github.com';

/**
 * 
 * @param {object} params
 * @param {string} [params.url]
 * @param {string} params.path
 * @param {'GET'|'POST'} [params.method]
 * @param {Record<string, any>} params.data
 */
const request = async (params = {}) => {
  let token;
  try {
    token = await getToken();
  } catch (e) {
    console.warn(e);
  }

  params.url = params.url || `${baseURL}${params.path}`;
  delete params.path;
  if ((params.method || 'GET') === 'GET') {
    params.url += '?' + qs.stringify(params.data);
    delete params.data;
  }
  return fetch(params.url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
    },
    method: params.method || 'GET',
    body: params.data
  });
};

/**
 * 
 * @returns {Promise<void|string>}
 */
const getToken = async () => {
  const users = db.collection('users');
  const context =  cloud.getWXContext();
  const openId = context.OPENID;
  const { data: [user] } = await users.where({
    openid: openId
  })
    .limit(1)
    .get();
  if (!user) {
    return;
  }
  return user.githubToken;
};

module.exports = {
  request
};