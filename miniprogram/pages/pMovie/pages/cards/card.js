// 每日卡片
import { $markShare } from '../../../common/index';
import wxCloud from '../../../../utils/wxCloud';

Page({

  data: {
    cards: [{}],
    current: 0,
    userInfo: null,
    visible: false,
    painterData: null,
    shareCardImg: ''
  },

  onLoad (options) {
    this.getCards();
  },

  onUserInfo (e) {
    const { userInfo } = e.detail;
    if (userInfo) {
      this.setData(
        { userInfo },
        () => {
          this.showShareMenu();
          this.setCanvasData();
        }
      );
    } else {
      console.warn('用户拒绝授权用户信息');
    }
  },

  /** 获取卡片 */
  getCards () {
    wxCloud('getCards').then(res => {
      this.setData({
        cards: res.data,
      })
    })
  },

  /** 用户点击右上角分享 */
  onShareAppMessage () {
    const { cards, current } = this.data
    return {
      title: cards[current].quote,
      path: `/pages/card/card?current=${current}`,
      imageUrl: cards[current].image,
    }
  },

  /** 切换卡片 */
  onChange (event) {
    this.setData({
      current: event.detail.current,
    })
  },

  setCanvasData () {
    const { userInfo, cards, current } = this.data;
    const currentCard = cards[current];
    this.setData({
      painterData: {
        width: '675rpx',
        height: '1000rpx',
        views: [
          {
            type: 'image',
            id: 'img-head',
            url: currentCard.image,
            css: {
              top: '0rpx',
              left: '0rpx',
              width: '675rpx',
              height: 'auto',
            }
          },
          {
            type: 'text',
            id: 'text-word',
            text: currentCard.quote,
            css: {
              top: ['24rpx', 'img-head', 1],
              left: '24rpx',
              width: '627rpx',
              fontSize: '28rpx',
              lineHeight: '44.8rpx'
            }
          },
          {
            type: 'text',
            text: `——${currentCard.source}`,
            css: {
              top: ['50rpx', 'text-word', 1],
              left: '24rpx',
              right: '24rpx',
              fontSize: '28rpx',
              textALign: 'right'
            }
          },
          {
            type: 'image',
            id: 'img-avatar',
            url: userInfo.avatarUrl,
            css: {
              left: '24rpx',
              bottom: '30rpx',
              width: '30rpx',
              height: '30rpx',
              borderRadius: '30rpx'
            }
          },
          {
            type: 'text',
            text: userInfo.nickName,
            css: {
              left: ['12rpx', 'img-avatar', 1],
              top: ['0rpx', 'img-avatar', 0],
              fontSize: '22rpx',
              lineHeight: '30rpx',
              color: '#999'
            }
          },
          {
            type: 'image',
            url: '/assets/images/iMark.jpg',
            css: {
              right: '30rpx',
              bottom: '30rpx',
              width: '100rpx',
              height: '100rpx',
              borderRadius: '50rpx'
            }
          }
        ]
      }
    });
  },

  /** 分享 */
  showShareMenu (e) {
    this.setData({
      visible: true
    });
    $markShare.show({
      titleText: '',
      buttons: [{
        key: 'forward',
        iconPath: '/assets/images/weixin_icon.png',
        title: '微信好友',
        openType: 'share'
      },
      {
        key: 'moment',
        iconPath: '/assets/images/weixin_circle_icon.png',
        title: '微信朋友圈'
      },
      {
        key: 'weibo',
        iconPath: '/assets/images/weibo_icon.png',
        title: '微博'
      },
      {
        key: 'save',
        iconPath: '/assets/images/save_pic_icon.png',
        title: '保存图片'
      }
      ],
      buttonClicked: (index, item) => {
        switch (item.key) {
          case 'forward': break;
          case 'save':
            this.saveCardImg();
            break;
          default:
            wx.showModal({
              content: item.title,
            })
        }
        return true
      },
      cancel: () => {
        this.setData({
          visible: false,
          shareCardImg: ''
        });
      }
    })
  },

  /** 喜欢/取消喜欢 */
  onFavChange (e) {
    const { checked } = e.detail
    let { cards, current } = this.data
    wxCloud('favCard', {
      id: cards[current].id,
    }).then(res => {
      wx.showToast({
        title: res.message,
      })
      cards[current].liked = !checked
      cards[current].likeCount = checked ? --cards[current].likeCount : ++cards[current].likeCount
      this.setData({ cards })
    })
  },

  onPaintSuccess (e) {
    this.setData({
      shareCardImg: e.detail.path
    });
  },

  saveCardImg () {
    const { shareCardImg } = this.data;
    const save = () => {
      wx.saveImageToPhotosAlbum({
        filePath: shareCardImg,
        success: () => {
          wx.showToast({
            title: '保存成功'
          });
        }
      });
    };
    wx.getSetting({
      success: ({ authSetting }) => {
        if (Object.prototype.hasOwnProperty.call(authSetting, 'scope.writePhotosAlbum')) {
          if (authSetting['scope.writePhotosAlbum']) {
            save();
          } else {
            wx.showModal({
              title: '提示',
              content: '需要授权才能保存图片',
              cancelText: '放弃',
              confirmText: '去授权',
              success: ({ confirm }) => {
                if (confirm) {
                  wx.openSetting({
                    withSubscriptions: true,
                  });
                } else {
                  this.setData({
                    visible: false
                  });
                }
              }
            });
          }
        } else {
          save();
        }
      }
    })
  },

  none () {}
})