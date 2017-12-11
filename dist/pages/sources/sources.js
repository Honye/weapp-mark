// pages/sources/sources.js
import { Douban } from './../../utils/apis.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icons: {
      mgtv: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=424835445,735191261&fm=58',
      letv: 'https://www.le.com/favicon.ico',
      iqiyi: 'https://www.iqiyi.com/favicon.ico'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetails(options.id);
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
          sources: res.videos
        });
      })
  },

  /**
   * 复制播放地址
   */
  copyUrl: function(e) {
    const {url} = e.currentTarget.dataset;
    wx.setClipboardData({
      data: url,
      success: res => {
        wx.showModal({
          content: `播放地址已复制到剪贴板 \n 前往浏览器粘贴访问`,
          showCancel: false
        })
      }
    })
  }
})