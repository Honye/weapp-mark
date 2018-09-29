// 个人中心

//获取应用实例
var app = getApp()

Page({

  data: {
    version: app.globalData.version,
    userInfo: {}
  },

  /**
   * 进入个人资料
   */
  bindViewTap: function() {
    const that = this;
    const { version, config } = app.globalData;
    if(app.globalData.userInfo) {
      if (version.versionCode > config.newestVersion) return;
      wx.navigateTo({
        url: '/pages/pUser/pages/userinfo/userinfo'
      })
    } else {
      wx.getSetting({
        success: res => {
          if(!res.authSetting['scope.userInfo']) {
            wx.openSetting({
              success: res => {
                if (res.authSetting['scope.userInfo']){
                  app.getUserInfo(userInfo => {
                    that.setData({ userInfo })
                  })
                }
              }
            })
          } else {
            app.getUserInfo(userInfo => {
              that.setData({ userInfo })
            })
          }
        }
      })
    }
  },

  onLoad: function () {
    //调用应用实例的方法获取全局数据
    app.getUserInfo().then(userInfo => {
      //更新数据
      this.setData({
        userInfo
      })
    })
  },

  /**
   * 去设置
   */
  toSetting: function() {
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },

  /**
   * 退出登录
   */
  logout: function() {
    wx.showModal({
      content: '确定要退出？',
      success: (res) => {
        res.confirm && app.logout(() => {
          this.setData({
            userInfo: {}
          })
        })
      }
    })
  },

  /**
   * 关于
   */
  toAbout: function() {
    const { version, config } = app.globalData;
    if (version.versionCode <= config.newestVersion)
    wx.navigateTo({
      url: '/pages/about/index',
    })
  },

  /**
   * 转发
   */
  onShareAppMessage: function(opt) {
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
      url: '/pages/pUser/pages/favMovieList/index',
    })
  },

  /**
   * 我喜欢的卡片
   */
  toFavCards: function() {
    const { version, config } = app.globalData;
    if (version.versionCode <= config.newestVersion)
    wx.navigateTo({
      url: '/pages/pUser/pages/favCards/index',
    })
  },

  /**
   * 作出评价
   */
  toEvalute() {
    wx.navigateTo({
      url: '/pages/pUser/pages/evaluate/evaluate',
    })
  },

  /**
   * 客服按钮监听
   */
  onContactTap() {
    wx.setClipboardData({
      data: '浪里个儿浪 浪里个儿浪 我要调戏你了',
    })
  }

})
