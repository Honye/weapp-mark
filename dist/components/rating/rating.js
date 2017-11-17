// 组件-评分

Component({

  properties: {
    rating: {
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
    _handleTap: function (e) {
      if (this.data.disabled) return;
      const { max } = this.data;
      const { num } = e.currentTarget.dataset;
      this.setData({
        rating: max / 5 * num
      })
      this.triggerEvent('change', { value: max / 5 * num }, e);
    }
  }

})