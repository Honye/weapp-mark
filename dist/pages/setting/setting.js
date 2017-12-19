// 设置
import Storage from './../../utils/storage.js';

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
      success: function (res) {
        size = res.currentSize;
      },
    })
    this.setData({
      notice: app.globalData.setting.notice || false,
      storageSize: size
    })
  },

  /**
   * 通知开关
   */
  switchNotice: function (event) {
    const _this = this;
    wx.setStorage({
      key: 'setting',
      data: { ...app.globalData.setting, notice: event.detail.value },
      success: () => {
        app.globalData.setting = { ...app.globalData.setting, notice: event.detail.value };
        _this.setData({
          notice: event.detail.value
        })
      }
    })
  },

  /**
   * 清除缓存
   */
  clearCache: function () {
    Storage.clear()
    wx.showToast({
      title: '已清除',
      icon: 'success'
    })
  }
})