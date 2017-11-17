import Component from '../component';

export default {

  setDefaults() {
    return {
      className: undefined,
      titleText: undefined,
      buttons: [],
      buttonClicked(){},
      cancelText: `取消`,
      cancel() {}
    }
  },

  show(opts={}) {
    const options = Object.assign({
      animateCss: undefined,
      visible: !1,
    }, this.setDefaults(), opts)

    const component = new Component({
      scope: `$mark.share`,
      data: options,
      methods: {
        /**
         * 隐藏
         */
        removeShare(callback) {
          if(this.removed) return !1
          this.removed = !0
          this.setHidden([`weui-animate-slide-down`, `weui-animate-fade-out`])
          typeof callback === `function` && callback(options.buttons)
        },
        /**
         * 显示
         */
        showShare() {
          if(this.removed) return !1
          this.setVisible([`weui-animate-slide-up`, `weui-animate-fade-in`])
        },
        /**
         * 按钮点击事件
         */
        buttonClicked(e) {
          const {index} = e.currentTarget.dataset
          if(options.buttonClicked(index, options.buttons[index])===true) {
            this.removeShare()
          }
        },
        /**
         * 取消按钮点击事件
         */
        cancel() {
          this.removeShare(options.cancel)
        },
      },
    })

    component.showShare()

    return component.cancel
  },

}