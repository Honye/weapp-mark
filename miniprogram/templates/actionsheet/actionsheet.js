import Component from '../component'

export default {
	/**
	 * 默认参数
	 */
  setDefaults() {
    return {
      theme: `ios`,
      className: undefined,
      titleText: undefined,
      buttons: [],
      buttonClicked() {},
      cancelText: `取消`,
      cancel() {},
      // destructiveText: '删除', 
      // destructiveButtonClicked() {}, 
    }
  },

  /**
   * @typedef {Object} ButtonOption
   * @property {string} text - 按钮文字
   * @property {string} [className] - 按钮的类名
   * @property {'contact'|'share'|'getPhoneNumber'|'getUserInfo'|'launchApp'|'openSetting'|'feedback'} [openType] - 按钮的 open-type 属性
   */

	/**
	 * 上拉菜单组件
	 * @param {Object} opts 配置项
     * @param {String} opts.theme 菜单皮肤
	 * @param {String} opts.className 自定义类名
	 * @param {String} opts.titleText 标题
	 * @param {ButtonOption[]} opts.buttons 按钮
	 * @param {(index: number, button: ButtonOption) => void|boolean} opts.buttonClicked 按钮点击事件
	 * @param {(
   *  e: (WechatMiniprogram.ButtonGetUserInfo|WechatMiniprogram.ButtonGetPhoneNumber)&WechatMiniprogram.BaseEvent<,{index:number;}>,
   *  index: number,
   *  button: ButtonOption
   * ) => void|boolean} opts.bindGetOpenInfo open-type 响应事件
	 * @param {String} opts.cancelText 取消按钮的文本
	 * @param {Function} opts.cancel 取消按钮点击事件
	 * @param {String} opts.destructiveText 删除按钮的文本
	 * @param {Function} opts.destructiveButtonClicked 删除按钮点击事件
	 */
  show(opts = {}) {
    const options = Object.assign({
      animateCss: undefined,
      visible: !1,
    }, this.setDefaults(), opts)

    // 实例化组件
    const component = new Component({
      scope: `$wux.actionSheet`,
      data: options,
      methods: {
        /**
         * 隐藏
         */
        removeSheet(callback) {
          if (this.removed) return !1
          this.removed = !0
          this.setHidden([`weui-animate-slide-down`, `weui-animate-fade-out`])
          typeof callback === `function` && callback(options.buttons)
        },
        /**
         * 显示
         */
        showSheet() {
          if (this.removed) return !1
          this.setVisible([`weui-animate-slide-up`, `weui-animate-fade-in`])
        },
        /**
         * 按钮点击事件
         * @param {WechatMiniprogram.BaseEvent<, {index: number; }>} e
         */
        buttonClicked(e) {
          const index = e.currentTarget.dataset.index
          if (options.buttonClicked(index, options.buttons[index]) === true) {
            this.removeSheet()
          }
        },

        /**
         * @param {WechatMiniprogram.BaseEvent<,{ index: number; }>} e
         */
        bindGetOpenInfo (e) {
          const { index } = e.currentTarget.dataset;
          if (options.bindGetOpenInfo(e, index, options.buttons[index]) === true) {
            this.removeSheet();
          }
        },

        /**
         * 删除按钮点击事件
         */
        destructiveButtonClicked() {
          if (options.destructiveButtonClicked() === true) {
            this.removeSheet()
          }
        },
        /**
         * 取消按钮点击事件
         */
        cancel() {
          this.removeSheet(options.cancel)
        },
      },
    })

    component.showSheet()

    return component.cancel
  },
}