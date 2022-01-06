import { searchRepositories } from '../../../../apis/github';

Page({
  data: {
    keyword: '',
    result: [],
    _page: 1,
    _perPage: 20,
    hasMore: true,
    loading: false
  },

  onReachBottom () {
    const { loading, hasMore } = this.data;
    if (!loading && hasMore) {
      this.search();
    }
  },

  async search () {
    const { keyword } = this.data;
    if (!keyword) return;
    wx.showNavigationBarLoading();
    this.setData({ loading: true });
    const { result, _page, _perPage } = this.data;
    const ret = await searchRepositories({
      q: keyword,
      page: _page,
      per_page: _perPage
    });
    const items = ret.items;
    if (_page === 1) {
      wx.pageScrollTo({ scrollTop: 0 });
    }
    this.setData({
      result: _page === 1 ? items : [...result, ...items],
      hasMore: items.length >= _perPage,
      loading: false
    });
    this.data._page += 1;
    wx.hideNavigationBarLoading();
  },

  handleSearch (e) {
    this.data._page = 1;
    this.search();
  }
});
