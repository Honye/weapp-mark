//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var _this = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      _this.setData({
        userInfo:userInfo
      })
    })
  },
  gotoFirst: function() {
    wx.navigateTo({
      url: '../first/first'
    })
  },

  /**
   * 去设置
   */
  toSetting: function() {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },

  logout: function() {
    wx.navigateTo({
      url: '../first/first',
    })
  },
  /**
   * 关于
   */
  toAbout: function() {
    return;
  }
})
