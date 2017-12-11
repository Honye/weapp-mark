//app.js
import { Honye } from './utils/apis.js';

const version = {
  versionCode: 5,
  versionName: '1.0.4'
};

App({

  onLaunch: function () {
    var that = this;

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

  /**
   * 从服务器获取默认配置
   */
  getDefaultConfig() {
    const that = this;
    Honye.get(Honye.CONFIG)
      .then(res => {
        that.globalData.config = res;
      })
  }

})