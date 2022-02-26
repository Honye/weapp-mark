import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../store/index'
import { login } from '../../../../apis/douban.js'

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    username: '',
    password: '',
    captchaData: null,
    captcha: '',
  },

  storeBindings: {
    store,
    actions: {
      updateDouban: 'douban/update',
    },
  },

  handleInput (e) {
    const { name } = e.currentTarget.dataset
    const { value } = e.detail
    this.setData({
      [name]: value,
    })
  },

  async submit (e) {
    /**
     * @type {{
     *  value: {
     *    username: string;
     *    password: string;
     *  }
     * }}
     */
    const { value } = e.detail
    const { captchaData, captcha } = this.data
    const params = {
      name: value.username,
      password: value.password,
    }
    if (captchaData) {
      params.captcha_id = captchaData.captcha_id
      params.captcha_solution = captcha
    }
    try {
      const res = await login(params)
      const { access_token, refresh_token, account_info } = res.payload
      this.updateDouban({
        accessToken: access_token,
        refreshToken: refresh_token,
        user: account_info,
      })
      wx.showToast({
        icon: 'none',
        title: '登录成功',
      })
      wx.navigateBack()
    } catch (e) {
      wx.showToast({
        icon: 'none',
        title: e.description,
      })
      this.setData({
        captchaData: e.message === 'captcha_required' ? e.payload : '',
      })
    }
  }
})
