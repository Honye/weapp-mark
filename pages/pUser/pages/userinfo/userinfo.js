// pages/userinfo/userinfo.js
import { $wuxActionSheet } from '../../../common/index.js';

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

  bindPhone() {
    wx.navigateTo({
      url: '/pages/pUser/pages/bindphone/index',
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
  },

  showActionSheet() {
    const that = this;
    $wuxActionSheet.show({
      theme: 'wx',
      buttons: [
        {text:'拍照'},
        {text:'从相册中选取'},
      ],
      buttonClicked(index, item) {
        wx.chooseImage({
          count: 1,
          sourceType: index===0 ? ['camera'] : ['album'],
          success: function(res) {
            const { userInfo } = that.data;
            that.setData({
              userInfo: { ...userInfo, avatarUrl: res.tempFilePaths[0] }
            })
          },
        })
        return true;
      }
    })
  }
})