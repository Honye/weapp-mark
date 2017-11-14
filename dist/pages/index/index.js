//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    version: app.globalData.version,
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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

  /**
   * 退出登录
   */
  logout: function() {
    return;
    wx.navigateTo({
      url: '../first/first',
    })
  },
  /**
   * 关于
   */
  toAbout: function() {
    const { version, config } = app.globalData;
    if (version.versionCode <= config.newestVersion)
    wx.navigateTo({
      url: './../about/index',
    })
  },

  /**
   * 转发
   */
  onShareAppMessage: function(opt) {
    console.log("转发", opt);
    return {
      title: "好用得不得了",
      path: "/pages/discovery/discovery",
      imageUrl: "http://xpic.588ku.com/figure/00/00/00/08/56/5355a15b1f68dfd.jpg!/fw/800",
      success: res => {
        console.log("成功", res);
      },
      complete: res => {
        console.log("完成", res);
      }
    };
  },

  /**
   * 我喜欢的影单
   */
  toFavMovieList: function() {
    const { version, config } = app.globalData;
    if(version.versionCode <= config.newestVersion)
    wx.navigateTo({
      url: './../favMovieList/index',
    })
  },
  /**
   * 我喜欢的卡片
   */
  toFavCards: function() {
    const { version, config } = app.globalData;
    if (version.versionCode <= config.newestVersion)
    wx.navigateTo({
      url: './../favCards/index',
    })
  }

})
