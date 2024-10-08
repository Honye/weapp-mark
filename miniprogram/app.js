import { store } from './store/index';
import { compareVersions, isEmpty } from './utils/util';
import { apiAppInfo, apiWxLogin } from './apis/vercel';

wx.cloud.init({
  traceUser: true,
  env: 'dev-oucwt'
});

App({

  globalData: {
    userInfo: null,
    setting: {},
    config: null
  },

  onLaunch () {
    this.getSetting();
    this.getDefaultConfig();
    this.login();
  },

  /** 通过云函数直接登录 */
  async login () {
    const { code } = await new Promise((resolve, reject) => {
      wx.login({ success: resolve, fail: reject });
    });
    const data = await apiWxLogin({ code });
    this.globalData.userInfo = data;
    store['user/updateUserInfo'](data);
    if (data.access_token) {
      const { access_token, refresh_token, ...user } = data;
      store['douban/update']({
        accessToken: access_token,
        refreshToken: refresh_token,
        user
      });
    }
    if (data.douban) {
      const { access_token, refresh_token, ...user } = data.douban;
      store['douban/update']({
        accessToken: access_token,
        refreshToken: refresh_token,
        user
      });
    }
  },

  /**
   * 获取用户信息
   * 支持 callback 和 Promise
   * @param {function} cb (object:userInfo) => void
   */
  getUserInfo (cb) {
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        typeof cb === 'function' && cb(this.globalData.userInfo);
        resolve(this.globalData.userInfo);
      } else {
        wx.login({
          success: () => {
            wx.getUserInfo({
              success: res => {
                this.globalData.userInfo = res.userInfo
                typeof cb === 'function' && cb(this.globalData.userInfo)
                resolve(this.globalData.userInfo)
              }
            });
          }
        });
      }
    });
  },

  /** 从服务器获取默认配置 */
  async getDefaultConfig () {
    const appInfo = await apiAppInfo();
    store['app/update']({
      hasPublished: compareVersions(store.app.version, appInfo.version) <= 0,
      ...appInfo
    });
  },

  /** 退出登录 */
  logout (callback) {
    this.globalData.userInfo = null;
    callback && callback(this.globalData);
  },

  /** 获取本地设置 */
  getSetting (callback) {
    const { setting } = this.globalData;
    if (setting && (!isEmpty(setting))) {
      typeof callback == "function" && callback(setting);
    } else {
      wx.getStorage({
        key: 'setting',
        success: res => {
          this.globalData.setting = res.data;
          typeof callback == "function" && callback(res.data);
        }
      });
    }
  }
})
