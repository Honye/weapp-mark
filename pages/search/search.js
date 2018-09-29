// pages/search/search.js
import { Douban } from './../../utils/apis.js';

const app = getApp();
const count = 20;  // 每页加载数据数目
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
    paragraph: '&emsp;人生就是一列开往坟墓的列车，路途上会有很多站，很难有人可以自始至终陪着走完。当陪你的人下车时，即使不舍也该心存感激，然后挥手道别。',
    result: null,
    loading: false,
    pageNo: 0,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      quote: app.globalData.config.quote
    })
  },

  clearInput: function () {
    this.setData({
      inputVal: "",
      result: null
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 用户确认搜索
   */
  inputConfirm() {
    const that = this;
    const { inputVal } = this.data;
    if(inputVal.indexOf('hy:')===0) {
      this.hiddenCommand()
    } else {
      this.setData({
        scrollTop: 0,
        pageNo: 0,
        hasMore: true
      }, () => {
        that.searchMovie()
      })
    }
  },

  /**
   * 搜索
   */
  searchMovie: function (e) {
    const that = this;
    const { inputVal, pageNo, result } = this.data;
    this.setData({
      loading: true
    })
    wx.showLoading({
      title: 'loading...',
    })
    const body = {
      q: inputVal,
      start: count * pageNo,
      count
    }
    Douban.get(Douban.SEARCH, body)
      .then(res => {
        that.setData({
          result: pageNo?[...result, ...res.subjects]:[...res.subjects],
          loading: false,
          pageNo: pageNo+1,
          hasMore: res.total > count*(pageNo+1)
        })
      })
  },

  /**
   * 取消返回
   */
  goBack: function () {
    wx.navigateBack()
  },

  /**
   * 触底加载更多
   */
  loadMore: function (e) {
    const { loading, hasMore } = this.data;
    if (!loading && hasMore) {
      this.searchMovie()
    }
  },

  /**
   * 隐藏命令
   */
  hiddenCommand() {
    const { inputVal } = this.data;
    const command = inputVal.split('hy:')[1].trim().toUpperCase();
    switch(command) {
      case 'OPEN MARK':  // 打开 Mark 小程序
        wx.navigateToMiniProgram({
          appId: 'wx5363d9bd45509430',
        })
        break;
      case 'OPEN TEST':  // 打开测试页
        wx.navigateTo({
          url: '/pages/first/first',
        })
        break;
      default:
        wx.showToast({
          title: '命令错误！',
        })
        break;
    }
  }

})