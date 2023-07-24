import { fetchCategories, fetchListByCategory } from '../../apis/wallpaper/index'

Component({
  data: {
    categories: null,
    wallpapers: [],
    cid: '6',
    start: 0,
    loading: false,
    hasMore: true
  },

  attached() {
    this.getCategories()
    this.getWallpapers()
  },

  methods: {
    async getCategories() {
      const res = await fetchCategories()
      this.setData({
        categories: res.data
      })
    },
    async getWallpapers() {
      const { cid, start, wallpapers } = this.data
      this.setData({ loading: true })
      const res = await fetchListByCategory({ cid, start })
        .finally(() => {
          this.setData({ loading: false })
        })
      const list = res.data || []
      this.setData({
        wallpapers: start > 0 ? [...wallpapers, ...list] : list,
        start: start + 20,
        hasMore: list.length >= 20
      })
    },
    onCategoryTap(e) {
      const { item } = e.currentTarget.dataset
      Object.assign(this.data, {
        cid: item.id,
        start: 0
      })
      this.getWallpapers()
    },
    onImgTap(e) {
      const { item } = e.currentTarget.dataset
      wx.previewImage({
        urls: [item.url]
      })
    },

    onLoadMore() {
      this.getWallpapers()
    }
  }
})
