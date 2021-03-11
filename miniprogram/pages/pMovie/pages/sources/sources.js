// pages/sources/sources.js
import { getDetail } from '../../../../apis/douban.js';

Page({

  data: {},

  /**
   * @param {object} options
   * @param {string} options.id
   * @param {'movie'|'tv'} [options.type = 'movie']
   */
  onLoad (options) {
    this.getDetails(options.id, options.type);
  },

  /**
   * 获取影视详情
   * @param {'movie'|'tv'} [type = 'movie']
   */
  async getDetails (id, type = 'movie') {
    wx.showLoading({
      title: 'loading...'
    });
    const res = await getDetail({ id, type });
    wx.hideLoading();
    this.setData({
      sources: res.linewatches || []
    });
  },

  /** 复制播放地址 */
  copyUrl (e) {
    const {url} = e.currentTarget.dataset;
    wx.setClipboardData({
      data: url,
      success: res => {
        wx.showToast({
          icon: 'none',
          title: '已复制链接'
        });
        wx.showModal({
          content: `播放地址已复制到剪贴板 \n 前往浏览器粘贴访问`,
          showCancel: false
        })
      }
    })
  }
})
