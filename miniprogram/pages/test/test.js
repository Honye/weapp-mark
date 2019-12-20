// miniprogram/pages/test/test.js
import wxCloud from '../../utils/wxCloud.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  handleSubscribeTap() {
    wx.requestSubscribeMessage({
      tmplIds: ['sJz8Heo9GSqMwhnJFlpEHbm-rmIhUlhOkEOoSvY6BwE'],
      fail(err) {
        console.error(err)
      }
    })
  },

  handleTempTap() {
    wxCloud('subscribeMessage').then(res => {
      console.log('调用成功', res)
    }).catch(err => {
      console.error('调用失败')
      console.error(err)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})