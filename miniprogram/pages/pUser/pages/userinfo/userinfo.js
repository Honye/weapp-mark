// pages/userinfo/userinfo.js
import { $wuxActionSheet } from '../../../common/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import wxCloud from '../../../../utils/wxCloud';

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    userInfo: {},
    phone: '13125368636',
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
          qq: {
            title: 'QQ',
            authorized: false
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

  showActionSheet () {
    $wuxActionSheet.show({
      theme: 'wx',
      buttons: [
        { text: '拍照' },
        { text: '从相册中选取' },
      ],
      buttonClicked: (index, item) => {
        wx.chooseImage({
          count: 1,
          sourceType: index===0 ? ['camera'] : ['album'],
          success: (res) => {
            const { userInfo } = this.data;
            this.setData({
              userInfo: { ...userInfo, avatarUrl: res.tempFilePaths[0] }
            })
          },
        })
        return true;
      }
    })
  },

  handleThirdSwitch (e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;
    switch (key) {
      case 'github':
        this.handleGitHubSwitch(value);
        break;
      case 'douban':
        wx.navigateTo({
          url: '/pages/douban/pages/login/login'
        });
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
  }
})