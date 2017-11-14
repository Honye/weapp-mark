//app.js
import config from './config';

const version = {
  versionCode: 5,
  versionName: '1.0.4'
};

App({

  onLaunch: function () {
    var that = this;
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var setting = wx.getStorage({
      key: 'setting',
      success: function (res) {
        that.globalData.setting = res.data;
      },
    })

    this.getDefaultConfig();
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  globalData: {
    version,
    userInfo: null,
    setting: {},
    config: {
      hasPermission: true
    }
  },

  showCommonModal: function (msg) {
    wx: wx.showModal({
      title: '提示',
      content: msg || '抱歉，还在开发中...',
      showCancel: false
    })
  },

  /**
   * 从服务器获取默认配置
   */
  getDefaultConfig() {
    const that = this;
    wx.request({
      url: config.configUrl,
      success: res => {
        that.globalData.config = res.data;
      }
    })
  }

})