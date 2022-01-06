// 个人中心
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../store/index';
import wxCloud from '../../../utils/wxCloud';

Page({
  behaviors: [storeBindingsBehavior],

  data: {},

  storeBindings: {
    store,
    fields: {
      user: () => store.user,
      app: () => store.app
    }
  },


  onShow () {
    this.selectComponent('#tabBar').setData({ selected: 2 });
  },

  handleSwitchTab (e) {
    const { index, list } = e.detail;
    wx.switchTab({
      url: list[index].pagePath
    });
  },

  /** 进入个人资料 */
  handleUserTap (e) {
    if (store.user.info && store.user.info.nickName) {
      wx.navigateTo({
        url: '/packages/user/pages/userinfo/userinfo'
      });
    }
  },

  async handleUserInfo (e) {
    if (store.user.info && store.user.info.nickName) {
      return;
    }

    const { cloudID } = e.detail;
    const { data } = await wxCloud('login', {
      wxUserInfo: wx.cloud.CloudID(cloudID)
    });
    store['user/updateUserInfo'](data);
  },

  /** 去消息 */
  toNotifications () {
    wx.navigateTo({
      url: '/packages/github/pages/notifications/notifications'
    });
  },

  toGitMark () {
    wx.navigateTo({
      url: '/packages/github/pages/home/home'
    });
  },

  /** 去设置 */
  toSetting() {
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },

  /** 关于 */
  toAbout() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  /** 转发 */
  onShareAppMessage(opt) {
    return {
      title: "好用得不得了",
      path: "/pages/tabs/discovery/discovery",
      imageUrl: "http://xpic.588ku.com/figure/00/00/00/08/56/5355a15b1f68dfd.jpg!/fw/800"
    };
  },

  /** 我喜欢的影单 */
  toFavMovieList() {
    wx.navigateTo({
      url: '/packages/user/pages/favMovieList/index',
    })
  },

  /** 我喜欢的卡片 */
  toFavCards() {
    wx.navigateTo({
      url: '/packages/user/pages/favCards/index',
    })
  },

  /** 作出评价 */
  toEvalute () {
    wx.navigateTo({
      url: '/packages/github/pages/trending/trending'
    });
    // wx.navigateTo({
    //   url: '/packages/user/pages/evaluate/evaluate',
    // })
  },

  navigate (e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  }

})
