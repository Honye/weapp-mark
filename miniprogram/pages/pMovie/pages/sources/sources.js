// pages/sources/sources.js
import { getDetail } from '../../../../apis/douban.js';

Page({

  data: {},

  /**
   * @param {object} options
   * @param {string} options.id
   */
  onLoad (options) {
    this.getDetails(options.id);
  },

  /** 获取影视详情 */
  async getDetails (id) {
    wx.showLoading({
      title: 'loading...'
    });
    const res = await getDetail({ id });
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
