// pages/favCards/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: []
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
      cards: [
        {
          id: 4,
          image: "https://img3.doubanio.com/view/photo/l/public/p2413274774.webp",
          quote: "当一个胖纸没什么不好，最起码可以温暖其他的人。",
          source: "《龙猫》",
          likeCount: 522,
          shareCount: 105
        },
        {
          id: 1,
          image: "http://oz126ti4w.bkt.clouddn.com/image/2017110711091269781.jpg",
          quote: "隐约雷鸣 阴霾天空 但盼风雨来 能留你在此\n隐约雷鸣 阴霾天空 即使无风雨 我亦留此地",
          source: "《言叶之庭》",
          likeCount: 526,
          shareCount: 59
        },
        {
          id: 2,
          image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506272458940&di=cac8711f1e5fe46fe4298f407a8c88fa&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2013%2Fmxy%2F12%2F25%2F4%2F7.jpg",
          quote: "我想每个人都至少有这么一个挚友，你和他在人生的拐点遇到，惊叹于彼此的不同或者相似，有过不少平淡无奇却值得纪念的时光，任白云苍狗，风格云变化。",
          source: "《触不可及》",
          likeCount: 399,
          shareCount: 45
        }
      ]
    })
  }
})