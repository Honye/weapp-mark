import { getDetail, doneMovie, unmarkMovie } from '../../../../apis/douban.js';

Page({
  data: {
    movieID: '',
    type: 'movie',
    max: 5,
    rating: 0,
    date: (new Date()).toISOString().substring(0, 10)
  },

  /**
   * @param {object} options
   * @param {string} options.movieID
   * @param {'movie'|'tv'} [options.type = 'movie']
   */
  onLoad (options) {
    this.setData(Object.assign({}, { type: 'movie' }, options));
    this.getDetail(options.movieID, options.type);
  },

  async getDetail (movieID, type = 'movie') {
    const res = await getDetail({
      id: movieID,
      type
    });
    const interest = res.interest;
    if (interest) {
      this.setData({
        max: interest.rating.max,
        rating: interest.rating.value,
        date: interest.create_time.substr(0, 10)
      });
    }
  },

  async submit (e) {
    const { rating, date } = e.detail.value;
    const { movieID, type } = this.data;
    await doneMovie({
      type,
      movieID,
      rating,
      date
    });
    wx.navigateBack();
  },

  async deleteMark (e) {
    wx.showModal({
      title: '提醒',
      content: '确认删除标记吗？',
      confirmText: '删除',
      cancelText: '再想想',
      success: async ({ confirm }) => {
        if (confirm) {
          const { movieID, type } = this.data;
          wx.showLoading();
          await unmarkMovie({ movieID, type });
          wx.hideLoading();
          wx.navigateBack();
        }
      }
    });
  }
});
