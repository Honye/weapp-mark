import { request } from '../utils/request'
import { decrypt } from '../utils/crypro';

/**
 * @param {RequestOption} config
 */
const fetch = async (config) => {
  config.baseURL = 'https://mmovie.imarkr.com'
  const resp = await request(config)
  if (resp.ok) {
    return resp.data
  }
  return Promise.reject(resp.data)
}

export const apiAppInfo = async () => {
  const { data } = await fetch({ url: '/wx/app' });
  return JSON.parse(decrypt(data));
};

/**
 * 验证登录验证码（登录）
 * @param {object} data
 * @param {string} data.number 手机号
 * @param {string} data.code 验证码
 * @param {string} data.openid
 * @param {string} data.unionid
 * @param {string} [data.captcha_id]
 * @param {string} [data.captcha_solution]
 */
export const apiVerifyCaptcha = (data) => {
  return fetch({
    url: '/douban/verify_phone_code',
    method: 'POST',
    data
  });
};

export const apiSyncDouban = (data) => {
  return fetch({
    url: '/douban/sync',
    method: 'POST',
    data
  });
};

/**
 * @param {object} data
 * @param {string} data.code
 */
export const apiWxLogin = (data) => {
  return fetch({ url: '/wx/login', data })
};

export const apiGetBanners = () => {
  return fetch({ url: '/banners' })
}

export const apiGetCards = () => {
  return fetch({ url: '/m/cards', method: 'POST' });
};

export const apiSubmitPages = (data) => {
  return fetch({
    url: '/wx/submitpages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
