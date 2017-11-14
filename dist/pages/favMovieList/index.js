// pages/favMovieList/index.js
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
    this.initData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  initData: function() {
    this.setData({
      list: [
        {
          id: 388,
          image: 'http://7xqnv7.com2.z0.glb.qiniucdn.com/2016-05-25_57459a8879641.jpg',
          title: '不开心的时候看这些电影让你心情变好',
          likeCount: 2427
        },{
          id: 699,
          image	: 'http://7xqnv7.com2.z0.glb.qiniucdn.com/2016-11-14_58296aace581c.jpg',
          title: '看完这些电影你还相信爱情吗？',
          likeCount: 2001
        }
      ]
    })
  }
})