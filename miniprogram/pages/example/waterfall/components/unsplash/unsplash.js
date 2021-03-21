Component({
  properties: {
    data: {
      type: Object,
      value: null
    }
  },

  data: {
    text: ''
  },

  lifetimes: {
    attached () {
      this.setData({
        text: Array(Number.parseInt(20 * Math.random() + 1)).fill('军').join('')
      });
    },
  },

  methods: {
    handleImgLoad (e) {
      this.createSelectorQuery()
        .select('.unsplash')
        .boundingClientRect((res) => {
          this.triggerEvent('load', res);
        })
        .exec();
    }
  }
});
