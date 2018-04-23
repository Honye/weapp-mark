// pages/card/card.js
import { $markShare } from '../../../common/index.js'
import { Honye } from '../../../../utils/apis.js';

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
    Honye.get(Honye.CARDS).then(res => {
      _this.setData({
        cards: res
      })
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
        { iconPath: '/assets/images/weixin_icon.png', title: '微信好友', openType:'share' },
        { iconPath: '/assets/images/weixin_circle_icon.png', title: '微信朋友圈' },
        { iconPath: '/assets/images/qq_icon.png', title: 'QQ好友' },
        { iconPath: '/assets/images/weibo_icon.png', title: '微博' },
        { iconPath: '/assets/images/save_pic_icon.png', title: '保存图片' },
        { iconPath: '/assets/images/share_more_icon.png', title: '更多' },
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
  /**
   * 喜欢/取消喜欢
   */
  onFavChange(e) {
    const { checked } = e.detail;
    let { cards, current } = this.data;
    cards[current].checked = !checked;
    cards[current].likeCount = checked ? --cards[current].likeCount : ++cards[current].likeCount;
    this.setData({ cards })
  }

})