// 设置
import Storage from './../../utils/storage';

const app = getApp();
const templMsgId = 'sJz8Heo9GSqMwhnJFlpEHbm-rmIhUlhOkEOoSvY6BwE';

Page({

  data: {
    notice: true,
    storageSize: 0
  },

  onLoad (options) {
    const storageInfo = wx.getStorageInfoSync();
    wx.getSetting({
      withSubscriptions: true,
      success: ({ subscriptionsSetting = {} }) => {
        const { mainSwitch, itemSettings } = subscriptionsSetting;
        this.setData({
          notice: Boolean(mainSwitch && itemSettings && itemSettings[templMsgId]),
          storageSize: storageInfo.currentSize
        });
      }
    });
  },

  /**
   * 通知开关
   */
  async switchNotice (event) {
    const { value } = event.detail;
    let notice = false;
    if (value) {
      // case switch to subscribe message
      const subscription = await new Promise((resolve, reject) => {
        wx.requestSubscribeMessage({
          tmplIds: [templMsgId],
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      notice = subscription[templMsgId] === 'accept';
    }
    
    app.globalData.setting = { ...app.globalData.setting, notice };
    this.setData({ notice });
  },

  /**
   * 清除缓存
   */
  clearCache () {
    Storage.clear()
    wx.showToast({
      title: '已清除',
      icon: 'success'
    })
  }
})