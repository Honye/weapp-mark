// pages/intheaters/in_theaters.js
import { getShowingMovies, getSoonMovies } from '../../../../apis/douban.js';

let pageNo1 = 0;
let pageNo2 = 0;

Page({

  data: {
    tabs: ['热映', '待映'],
    currentNav: 0,
    loading: true,
    loadmore1: true,
    loadmore2: true,
    movies: [],
    commingMovies: [],
  },

  onLoad (options) {
    this.getInTheater();
  },

  onUnload () {
    pageNo1 = 0;
    pageNo2 = 0;
  },

  /** 影院热映 */
  async getInTheater () {
    const res = await getShowingMovies({
      start: pageNo1 * 20,
      count: 20
    });
    const items = (res.subject_collection_items || []).map((subject) => ({
      cover_url: subject.cover.url,
      ...subject
    }));
    this.setData({
      movies: pageNo1 === 0 ? items : [...this.data.movies, ...items],
      loadmore1: items.length >= 20,
      loading1: false
    });
  },

  /** Swiper页发生变化 */
  onSwiperChange (e) {
    const { current } = e.detail;
    this.setData({
      currentNav: current
    });
    if (this.data.commingMovies.length <= 0) {
      this.getComming();
    }
  },

  /** 点击改变Swiper */
  changeSwiper (e) {
    const { nav } = e.currentTarget.dataset;
    const { currentNav } = this.data;
    if (currentNav != nav) {
      this.setData({
        currentNav: nav
      });
    }
  },

  /** 进入详情 */
  toDetail (event) {
    const { id, title } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/packages/movie/pages/details/details?title=${title}&id=${id}`,
    })
  },

  /** 即将上映 */
  async getComming () {
    const res = await getSoonMovies({
      start: pageNo2 * 20,
      count: 20
    });
    const items = (res.subject_collection_items || []).map((subject) => ({
      cover_url: subject.cover.url,
      ...subject
    }));
    this.setData({
      commingMovies: pageNo2 === 0 ? items : [...this.data.commingMovies, ...items],
      loadmore2: items.length >= 20,
      loading2: false
    });
  },

  /**
   * Scroll触底事件
   */
  onScrolTolLower (e) {
    const { nav } = e.currentTarget.dataset;
    if (nav == 'comming' && this.data.loadmore2 && !this.data.loading2) {
      this.setData({ loading2: true });
      pageNo2++;
      this.getComming();
    } else if (nav == 'theater' && this.data.loadmore1 && !this.data.loading1) {
      this.setData({ loading1: true });
      pageNo1++;
      this.getInTheater();
    }
  },

  onShareAppMessage () {
    // enable share
  }
})