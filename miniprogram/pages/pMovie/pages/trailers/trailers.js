// pages/trailers/trailers.js
import { getTrailers } from '../../../../apis/douban.js';

Page({

  data: {
    currUrl: '',
    trailers: []
  },

  onLoad (options) {
    wx.setNavigationBarTitle({
      title: '中国预告片（中文字幕）',
    })
    const {id, resource} = options;
    this.setData({ currUrl: resource })
    this.getDetails(id);
  },

  onShareAppMessage () {
    // nothing
  },

  /**
   * 获取影视详情
   */
  async getDetails (id) {
    wx.showLoading({
      title: 'loading...',
    });
    const res = await getTrailers({ id });
    wx.hideLoading();
    this.setData({
      trailers: res.trailers,
      loaded: true
    });
  },

  /**
   * 改变当前预告
   */
  changeTrailer (e) {
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
  videoEnded () {
    const {trailers, currUrl} = this.data;
    for(let i=0; i<trailers.length; i++) {
      if (currUrl == trailers[i].video_url && i<trailers.length-1) {
        this.setData({ currUrl: trailers[i + 1].video_url})
      }
    }
  }
})