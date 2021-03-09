// 本地数据存储
'use strict';

const { miniProgram } = wx.getAccountInfoSync();

/**
 * @type {Record<WechatMiniprogram.MiniProgram['envVersion'], string>}
 */
const prefixes = {
  develop: 'dev:',
  trial: 't:',
  release: ''
};
const prefix = prefixes[miniProgram.envVersion];

/**
 * 
 * @param {string} key
 * @param {*} data
 */
export const set = (key, data) => {
  wx.setStorageSync(`${prefix}${key}`, data);
}

/**
 * 
 * @param {string} key 
 * @returns 
 */
export const get = (key) => {
  return wx.getStorageSync(`${prefix}${key}`);
}

/**
 * 清空存储
 */
export function clear(callback) {
  wx.clearStorageSync()
  typeof callback == "function" && callback()
}

export function getSetting(callback) {
  wx.getStorage({
    key: 'setting',
    success: function(res) {
      typeof callback == "function" && callback(res)
    },
  })
}

export default {
  set,
  get,
  clear,
  getSetting
}
