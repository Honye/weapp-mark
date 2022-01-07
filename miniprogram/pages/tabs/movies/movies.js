// pages/movies/movies.js
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../store/index';
import { $markDropmenu } from '../../../templates/index.js';
import { getUserInterests } from '../../../apis/douban.js';

var app = getApp();
let pageNo = 0;
const pageSize = 18;
Page({
  behaviors: [storeBindingsBehavior],

  scrollTop: 0,

  /** 页面的初始数据 */
  data: {
    /**
     * @type {Array<{
     *   key: import('../../../apis/douban.js').DouBan.InterestStatus;
     *   title: string;
     * }>}
     */
    tabs: [
      { key: 'mark', title: '想看' },
      { key: 'done', title: '已看' },
      { key: 'doing', title: '在看' }
    ],
    currentNav: 0,
    loading: true,
    loadmore: true,
    movies: [],
    total: 0,
    /** 可在线播放的数量 */
    linewatchCount: 0,
    isGrid: app.globalData.setting.wantSee?app.globalData.setting.wantSee.layout === 'grid':false,
    sortId: app.globalData.setting.wantSee ? app.globalData.setting.wantSee.sort : 'addTime',
    sticky: true
  },

  storeBindings: {
    store,
    fields: {
      douban: () => store.douban
    }
  },

  /** 生命周期函数--监听页面加载 */
  onLoad(options) {
    this.getMovies()
    this.setData({
      isGrid: app.globalData.setting.wantSee ? app.globalData.setting.wantSee.layout === 'grid' : false,
      sortId: app.globalData.setting.wantSee ? app.globalData.setting.wantSee.sort : 'addTime'
    })
    this.showDoubanTip();
  },

  onShow () {
    this.selectComponent('#tabBar').setData({ selected: 1 });
  },

  /** 页面隐藏 */
  onHide(options) {
    this.dropMenu && this.dropMenu();
  },

  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {
    pageNo = 0;
    this.getMovies()
  },

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {
    if(this.data.loadmore) {
      pageNo++;
      this.setData({
        loading: true
      });
      this.getMovies()
    }
  },

  showDoubanTip () {
    if (!store.douban.accessToken) {
      wx.showModal({
        title: '提示',
        content: '列表默认展示的是开发者的信息，可去个人中心登录豆瓣账号以展示自己的信息',
        confirmText: '立即登录',
        cancelText: '稍后登录',
        confirmColor: '#ffe200',
        success: ({ confirm }) => {
          if (confirm) {
            wx.navigateTo({
              url: '/packages/douban/pages/login/login'
            });
          }
        }
      });
    }
  },

  handleSwitchTab (e) {
    const { index, list } = e.detail;
    wx.switchTab({
      url: list[index].pagePath
    });
  },

  /** 正在上映的电影 */
  async getMovies () {
    const { tabs, currentNav, linewatchCount } = this.data;
    wx.showNavigationBarLoading();
    const res = await getUserInterests(
      store.douban.user?.id ?? '158948115',
      {
        type: 'movie',
        status: tabs[currentNav].key,
        start: pageNo * pageSize,
        count: pageSize
      }
    );
    wx.stopPullDownRefresh();
    const list = res.interests || [];
    const lineCount = list.filter((item) => item.subject && item.subject.has_linewatch).length;
    this.setData({
      loading: false,
      movies: pageNo ? [...this.data.movies, ...list] : list,
      total: res.total,
      linewatchCount: pageNo ? linewatchCount + lineCount : lineCount,
      loadmore: list.length >= pageSize
    });
    wx.hideNavigationBarLoading();
  },

  /** 改变 Tab */
  changeTab(e) {
    const { nav } = e.currentTarget.dataset;
    const { currentNav } = this.data;
    if (currentNav != nav) {
      pageNo = 0;
      wx.pageScrollTo({
        scrollTop: 0
      });
      this.setData({
        currentNav: nav
      }, () => {
        this.getMovies();
      });
    }
  },

  bindViewTap(event) {
    const { id, title, type } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/packages/movie/pages/details/details?title=${title}&id=${id}&type=${type}`,
    })
  },

  /** 改变布局方式 */
  changeLayout() {
    const { isGrid } = this.data;
    let { wantSee } = app.globalData.setting;
    wantSee = { ...wantSee, layout: isGrid ? 'linear' : 'grid'}
    wx.setStorage({
      key: 'setting',
      data: { ...app.globalData.setting, wantSee },
    })
    this.dropMenu && this.dropMenu(); // 如果排序菜单已打开则关闭
    this.setData({ 
      isGrid: !isGrid
    }, () => {
      app.globalData.setting = { ...app.globalData.setting, wantSee };
    });
  },

  /** 改变排序方式 */
  changeSort() {
    this.dropMenu = this.dropMenu ? this.dropMenu() : $markDropmenu.show({
      titleText: '',
      buttons: [
        { id:'addTime', title: '最近添加' },
        { id:'filmTime', title: '上映日期' },
        { id:'rating', title: '豆瓣评分' },
        { id:'filmName', title: '电影名称' },
      ],
      choosedId: this.data.sortId,
      onChange: (index, item) => {
        this.setData({
          sortId: item.id
        }, () => {
          let { wantSee } = app.globalData.setting;
          wantSee = { ...wantSee, sort: item.id };
          wx.setStorage({
            key: 'setting',
            data: { ...app.globalData.setting, wantSee },
          })
        })
        return true;
      },
      cancel: () => {
        this.dropMenu = null;
      }
    });
  },

  onPageScroll(e) {
    const { scrollTop } = e
    if (scrollTop < this.scrollTop && !this.data.sticky) {
      this.setData({
        sticky: true,
      })
    } else if (scrollTop > this.scrollTop && this.data.sticky) {
      this.setData({
        sticky: false,
      })
    }
    this.scrollTop = scrollTop
  },
})