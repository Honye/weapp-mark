import { getEvents } from '../../../../apis/github';

Page({
  data: {
    _page: 1,
    _perPage: 20,
    events: []
  },

  onLoad (options) {
    this.getEventList();
  },

  async getEventList () {
    const { _page, _perPage } = this.data;
    const res = await getEvents({
      username: 'Honye',
      per_page: _perPage,
      page: _page
    });
    this.setData({
      events: res
    });
  }
});
