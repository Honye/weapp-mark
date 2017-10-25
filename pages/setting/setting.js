// pages/setting/setting.js 设置
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: true,
    storageSize: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let size = 0;
    wx.getStorageInfo({
      success: function(res) {
        size = res.currentSize;
      },
    })
    this.setData({
      notice: app.globalData.setting.notice || false,
      storageSize: size
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
  
  },

  switchNotice: function(event) {
    const _this = this;
    wx.setStorage({
      key: 'setting',
      data: {...app.globalData.setting,notice:event.detail.value},
      success: () => {
        app.globalData.setting = { ...app.globalData.setting, notice: event.detail.value};
        _this.setData({
          notice: event.detail.value
        })
      }
    })
  },

  /**
   * 清除缓存
   */
  clearCache: function() {
    // wx.removeStorage({
    //   key: '',
    //   success: function(res) {},
    // });
    try {
      wx.clearStorageSync();
    } catch(e) {
      console.error(e);
    }
    wx.showToast({
      title: '已清除',
      icon: 'success'
    })
  }
})