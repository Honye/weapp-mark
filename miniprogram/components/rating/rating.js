// 组件-评分

Component({
  behaviors: ['wx://form-field'],

  options: {
    addGlobalClass: true
  },

  properties: {
    value: {
      type: Number,
      value: 10
    },
    max: {
      type: Number,
      value: 5
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    _handleTap (e) {
      if (this.data.disabled) return;
      const { max } = this.data;
      const { num } = e.currentTarget.dataset;
      const value = max / 5 * num;
      this.setData({ value });
      this.triggerEvent('change', { value }, e);
    }
  }

})