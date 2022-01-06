import { getCollectionList } from '../../../../apis/douban.js'

Page({
  data: {
    _type: '',
    _page: 1,
    _perPage: 20,
    collection: null,
    list: [],
    total: 0,
    hasMore: true,
    loading: false,
  },

  /**
   * 
   * @param {object} options
   * @param {string} options.type
   */
  onLoad (options) {
    this.data._type = options.type
    this.getList()
  },

  async getList () {
    const { _type, _page, _perPage, list } = this.data
    this.setData({ loading: true })
    wx.showNavigationBarLoading()
    const res = await getCollectionList({
      type: _type,
      start: _perPage * (_page - 1),
      count: _perPage,
    })
    const collection = res.subject_collection
    const _list = res.subject_collection_items || []
    this.data._page += 1
    wx.setNavigationBarTitle({
      title: collection.title,
    })
    this.setData({
      collection: collection,
      loading: false,
      list: _page > 1 ? [...list, ..._list] : _list,
      total: res.total,
      hasMore: _page * _perPage < res.total,
    })
    wx.hideNavigationBarLoading()
  },

  onReachBottom () {
    const { loading, hasMore } = this.data
    if (!loading && hasMore) {
      this.getList()
    }
  },

  handleMovieTap (e) {
    const { item } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/packages/movie/pages/details/details?id=${item.id}&type=${item.type}&title=${item.title}`,
    })
  }
})
