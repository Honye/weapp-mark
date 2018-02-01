// pages/article/detail.js
import { Honye } from './../../../utils/apis.js';
var WxParse = require('./../../common/wxParse/wxParse.js');
import { $markShare } from './../../common/index.js'
import AV from './../../../assets/libs/av-live-query-weapp-min.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchDetails(Number(options.id))
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 获取详情
   * @param {Number} id 文章ID
   */
  fetchDetails(id) {
    const that = this
    const query = new AV.Query('Article').equalTo('id', id)
    return query.first().then(detail => {
      that.setData({ detail }, () => {
        WxParse.wxParse('article', 'html', that.data.detail.get('content'), that);
      })
    })
  },

  /**
   * 💓 / 💔
   */
  handleFavChange(e) {
    const { checked, detail } = this.data;
    this.setData({ checked: !checked })
    const currentUser = AV.User.current()
    currentUser.isAuthenticated().then(function (authenticated) {
      currentUser.set('likedArticles', 1059)
      currentUser.save().then(function(user) {
        console.log('用户', user)
      })
    });
  },

  /**
   * 评论
   */
  handleComment(e) {
    wx.showToast({
      title: '评论',
    })
  },

  /**
   * 分享
   */
  handleShare(e) {
    $markShare.show({
      titleText: '',
      buttons: [
        { iconPath: '/assets/images/weixin_icon.png', title: '微信好友', openType: 'share' },
        { iconPath: '/assets/images/weixin_circle_icon.png', title: '微信朋友圈' },
        { iconPath: '/assets/images/qq_icon.png', title: 'QQ好友' },
        { iconPath: '/assets/images/qq_zone_icon.png', title: 'QQ空间' },
        { iconPath: '/assets/images/weibo_icon.png', title: '微博' },
        { iconPath: '/assets/images/copy_link_icon.png', title: '复制链接' },
        { iconPath: '/assets/images/share_more_icon.png', title: '更多' },
      ],
      buttonClicked(index, item) {
        if (!item.openType)
          if(index==5) {
            wx.setClipboardData({
              data: 'https://github.com/Hongye567/weapp-mark',
              success: res => {
                wx.showToast({
                  title: '已复制到剪贴板',
                })
              }
            })
          } else {
            wx.showModal({
              content: item.title,
            })
          }
        return true;
      }
    })
  }
})