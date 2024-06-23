import { fetchCategories, fetchListByCategory } from '../../apis/wallpaper/index'

Component({
  data: {
    categories: null,
    wallpapers: [],
    lid: 357,
    page: 1,
    loading: false,
    hasMore: true
  },

  attached() {
    this.getCategories()
    this.getWallpapers()
  },

  methods: {
    onLoad() {
      wx.createInterstitialAd({ adUnitId: 'adunit-56316cd90de2e91c' }).show();
    },
    async getCategories() {
      const res = await fetchCategories()
      this.setData({
        categories: res
      })
    },
    async getWallpapers() {
      const { lid, page, wallpapers } = this.data
      this.setData({ loading: true })
      const res = await fetchListByCategory({ lid, page, size: 19 })
        .finally(() => {
          this.setData({ loading: false })
        })
      const list = res.list || []
      const i = parseInt(Math.random() * 20)
      list.splice(i, 0, { type: 'ad', id: `ad-${page}` });
      this.setData({
        wallpapers: page > 1 ? [...wallpapers, ...list] : list,
        page: page + 1,
        hasMore: res.has_more
      })
    },
    onCategoryTap(e) {
      const { item } = e.currentTarget.dataset
      Object.assign(this.data, {
        lid: item.id,
        page: 1
      })
      this.getWallpapers()
    },
    onImgTap(e) {
      const { item } = e.currentTarget.dataset
      wx.previewImage({
        urls: [item.img]
      })
    },

    onLoadMore() {
      this.getWallpapers()
    }
  }
})
