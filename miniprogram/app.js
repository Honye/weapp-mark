//app.js
import { store } from './store/index';
import { compareVersions, isEmpty } from './utils/util';
import wxCloud from './utils/wxCloud';

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
    const { data } = await wxCloud('login');
    this.globalData.userInfo = data;
    store['user/updateUserInfo'](data);
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
    const appDesc = await wxCloud('app');
    store['app/update']({
      hasPublished: compareVersions(store.app.version, appDesc.version) <= 0
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
