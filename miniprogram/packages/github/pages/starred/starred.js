import * as GitHubApis from '../../../../apis/github';

Page({
  options: {
    pureDataPattern: /^_/
  },

  data: {
    list: [],
    _page: 1,
    loading: false,
    hasMore: true
  },

  onLoad () {
    this.getStarredList();
  },

  onReachBottom () {
    this.getStarredList();
  },

  async getStarredList () {
    wx.showNavigationBarLoading();
    this.setData({ loading: true });
    const perPage = 15;
    const { _page, list } = this.data;
    const resp = await GitHubApis.getStarredList({
      sort: 'created',
      direction: 'desc',
      per_page: perPage,
      page: _page
    });
    this.setData({
      list: _page === 1 ? resp : [...list, ...resp],
      _page: _page + 1,
      hasMore: (resp || []).length >= perPage,
      loading: false
    });
    wx.hideNavigationBarLoading();
  }
});
