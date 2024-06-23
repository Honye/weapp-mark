import { $wuxActionSheet } from '../../../../templates/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import wxCloud from '../../../../utils/wxCloud';

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    userInfo: {}
  },

  storeBindings: {
    store,
    fields: {
      info: () => store.user.info,
      douban: () => store.douban,
      thirdAuthor: () => {
        return {
          douban: {
            title: '豆瓣',
            authorized: !!(store.douban.accessToken)
          }
        }
      }
    },
    actions: {
      updateUserInfo: 'user/updateUserInfo'
    }
  },

  async onChooseAvatar(e) {
    const { data } = await wxCloud('login', {
      wxUserInfo: {
        data: e.detail
      },
    });
    store['user/updateUserInfo'](data);
  },

  async onNicknameConfirm(e) {
    const { value } = e.detail;
    const { data } = await wxCloud('login', {
      wxUserInfo: {
        data: { nickName: value }
      }
    });
    store['user/updateUserInfo'](data);
  },

  handleThirdSwitch (e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;
    switch (key) {
      case 'douban':
        this.handleDoubanSwitch(value);
        break;
    }
  },

  async handleDoubanSwitch(checked) {
    if (checked) {
      wx.navigateTo({
        url: '/packages/douban/pages/login-phone/login-phone',
      });
      return;
    }

    const { confirm } = await wx.showModal({
      title: '提示',
      content: '确定要退出豆瓣登录吗？（已经和微信关联的数据并不会丢失）',
      cancelText: '再想想',
      confirmText: '决定了',
      confirmColor: '#ffe200',
    });
    if (confirm) {
      await wxCloud('douban', { action: 'logout' });
      store['douban/logout']();
      return;
    }
    this.setData({
      'thirdAuthor.douban.authorized': this.data.thirdAuthor.douban.authorized,
    });
  },
})