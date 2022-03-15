import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import { getTrailers } from '../../../../apis/douban.js';

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    currUrl: '',
    trailerId: '',
    trailers: []
  },

  storeBindings: {
    store,
    fields: ['app']
  },

  /**
   * @param {object} options
   * @param {string} options.trailer 预告片 ID
   */
  async onLoad (options) {
    wx.setNavigationBarTitle({
      title: '中国预告片（中文字幕）',
    });
    const { id, resource, trailer } = options;
    this.setData({
      currUrl: resource,
      trailerId: trailer,
    });

    const { trailers } = await getTrailers({ id });
    this.setData({ trailers });
    const activedTrailer = (trailers || []).find(item => String(item.id) === String(trailer));
    if (activedTrailer) {
      wx.setNavigationBarTitle({
        title: activedTrailer.title,
      });
    }
  },

  onShareAppMessage () {
    // nothing
  },

  /** 改变当前预告 */
  changeTrailer (e) {
    const { trailers } = this.data;
    const { index } = e.currentTarget.dataset;
    const trailer = trailers[index];
    this.setData({
      currUrl: trailer.video_url,
      trailerId: trailer.id,
    });
    wx.setNavigationBarTitle({
      title: trailer.title,
    });
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