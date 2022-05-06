import { request as baseRequest } from '../../utils/request';
import wxCloud from '../../utils/wxCloud';

/** 豆瓣小程序 AppID */
const AppID = 'wx2f9b06c1de1ccfca';

/**
 * @template T
 * @param {RequestOption<Douban.APIResponseLegacy<T>>} config 
 */
const request = async (config) => {
  const { header, ...rest } = config;
  const _config = {
    baseURL: 'https://accounts.douban.com/j/wxa',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      ...header,
    },
    ...rest,
  };

  /** @type {RequestSuccessResult<Douban.APIResponseLegacy<T>>} */
  const resp = await baseRequest(_config);
  if (resp.ok && resp.data.status === 'success') {
    return resp.data;
  }

  return Promise.reject(resp.data);
};

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
export const login = async (params) => {
  /** @type {Douban.APIResponseLegacy<Douban.LoginSuccessResult>} */
  const res = await request({
    url: '/login/basic',
    method: 'POST',
    data: { appid: AppID, ...params },
  });
  wxCloud('douban', {
    action: 'login',
    payload: {
      access_token: res.payload.access_token,
      refresh_token: res.payload.refresh_token,
      expires_in: res.payload.expires_in,
      ...res.payload.account_info,
    }
  });

  return res;
}

/**
 * 获取手机验证码
 * @param {object} params
 * @param {string} [params.area_code] 区域号，如："+86"
 * @param {number} params.number 手机号
 */
export const getCaptcha = async (params) => {
  params = {
    appid: AppID,
    area_code: '+86',
    ...params,
  }
  const res = await request({
    url: '/login/request_phone_code',
    method: 'POST',
    data: params,
  });

  return res;
}


/**
 * 验证验证码
 * @param {object} params
 * @param {string} params.number
 * @param {string} params.code
 * @returns
 */
 export const verifyCaptcha = async (params) => {
  params = {
    area_code: '+86',
    appid: AppID,
    ...params,
  };
  /** @type {Douban.APIResponseLegacy<Douban.LoginSuccessResult>} */
  const res = await request({
    url: '/login/verify_phone_code',
    method: 'POST',
    data: params,
  });

  return res.payload;
};
