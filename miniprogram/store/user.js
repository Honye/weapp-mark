import { action } from 'mobx-miniprogram';

export default {
  info: null,

  updateUserInfo: action(function (userInfo) {
    this.info = userInfo;
  })
}