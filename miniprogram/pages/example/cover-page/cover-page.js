Page({
  data: {
    movielistList: []
  },

  /** 显示影单弹窗 */
  showMovieListPopup () {
    this.getMovielistList();
    this.selectComponent('#movielist').show();
  },

  /** 影单列表 */
  async getMovielistList () {
    const list = Array(10).fill({}).map((item, index) => ({
      id: index,
      title: '阳光掉进回忆里',
      cover: 'https://img1.doubanio.com/view/photo/m_ratio_poster/public/p1756402567.jpg',
      count: 10
    }));
    this.setData({
      movielistList: list
    });
  }
});
