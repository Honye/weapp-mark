//app.js
import { store } from './store/index';
import { Honye } from './utils/apis'
import { isEmpty } from './utils/util'
import wxCloud from './utils/wxCloud';

/**
 * 主要用来提供两版显示
 * 本地版本号大于服务端版本号代表未发布，简版显示应对审核
 * 本地版本号小余等于服务端版本号代表已发布
 */
const version = {
    versionCode: 10,
    versionName: '1.0.6(10)',
}

wx.cloud.init({
    traceUser: true,
    env: 'dev-oucwt',
})

wx.customModal = function(args) {
  wx.showModal({
    confirmColor: '#FFE200',
    ...args,
  })
}

App({

    globalData: {
        version,
        userInfo: null,
        setting: {},
        config: null,
        published: false, // 是否为发布版
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
        store.user.updateUserInfo(data);
    },

    /**
     * 获取用户信息
     * 支持 callback 和 Promise
     * @param {function} cb (object:userInfo) => void
     */
    getUserInfo(cb) {
        return new Promise((resolve, reject) => {
            if (this.globalData.userInfo) {
                typeof cb === 'function' && cb(this.globalData.userInfo)
                resolve(this.globalData.userInfo)
            } else {
                wx.login({
                    success: () => {
                        wx.getUserInfo({
                            success: res => {
                                this.globalData.userInfo = res.userInfo
                                typeof cb === 'function' && cb(this.globalData.userInfo)
                                resolve(this.globalData.userInfo)
                            }
                        })
                    }
                })
            }
        })
    },

    /** 从服务器获取默认配置 */
    getDefaultConfig(callback) {
        return new Promise((resolve, reject) => {
            if (this.globalData.config) {
                typeof callback === 'function' && callback(this.globalData.config)
                resolve(this.globalData.config)
            } else {
                Honye.get(Honye.CONFIG)
                    .then(res => {
                        this.globalData.config = res
                        this.globalData.published = version.versionCode <= res.newestVersion
                        typeof callback === 'function' && callback(res)
                        resolve(res)
                    })
            }
        })
    },

    /**
     * 是否已经发布
     * @param {Function} callback 回调返回 Boolean 结果
     */
    hasPublished(callback) {
        if (this.globalData.config) {
            typeof callback == "function" &&
                callback(this.globalData.published)
        } else {
            this.getDefaultConfig((res) => {
                const published = version.versionCode <= res.newestVersion
                typeof callback == "function" &&
                    callback(published)
            })
        }
    },

    /** 退出登录 */
    logout(callback) {
        this.globalData.userInfo = null
        callback && callback(this.globalData)
    },

    /** 获取本地设置 */
    getSetting(callback) {
        const { setting } = this.globalData
        if (setting && (!isEmpty(setting))) {
            typeof callback == "function" && callback(setting)
        } else {
            wx.getStorage({
                key: 'setting',
                success: res => {
                    this.globalData.setting = res.data
                    typeof callback == "function" && callback(res.data)
                }
            })
        }
    },
})