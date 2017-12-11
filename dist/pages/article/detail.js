// pages/article/detail.js
import { Honye } from './../../utils/apis.js';
var WxParse = require('./../common/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail(options.id);
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
    Honye.get(`${Honye.ARTICLE_DETAIL}/${id}`).then(res => {
      that.setData({
        detail: res
      }, () => {
        WxParse.wxParse('article', 'html', that.data.detail.content, that);
      })
    })
  }
})