import { observable, action } from 'mobx-miniprogram';

export const store = observable({
  info: null,

  get avatar () {
    let ret;
    if (this.info && this.info.avatarUrl) {
      wx.getImageInfo({
        src: this.info.avatarUrl,
        success ({ path }) {
          ret = path;
        }
      });
    }
    return ret;
  },

  updateUserInfo: action(function (userInfo) {
    this.info = userInfo;
  })
});