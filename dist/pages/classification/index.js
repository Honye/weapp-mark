// 分类查找
import { classifyUrl } from './../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classify: [],
    loaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  /**
   * 获取数据
   */
  getData: function () {
    wx.showLoading({
      title: 'loading...',
    })
    let that = this;
    wx.request({
      url: classifyUrl,
      success: function (res) {
        that.modifyData(res.data);
        wx.hideLoading();
      }
    })
  },

  /**
   * 调整数据
   */
  modifyData: function (classify) {
    for (let item of classify) {
      if (item.children.length < 6) {
        for (let i = 0, length = (6 - item.children.length); i < length; i++) {
          item.children.push(" ");
        }
      } else if ((item.children.length - 6) % 4 !== 0) {
        for (let i = 0, length = (4 - (item.children.length - 6) % 4); i < length; i++) {
          item.children.push(" ");
        }
      }
    }
    this.setData({
      classify,
      loaded: true
    });
  }
})