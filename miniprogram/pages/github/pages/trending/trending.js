import wxCloud from '../../../../utils/wxCloud';

Page({
  data: {
    list: []
  },

  onLoad () {
    this.getTrendingList();
  },

  async getTrendingList () {
    const res = await wxCloud('trending');
    this.setData({
      list: res
    });
  }
});
