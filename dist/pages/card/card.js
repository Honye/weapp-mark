// pages/card/card.js
import { $markShare } from '../common/index.js'

const cardsUrl = require('../../config').cardsUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [{}],
    current: 0,
    visible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
    this.setData({
      current: options.current?options.current:0
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const {cards, current} = this.data;
    return {
      title: cards[current].quote,
      path: `/pages/card/card?current=${current}`,
      imageUrl: cards[current].image
    }
  },

  initData: function() {
    let _this = this;
    wx.request({
      url: cardsUrl,
      header: {
        "Content-Type": "json"
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log("结果", res);
        _this.setData({
          cards: res.data
        });
      }
    })
  },

  /**
   * 切换卡片
   */
  onChange: function(event) {
    this.setData({
      current: event.detail.current
    })
  },

  /**
   * 分享
   */
  showShareMenu: function(e) {
    $markShare.show({
      titleText: '',
      buttons: [
        { iconPath: '/images/weixin_icon.png', title: '微信好友', openType:'share' },
        { iconPath: '/images/weixin_circle_icon.png', title: '微信朋友圈' },
        { iconPath: '/images/qq_icon.png', title: 'QQ好友' },
        { iconPath: '/images/weibo_icon.png', title: '微博' },
        { iconPath: '/images/save_pic_icon.png', title: '保存图片' },
        { iconPath: '/images/share_more_icon.png', title: '更多' },
      ],
      buttonClicked(index, item) {
        if(!item.openType)
          wx.showModal({
            content: item.title,
          })
        return true;
      }
    })
  },

})