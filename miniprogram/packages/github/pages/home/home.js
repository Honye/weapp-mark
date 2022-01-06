Page({
  data: {
    pages: [
      {
        "text": "News",
        "iconPath": "/assets/images/github/tab-news.svg",
        "selectedIconPath": "/assets/images/github/tab-news-selected.svg",
        "component": "page-events",
        "attached": false
      },
      {
        "text": "Expore",
        "iconPath": "/assets/images/github/tab-explore.svg",
        "selectedIconPath": "/assets/images/github/tab-explore-selected.svg",
        "component": "page-trending",
        "attached": false
      },
      {
        "text": "User",
        "iconPath": "/assets/images/github/tab-user.svg",
        "selectedIconPath": "/assets/images/github/tab-user-selected.svg",
        "component": "page-user",
        "attached": false
      }
    ],
    current: 0,
    duration: 300
  },

  onLoad (options) {
    this.lazyLoadComponent();
  },

  lazyLoadComponent () {
    const { current, pages } = this.data;
    const currentComponent = pages[current];
    if (!currentComponent.attached) {
      this.setData({
        [`pages[${current}].attached`]: true
      });
    }
  },

  handleSwiperChange (e) {
    /**
     * @type {{
     * current: number;
     * }}
     */
    const { current } = e.detail;
    this.setData({
      current
    }, () => this.lazyLoadComponent());
  },

  switchTab (e) {
    /**
     * @type {{
     * index: number;
     * }}
     */
    const { index } = e.detail;
    this.setData({
      duration: 0
    }, () => {
      this.setData({
        current: index
      }, () => this.lazyLoadComponent());
    });
  },

  handleSwipeFinish (e) {
    this.setData({
      duration: 500
    });
  }
});
