import { $wuxActionSheet } from '../../../../templates/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import wxCloud from '../../../../utils/wxCloud';
import { rUploadAvatar } from '../../../../apis/server';

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    userInfo: {},
    modalGitHubVisible: false,
    githubToken: ''
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
          },
          github: {
            title: 'GitHub',
            authorized: !!(store.user.info && store.user.info.githubToken)
          }
        }
      }
    },
    actions: {
      updateUserInfo: 'user/updateUserInfo'
    }
  },

  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    const base64 = wx.getFileSystemManager().readFileSync(avatarUrl, 'base64');
    console.log(base64)
    const url = await rUploadAvatar({
      filename: this.data.info.openid,
      base64
    })
    const { data } = await wxCloud('login', {
      wxUserInfo: {
        data: { avatarUrl: url }
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
      case 'github':
        this.handleGitHubSwitch(value);
        break;
      case 'douban':
        this.handleDoubanSwitch(value);
        break;
    }
  },

  handleGitHubSwitch (value) {
    if (value) {
      this.setData({
        modalGitHubVisible: value
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定要移除 GitHub 授权？（已经和微信关联的数据并不会丢失）',
      cancelText: '再想想',
      confirmText: '决定了',
      confirmColor: '#ffe200',
      success: async ({ confirm }) => {
        if (confirm) {
          const resp = await wxCloud('github', {
            action: 'removeAccessToken',
          });
          if (resp.code === 0) {
            wx.showToast({
              icon: 'none',
              title: '已成功移除 GitHub 授权'
            });
            this.setData({
              'thirdAuthor.github.authorized': false
            });
            this.data.info.githubToken = null;
            this.updateUserInfo(this.data.info);
            return;
          }
          return;
        }
        // 再想想
        this.setData({
          'thirdAuthor.github.authorized': this.data.thirdAuthor.github.authorized
        });
      }
    });
  },

  handleModalGitHubClose () {
    this.setData({
      modalGitHubVisible: false,
      githubToken: '',
      'thirdAuthor.github.authorized': this.data.thirdAuthor.github.authorized
    });
  },

  async handleBindGitHub () {
    const { githubToken } = this.data;
    try {
      const res = await wxCloud('github', {
        action: 'setAccessToken',
        data: {
          token: githubToken
        }
      });
      if (res.code !== 0) {
        wx.showToast({
          icon: 'none',
          title: res.message
        });
        return;
      }
      wx.showToast({
        icon: 'none',
        title: '设置成功，可使用 GitHub 功能了'
      });
      this.setData({
        modalGitHubVisible: false,
        'thirdAuthor.github.authorized': true
      });
      this.data.info.githubToken = githubToken;
      this.updateUserInfo(this.data.info);
    } catch (err) {
      this.setData({
        modalGitHubVisible: false,
        'thirdAuthor.github.authorized': false
      });
    }
  },

  async handleDoubanSwitch(checked) {
    if (checked) {
      wx.navigateTo({
        url: '/packages/douban/pages/login/login',
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