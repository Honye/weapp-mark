export default {
  /** @type {UserInfo} */
  info: null,

  updateUserInfo (userInfo) {
    this.info = userInfo;
  }
}

/**
 * @typedef {{
 * avatarUrl?: string;
 * gender: 0|1;
 * nickName?: string;
 * oepnid: string;
 * unionid: string;
 * }} UserInfo
 */
