// pages/about/index.js
import {Honye} from '../../utils/apis.js';
import AV from '../../assets/libs/av-live-query-weapp-min.js';

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
        console.warn("没有背景音频", res)
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
    const query = new AV.Query('About')
    query.first().then(res => {
      that.setData({ datas: res })
      wx.getBackgroundAudioPlayerState({
        fail: ret => {
          that.initAudio(res.get('bgm'))
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
          that.initAudio(that.data.datas.get('bgm'))
        else
          wx.getBackgroundAudioManager().play()
      },
      fail: res => {
        that.initAudio(that.data.datas.get('bgm'))
      }
    })
  },

  /**
   * 初始化音乐播放/暂停/停止监听
   */
  initAudioListener() {
    const that = this;
    wx.onBackgroundAudioPlay(res => {
      that.setData({ playing: true })
    })
    wx.onBackgroundAudioPause(res => {
      that.setData({ playing: false })
    })
    wx.onBackgroundAudioStop(res => {
      that.setData({ playing: false })
    })
  }
})