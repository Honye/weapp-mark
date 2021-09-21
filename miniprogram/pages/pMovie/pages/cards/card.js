// 每日卡片
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import { $markShare } from '../../../common/index';
import wxCloud from '../../../../utils/wxCloud';

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    cards: [{}],
    current: 0,
    userInfo: null,
    visible: false,
    painterData: null,
    shareCardImg: ''
  },

  storeBindings: {
    store,
    fields: {
      user: () => store.user
    }
  },

  onLoad (options) {
    this.getCards();
  },

  /**
   * 1. 每次都获取用户最新头像，每次都调用接口更新用户信息，造成服务端没必要的压力
   * 2. 服务端有用户头像时不需要用户授权最新头像
   * 
   * 选择了 ②，用户发现头像过时了可以去个人中心更新
   * @param {{
   *  detail: {
   *    userInfo: any;
   *    cloudID?: string;
   *  }
   * }} e 
   */
  async onUserInfo (e) {
    if (store.user.info?.avatarUrl) {
      this.setShareMenu();
      return;
    }

    const { userInfo, cloudID } = e.detail;
    if (userInfo) {
      // case 服务端没有用户头像且用户同意授权
      const { data } = wxCloud('login', {
        wxUserInfo: wx.cloud.CloudID(cloudID)
      });
      store['user/updateUserInfo'](data);
      this.setShareMenu();
      return;
    }

    console.warn('用户拒绝授权用户信息');
  },

  handleShareTap (e) {
    if (store.user.info?.avatarUrl) {
      this.setShareMenu();
    }
  },

  setShareMenu () {
    this.showShareMenu();
    this.setCanvasData();
  },

  /** 获取卡片 */
  async getCards () {
    const res = await wxCloud('getCards');
    this.setData({
      cards: res.list || []
    });
  },

  /** 用户点击右上角分享 */
  onShareAppMessage () {
    const { cards, current } = this.data
    return {
      title: cards[current].quote,
      path: `/pages/pMovie/pages/cards/card?current=${current}`,
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
    const { cards, current } = this.data;
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
            url: store.user.info.avatarUrl,
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
            text: store.user.info.nickName,
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
      buttons: [
        {
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
          key: 'save',
          iconPath: '/assets/images/save_pic_icon.png',
          title: '保存图片'
        },
        {
          key: 'make',
          iconPath: '/assets/images/card_icon_made.svg',
          title: '制作卡片'
        }
      ],
      buttonClicked: (index, item) => {
        switch (item.key) {
          case 'forward': break;
          case 'moment':
          case 'save':
            this.saveCardImg();
            break;
          default:
            wx.showModal({
              content: '正在开发中...',
              showCancel: false
            });
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

  /**
   * 喜欢/取消喜欢
   * @param {WechatMiniprogram.BaseEvent<,{ id: string }>} e
   */
  async favOrCancel (e) {
    const { id } = e.currentTarget.dataset;
    await wxCloud('favCard', { id });
    const { cards, current } = this.data;
    const checked = !cards[current].like_state;
    cards[current].like_state = Number(checked);
    cards[current].like_count = checked ? ++cards[current].like_count : --cards[current].like_count;
    this.setData({ cards });
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
})
