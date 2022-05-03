import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../store/index'
import { getCaptcha, verifyCaptcha } from '../../../../apis/douban'

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

  async handlePhoneConfirm() {
    const { phone, captchaData, captcha } = this.data
    const params = { number: phone }
    if (captchaData) {
      params.captcha_id = captchaData.captcha_id
      params.captcha_solution = captcha
    }
    const { message, description, payload } = await getCaptcha(params)
    if (message === 'captcha_required') {
      this.setData({
        captchaData: payload,
      })
      wx.showToast({
        icon: 'none',
        title: description,
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '验证码已发送',
      })
    }
  },

  async submit (e) {
    const { value } = e.detail
    
      const params = {
        number: value.phone,
        code: value.code,
      }
      const res = await verifyCaptcha(params)
        .catch((err) => {
          wx.showToast({
            icon: 'none',
            title: err.description,
          })
          return Promise.reject(err)
        })
      const { access_token, refresh_token, account_info } = res
      this.updateDouban({
        accessToken: access_token,
        refreshToken: refresh_token,
        user: account_info,
      })
      wx.showToast({
        icon: 'none',
        title: '登录成功',
      })
      wx.navigateBack({ delta: 2 })
    
  }
})
