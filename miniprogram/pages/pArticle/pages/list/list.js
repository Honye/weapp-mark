// pages/article/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {title} = options;
    wx.setNavigationBarTitle({ title })
    this.initData();
  },

  initData: function () {
    this.setData({
      list: [
        {
          id: 388,
          image: 'http://7xqnv7.com2.z0.glb.qiniucdn.com/2016-05-25_57459a8879641.jpg',
          title: '不开心的时候看这些电影让你心情变好',
          likeCount: 2427
        }, {
          id: 699,
          image: 'http://7xqnv7.com2.z0.glb.qiniucdn.com/2016-11-14_58296aace581c.jpg',
          title: '看完这些电影你还相信爱情吗？',
          likeCount: 2001
        }
      ]
    })
  }
})