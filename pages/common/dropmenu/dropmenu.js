import Component from '../component';

export default {

  setDefaults() {
    return {
      className: undefined,
      buttons: [],
      choosedId: undefined,
      onChange(){},
      cancel() {}
    }
  },

  show(opts={}) {
    const options = Object.assign({
      animateCss: undefined,
      visible: !1,
    }, this.setDefaults(), opts, {
      choosedId: opts.choosedId || opts.buttons[0].id
    })

    const component = new Component({
      scope: `$mark.dropMenu`,
      data: options,
      methods: {
        /**
         * 隐藏
         */
        removeShare(callback) {
          if(this.removed) return !1
          this.removed = !0
          this.setHidden([`weui-animate-drop-up`, `weui-animate-fade-out`])
          typeof callback === `function` && callback(options.buttons)
        },
        /**
         * 显示
         */
        showShare() {
          if(this.removed) return !1
          this.setVisible([`weui-animate-drop-down`, `weui-animate-fade-in`])
        },
        /**
         * 按钮点击事件
         */
        onChange(e) {
          const {index} = e.currentTarget.dataset
          if (options.onChange(index, options.buttons[index])===true) {
            this.cancel()
          }
        },
        /**
         * 取消
         */
        cancel() {
          this.removeShare(options.cancel)
          return null;
        },
      },
    })

    component.showShare()

    return component.cancel
  },

}