Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    data: {
      type: Object,
      value: null
    },
    indexes: {
      type: Array,
      value: []
    }
  },

  data: {
    stared: false
  },

  observers: {
    data (data) {
      this.setData({
        stared: !!data?.stared
      });
    }
  },

  methods: {
    handleStar () {
      const { data, stared, indexes } = this.data;
      const value = !stared;
      data.stared = value;
      this.setData({
        stared: value
      });

      const pages = getCurrentPages() || [];
      const page = pages[pages.length - 1];
      page?.onLangStar?.({
        detail: {
          value: { data, stared: value, indexes }
        }
      });
    }
  }
});
