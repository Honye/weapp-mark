//app.js
import config from './config';

App({
  onLaunch: function () {
    var _this = this;
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var setting = wx.getStorage({
      key: 'setting',
      success: function(res) {
        _this.globalData.setting = res.data;
      },
    })

    this.getDefaultConfig();
  },

  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
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

  globalData:{
    userInfo:null,
    setting: {},
    config: {}
  },

  showCommonModal: function(msg) {
    wx:wx.showModal({
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