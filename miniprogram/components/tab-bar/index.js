Component({
  properties: {
    selected: {
      type: Number,
      value: 0
    },
    placeholder: {
      type: Boolean,
      value: false
    }
  },

  data: {
    list: [
      {
        "pagePath": "/pages/tabs/discovery/discovery",
        "text": "发现",
        "iconPath": "/assets/images/tabbar/tabbar_discovery.png",
        "selectedIconPath": "/assets/images/tabbar/tabbar_discovery_selected.png"
      },
      {
        "pagePath": "/pages/tabs/movies/movies",
        "text": "清单",
        "iconPath": "/assets/images/tabbar/tabbar_list.png",
        "selectedIconPath": "/assets/images/tabbar/tabbar_list_selected.png"
      },
      {
        "pagePath": "/pages/tabs/index/index",
        "text": "我的",
        "iconPath": "/assets/images/tabbar/tabbar_mine.png",
        "selectedIconPath": "/assets/images/tabbar/tabbar_mine_selected.png"
      }
    ],
  },

  methods: {
    handleSwitchTab (e) {
      /** @type {{ index: number }} */
      const { index } = e.currentTarget.dataset;
      const { list } = this.data;
      this.setData({ selected: index });
      this.triggerEvent('change', { index, list });
    }
  }
});
