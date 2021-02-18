const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const fetch = require('node-fetch');
const qs = require('querystring');
const API_BASE = 'https://frodo.douban.com/api/v2';
const API_KEY = '054022eaeae0b00e0fc068c0c0a2102a';

/**
 * 
 * @param {object} params
 * @param {object} [params.headers]
 * @param {string} [params.url]
 * @param {string} [params.path]
 * @param {'GET'} [params.method]
 * @param {object} [params.data]
 */
const request = async (params = {}) => {
  params.url = params.url || `${API_BASE}${params.path}`;
  delete params.path;
  params.data = {
    apikey: API_KEY,
    ...(params.data || {})
  };
  if ((params.method || 'GET') === 'GET' && params.data) {
    params.url += '?' + qs.stringify(params.data);
    delete params.data;
  }
  return fetch(
    params.url,
    {
      headers: params.headers,
      method: params.method || 'GET',
      body: params.data
    }
  )
    .then((resp) => resp.json());
}

module.exports = {
  request
}
