// about
import { Honye } from '../../utils/apis'

Page({

    data: {
        datas: {},
        playing: false
    },

    /** 生命周期函数--监听页面加载 */
    onLoad(options) {
        this.getData()
        this.initAudioListener()
    },

    onShow(options) {
        wx.getBackgroundAudioPlayerState({
            success: res => {
                this.setData({
                    playing: res.status === 1
                })
            },
            fail: res => {
                // console.log("获取音乐播放状态失败", res)
            }
        })
    },

    /** 右上角分享 */
    onShareAppMessage() {

    },

    getData() {
        Honye.get(Honye.ABOUT).then( res => {
            this.setData({
                datas: res,
            })
            wx.getBackgroundAudioPlayerState({
                fail: () => {
                    this.initAudio(res.bgm)
                }
            })
        })
    },

    /** 播放背景音乐 */
    initAudio(bgm) {
        wx.playBackgroundAudio({
            dataUrl: bgm.url,
            title: bgm.title,
            success: () => {
                this.setData({
                    playing: true
                })
            },
        })
    },

    /** 播放/暂停 */
    audioToggle() {
        wx.getBackgroundAudioPlayerState({
            success: res => {
                if (res.status === 1)
                    wx.getBackgroundAudioManager().pause()
                else if (res.status === 2)
                    this.initAudio(that.data.datas.bgm)
                else
                    wx.getBackgroundAudioManager().play()
            },
            fail: () => {
                this.initAudio(this.data.datas.bgm)
            }
        })
    },

    /** 初始化音乐播放/暂停/停止监听 */
    initAudioListener() {
        wx.onBackgroundAudioPlay( res => {
            // console.log("播放");
            this.setData({
                playing: true,
            })
        })
        wx.onBackgroundAudioPause( res => {
            // console.log("暂停")
            this.setData({
                playing: false,
            })
        })
        wx.onBackgroundAudioStop( res => {
            // console.log("停止")
            this.setData({
                playing: false,
            })
        })
    },

    toWebview(e) {
        const { url } = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/webview/index?url=${url}`,
        })
    },
})