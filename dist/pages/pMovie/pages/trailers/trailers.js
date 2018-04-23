// pages/trailers/trailers.js
import { Douban } from '../../../../utils/apis.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currUrl: '',
    trailers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '中国预告片（中文字幕）',
    })
    const {id, resource} = options;
    this.setData({ currUrl: resource })
    this.getDetails(id);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 获取影视详情
   */
  getDetails: function (id) {
    wx.showLoading({
      title: 'loading...',
    });
    let _this = this;
    Douban.get(`${Douban.DETAILS}/${id}`)
      .then(res => {
        _this.setData({
          trailers: res.trailers,
          loaded: true,
        });
      })
  },

  /**
   * 改变当前预告
   */
  changeTrailer(e) {
    const { trailers } = this.data;
    const {index, url} = e.currentTarget.dataset;
    this.setData({ currUrl: url })
    wx.setNavigationBarTitle({
      title: trailers[index].title,
    })
  },

  /**
   * 视频播放结束
   */
  videoEnded() {
    const {trailers, currUrl} = this.data;
    const that = this;
    for(let i=0; i<trailers.length; i++) {
      if (currUrl == trailers[i].resource_url && i<trailers.length-1) {
        that.setData({ currUrl: trailers[i + 1].resource_url})
      }
    }
  }
})