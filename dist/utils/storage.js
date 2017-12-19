// 本地数据存储
'use strict';

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
  clear,
  getSetting
}