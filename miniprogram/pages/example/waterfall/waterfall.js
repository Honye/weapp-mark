Page({
  data: {
    list: []
  },

  onLoad () {
    this.setupList();
  },

  async setupList () {
    const list = Array(15).fill({});
    const promises = [];
    for (let i = 0; i < list.length; ++i) {
      const url =`https://source.unsplash.com/featured?${i}`;
      promises.push(new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: url,
          success: (res) => {
            resolve({
              image: {
                url: res.path,
                type: res.type,
                width: res.width,
                height: res.height
              },
              width: 0,
              height: 0
            });
          },
          fail: err => reject(err)
        });
      }));
    }
    Promise.all(promises)
      .then((list) => {
        this.setData({
          list
        });
      });
  },

  handleImgLoad (e) {
    const { width, height } = e.detail;
    const { index } = e.currentTarget.dataset;
    this.setData({
      [`list[${index}].width`]: width,
      [`list[${index}].height`]: height
    });
  },

  handlePreview (e) {
    const { url } = e.currentTarget.dataset;
    wx.previewImage({
      urls: [url],
      current: url
    });
  }
});
