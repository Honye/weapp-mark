let _compData = {
  '__lgpanel__.isHide': true,
  '__lgpanel__.phoneNum': '',
  '__lgpanel__.verifyCode': '',
  '__lgpanel__.verifyText': '获取验证码',
  '__lgpanel__.phoneClass': '',
  '__lgpanel__.vcodeClass': ''
}
let _compEvent = {
  __lgpanel_timer: null,
  __lgpanel_countDown: 60,
  __lgpanel_close: function () {
    clearInterval(this.__lgpanel_timer)
    this.__lgpanel_countDown = 60
    this.setData(_compData)
  },
  __lgpanel_sendCode: function () {
    if (this.__lgpanel_countDown < 60) {
      return
    }
    this.setData({
      '__lgpanel__.verifyText': this.__lgpanel_countDown + 's'
    })
    this.__lgpanel_timer = setInterval(() => {
      this.__lgpanel_countDown--
      if (this.__lgpanel_countDown <= 0) {
        clearInterval(this.__lgpanel_timer)
        this.__lgpanel_countDown = 60
        this.setData({
          '__lgpanel__.verifyText': '重新获取'
        })
        return
      }
      this.setData({
        '__lgpanel__.verifyText': this.__lgpanel_countDown + 's'
      })
    }, 1000)
    typeof this.loginPannel._configs.sendCode == "function" &&
      this.loginPannel._configs.sendCode()
  }
}
// 小程序最新版把原型链干掉了。。。换种写法
let loginPannel = {
  show: function (data) {
    this.__page.setData({ '__lgpanel__.isHide': false })
    if (data) {
      Object.assign(this._configs, data)
    }
  }
}
function LoginPannel() {
  // 定义组件的一些回调
  this._configs = {
    sendCode: null,
    closeCode: null,
    login: null
  }
  // 拿到当前页面对象
  let pages = getCurrentPages()
  let curPage = pages[pages.length - 1]
  // 把组件的事件“合并到”页面对象上
  Object.assign(curPage, _compEvent)
  this.__page = curPage
  Object.assign(curPage, loginPannel) // 小程序最新版把原型链干掉了。。。换种写法
  // 附加到page上，方便访问
  curPage.loginPannel = this
  // 把组件的数据“注入”到页面的data对象中
  curPage.setData(_compData)
  return this
}