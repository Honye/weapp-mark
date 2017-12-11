// pages/movies/movies.js
import { $markDropmenu } from '../common/index.js';
import { Douban } from './../../utils/apis.js';

var app = getApp();
let pageNo = 0;
const pageSize = 18;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    loadmore: true,
    movies: [],
    isGrid: app.globalData.setting.wantSee?app.globalData.setting.wantSee.layout === 'grid':false,
    sortId: app.globalData.setting.wantSee ? app.globalData.setting.wantSee.sort : 'addTime'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovies()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    pageNo = 0;
    this.getMovies()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.loadmore) {
      pageNo++;
      this.setData({
        loading: true
      });
      this.getMovies()
    }
  },

  /**
   * 正在上映的电影
   */
  getMovies: function() {
    let that = this;
    Douban.get(
      Douban.IN_THEATERS,
      {
        start: pageNo * pageSize,
        count: pageSize
      }
    ).then(res => {
      wx.stopPullDownRefresh();
      let subjects = res.subjects;
      for (let item of subjects) {
        item.genres = item.genres.join('/')
      }
      if (pageNo == 0) {
        that.setData({
          loading: false,
          movies: subjects,
          loadmore: subjects.length >= pageSize
        });
      } else {
        that.setData({
          loading: false,
          movies: that.data.movies.concat(subjects),
          loadmore: subjects.length >= pageSize
        });
      }
    })
  },

  bindViewTap: function(event) {
    const { version, config } = app.globalData;
    if(version.versionCode <= config.newestVersion) {
      const { id, title } = event.currentTarget.dataset;
      wx.navigateTo({
        url: `./movieDetails?title=${title}&id=${id}`,
      })
    }
  },

  /**
   * 改变布局方式
   */
  changeLayout: function() {
    const { isGrid } = this.data;
    let { wantSee } = app.globalData.setting;
    wantSee = { ...wantSee, layout: isGrid ? 'linear' : 'grid'}
    wx.setStorage({
      key: 'setting',
      data: { ...app.globalData.setting, wantSee },
    })
    this.setData({ 
      isGrid: !isGrid
    }, () => {
      app.globalData.setting = { ...app.globalData.setting, wantSee };
    });
  },

  changeSort() {
    const that = this;
    that.dropMenu = that.dropMenu ? that.dropMenu() : $markDropmenu.show({
      titleText: '',
      buttons: [
        { id:'addTime', title: '最近添加' },
        { id:'filmTime', title: '上映日期' },
        { id:'rating', title: '豆瓣评分' },
        { id:'filmName', title: '电影名称' },
      ],
      choosedId: that.data.sortId,
      onChange(index, item) {
        this.setData({
          sortId: item.id
        },()=>{
          let { wantSee } = app.globalData.setting;
          wantSee = {...wantSee, sort: item.id};
          wx.setStorage({
            key: 'setting',
            data: { ...app.globalData.setting, wantSee },
          })

        })
        return true;
      },
      cancel() {
        that.dropMenu = null;
      }
    })
  }
})