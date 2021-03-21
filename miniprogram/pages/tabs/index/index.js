// 个人中心
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../store/index';
import wxCloud from '../../../utils/wxCloud';

// 获取应用实例
const app = getApp();

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    userinfo: app.globalData.userInfo
  },

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
  bindViewTap () {
    wx.navigateTo({
      url: '/pages/pUser/pages/userinfo/userinfo'
    });
  },

  handleUserInfo (e) {
    const { cloudID } = e.detail;
    wxCloud('login', {
      wxUserInfo: wx.cloud.CloudID(cloudID)
    })
      .then(({ data }) => {
        app.globalData.userInfo = data;
        this.setData({
          userInfo: data
        });
      });
  },

  /** 去消息 */
  toNotifications () {
    wx.navigateTo({
      url: '/pages/github/pages/notifications/notifications'
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
      url: '/pages/pUser/pages/favMovieList/index',
    })
  },

  /** 我喜欢的卡片 */
  toFavCards() {
    wx.navigateTo({
      url: '/pages/pUser/pages/favCards/index',
    })
  },

  /** 作出评价 */
  toEvalute () {
    wx.navigateTo({
      url: '/pages/github/pages/trending/trending'
    });
    // wx.navigateTo({
    //   url: '/pages/pUser/pages/evaluate/evaluate',
    // })
  },

  navigate (e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  }

})
