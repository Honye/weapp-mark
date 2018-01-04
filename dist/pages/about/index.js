// pages/about/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.audioManager) {
      this.setData({
        playing: app.audioManager.paused
      })
    }
    this.initAudio();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  initAudio() {
    wx.playBackgroundAudio({
      dataUrl: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',
      title: 'HONYE',
      coverImgUrl: ''
    })
    this.setData({
      playing: true
    })
  },

  audioToggle() {
    const {playing} = this.data;
    if(!app.audioManager) 
      app.audioManager = wx.getBackgroundAudioManager()
    if (app.audioManager.paused) 
      app.audioManager.play()
    else 
      app.audioManager.pause()
    this.setData({
      playing: !playing
    })
  }
})