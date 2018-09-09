// pages/about/index.js
import {Honye} from '../../utils/apis.js';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: {},
    playing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.initAudioListener()
  },

  onShow: function(options) {
    const that = this;
    wx.getBackgroundAudioPlayerState({
      success: res => {
        that.setData({
          playing: res.status === 1
        })
      },
      fail: res => {
        // console.log("获取音乐播放状态失败", res)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getData() {
    const that = this;
    Honye.get(Honye.ABOUT).then(res => {
      that.setData({ datas: res })
      wx.getBackgroundAudioPlayerState({
        fail: ret => {
          that.initAudio(res.bgm)
        }
      })
    })
  },

  /**
   * 播放背景音乐
   */
  initAudio(bgm) {
    const that = this;
    wx.playBackgroundAudio({
      dataUrl: bgm.url,
      title: bgm.title,
      success: () => {
        that.setData({ playing: true })
      }
    })
  },

  /**
   * 播放/暂停
   */
  audioToggle() {
    const that = this;
    wx.getBackgroundAudioPlayerState({
      success: res => {
        if (res.status === 1) 
          wx.getBackgroundAudioManager().pause()
        else if(res.status === 2)
          that.initAudio(that.data.datas.bgm)
        else
          wx.getBackgroundAudioManager().play()
      },
      fail: res => {
        that.initAudio(that.data.datas.bgm)
      }
    })
  },

  /**
   * 初始化音乐播放/暂停/停止监听
   */
  initAudioListener() {
    const that = this;
    wx.onBackgroundAudioPlay(res => {
      // console.log("播放");
      that.setData({ playing: true })
    })
    wx.onBackgroundAudioPause(res => {
      // console.log("暂停")
      that.setData({ playing: false })
    })
    wx.onBackgroundAudioStop(res => {
      // console.log("停止")
      that.setData({ playing: false })
    })
  }
})