// pages/article/detail.js
import { articleDetail } from './../../config.js';

var WxParse = require('./../common/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    temp: ``
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("文章ID", options.id);
    this.getDetail(options.id);
    // WxParse.wxParse('article', 'html', this.data.temp, this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 获取详情
   */
  getDetail: function(id) {
    const that = this;
    wx.request({
      url: `${articleDetail}/${id}`,
      success: res => {
        that.setData({
          detail: res.data
        }, () => {
          WxParse.wxParse('article', 'html', that.data.detail.content, that);
        })
      }
    })
  }
})