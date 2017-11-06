// pages/sources/sources.js
import { subjectInfoUrl } from './../../config';

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
    wx.request({
      url: `${subjectInfoUrl}/${id}`,
      data: {
        apikey: '0b2bdeda43b5688921839c8ecb20399b'
      },
      header: { "Content-Type": "json" },
      method: 'GET',
      success: function (res) {
        const data = res.data;
        wx.hideLoading();
        _this.setData({
          sources: data.videos
        });
      }
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