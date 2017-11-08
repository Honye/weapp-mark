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
    wx.navigateTo({
      url: '../first/first',
    })
  },
  /**
   * 关于
   */
  toAbout: function() {
    return;
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
    wx.navigateTo({
      url: './../favMovieList/index',
    })
  },
  /**
   * 我喜欢的卡片
   */
  toFavCards: function() {
    wx.navigateTo({
      url: './../favCards/index',
    })
  }

})
