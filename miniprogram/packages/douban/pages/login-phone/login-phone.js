import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import { replayRequest, setLoginIng } from '../../../../apis/douban';
import { getCaptcha, verifyCaptcha } from '../../../../apis/douban/accounts';
import { apiSyncDouban } from '../../../../apis/vercel';
import { emitter, events } from '../../../../utils/events';

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    phone: '',
    code: '',
    captchaData: null,
    captcha: '',
  },

  storeBindings: {
    store,
    actions: {
      updateDouban: 'douban/update',
    },
  },

  onUnload() {
    setLoginIng(false);
  },

  async handlePhoneConfirm() {
    const { phone, captchaData, captcha } = this.data;
    const params = { number: phone };
    if (captchaData) {
      params.captcha_id = captchaData.captcha_id;
      params.captcha_solution = captcha;
    }
    await getCaptcha(params)
      .catch((err) => {
        if (err.message === 'captcha_required') {
          this.setData({
            captchaData: err.payload,
          });
        }
        wx.showToast({
          icon: 'none',
          title: err.description,
        });
        return Promise.reject(err);
      });
    wx.showToast({
      icon: 'none',
      title: '验证码已发送',
    });
  },

  async submit (e) {
    const { value } = e.detail;
    const params = {
      openid: store.user.info.openid,
      unionid: store.user.info.unionid,
      number: value.phone,
      code: value.code,
    };
    const { captchaData, captcha } = this.data;
    if (captchaData) {
      params.captcha_id = captchaData.captcha_id;
      params.captcha_solution = captcha;
    }

    const res = await verifyCaptcha(params)
      .catch((err) => {
        if (err.message === 'captcha_required') {
          this.setData({
            captchaData: err.payload,
          });
        }
        wx.showToast({
          icon: 'none',
          title: err.description,
        });
        return Promise.reject(err);
      });
      const { access_token, refresh_token, account_info } = res;
      const { openid, unionid } = store.user.info;
      apiSyncDouban({
        openid,
        unionid,
        account_info,
        access_token,
        refresh_token
      });
      this.updateDouban({
        accessToken: access_token,
        refreshToken: refresh_token,
        user: account_info,
      });
      replayRequest()
      emitter.emit(events.LOGIN_SUCCESS);
      wx.showToast({
        icon: 'none',
        title: '登录成功',
      });
      wx.navigateBack();
  },
});
