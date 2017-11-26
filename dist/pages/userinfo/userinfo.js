// pages/userinfo/userinfo.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    phone: '13125368636',
    thirdAuthor: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    this.initData();
  },

  showActionSheet() {
    const that = this;
    wx.showActionSheet({
      itemList: ['拍照','从相册中选取'],
      success: res => {
        wx.chooseImage({
          count: 1,
          sourceType: res.tapIndex===0?['camera']:['album'],
          success: function(result) {
            const {userInfo} = that.data;
            that.setData({
              userInfo: { ...userInfo, avatarUrl: result.tempFilePaths[0] }
            })
          },
        })
      }
    })
  },

  bindPhone() {
    wx.navigateTo({
      url: './../bindphone/index',
    })
  },

  initData() {
    this.setData({
      thirdAuthor: [
        {id:'wechat', title:'微信', isAuthor: true},
        {id:'qq', title:'QQ', isAuthor: false},
        {id:'sina', title:'微博', isAuthor: false}
      ]
    })
  }
})