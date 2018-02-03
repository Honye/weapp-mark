//app.js
import { Honye } from './utils/apis.js';
import Util from './utils/util.js';
import AV from './assets/libs/av-live-query-weapp-min.js';
/**
 * 主要用来提供两版显示
 * 本地版本号大于服务端版本号代表未发布，简版显示应对审核
 * 本地版本号小余等于服务端版本号代表已发布
 */
const version = {
  versionCode: 7,
  versionName: '1.0.4(8)'
};

AV.init({
  appId: '2IeNe8Y91CoyD64fDLMLNOJL-gzGzoHsz',
  appKey: 'sk3lhMKf6p224UoA9x1fUQDc',
})

App({

  onLaunch: function () {
    this.getSetting()
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
    config: null,
    published: false,  // 是否为发布版
  },

  /**
   * 从服务器获取默认配置
   */
  getDefaultConfig(callback) {
    const that = this;
    const { config } = this.globalData;
    if(config) {
      return new Promise((resolve, reject) => {
        resolve(config)
      })
    }

    return new AV.Query('Config').first().then(config => {
      that.globalData.config = config;
      that.globalData.published = version.versionCode <= config.get('newestVersion')
      return config
    })
  },

  /**
   * 是否已经发布
   * @param {Function} callback 回调返回 Boolean 结果
   */
  hasPublished(callback) {
    const that = this;
    const { config } = this.globalData;
    if(config) {
      return new Promise((resolve, reject) => {
        resolve(version.versionCode <= config.get('newestVersion'))
      })
    } 
    
    return new Promise((resolve, reject) => {
      that.getDefaultConfig().then(res => {
        resolve(version.versionCode <= res.get('newestVersion'))
      })
    })
  },

  /**
   * 退出登录
   */
  logout(callback) {
    this.globalData.userInfo = null
    callback && callback(this.globalData)
  },

  /**
   * 获取本地设置
   */
  getSetting(callback) {
    const that = this;
    const { setting } = this.globalData
    if(setting && (!Util.isEmpty(setting))) {
     typeof callback == "function" && callback(setting)
    } else {
      wx.getStorage({
        key: 'setting',
        success: function (res) {
          that.globalData.setting = res.data
          typeof callback == "function" && callback(res.data)
        }
      })
    }
  }

})