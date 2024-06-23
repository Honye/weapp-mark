import { getPhotos } from '../../../../apis/douban.js';

Page({
  data: {
    id: '',
    type: 'movie',
    /** @type {import('../../../../apis/douban.js').DouBan.Photo[]} */
    photos: [],
    start: 0,
    count: 24
  },

  /**
   * 
   * @param {object} options
   * @param {string} options.id 影视类目ID
   * @param {string} [options.title] 影视类目名
   * @param {'movie'|'tv'} [options.type = 'movie']
   */
  onLoad (options) {
    options = Object.assign({}, { type: 'movie' }, options);
    this.data.id = options.id;
    this.data.type = options.type;
    if (options.title) {
      wx.setNavigationBarTitle({
        title: `《${options.title}》的剧照`
      });
    }
    this.getPhotoList();
    wx.createInterstitialAd({ adUnitId: 'adunit-56316cd90de2e91c' }).show();
  },

  onReachBottom () {
    const { count } = this.data;
    this.data.start += count;
    this.getPhotoList();
  },

  async getPhotoList () {
    const { id, type, start, count, photos } = this.data;
    const res = await getPhotos({
      id,
      start,
      count,
      type
    });
    const list = res.photos || [];
    this.setData({
      photos: start ? [...photos, ...list] : list
    });
    const _count = res.count;
    if (start === 0 && _count < count) {
      this.onReachBottom();
    }
  },

  handlePreview (e) {
    /**
     * @type {{ index: number }}
     */
    const { index } = e.currentTarget.dataset;
    const { photos } = this.data;
    const url = photos[index].image.large.url;
    wx.previewImage({
      urls: [url],
      current: url
    });
  }
});
