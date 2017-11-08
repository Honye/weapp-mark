// pages/movies/movies.js
const inTheatersUrl = require('../../config').inTheatersUrl;

var app = getApp();
let pageNo = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    loadmore: true,
    movies: [],
    isGrid: app.globalData.setting.wantSeeLayout === 'grid'
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
    wx.request({
      url: inTheatersUrl,
      header: {
        "Content-Type": "json"
      },
      data: {
        apikey: '0b2bdeda43b5688921839c8ecb20399b',
        start: pageNo * 20
      },
      success: function (res) {
        wx.stopPullDownRefresh();
        let subjects = res.data.subjects;
        for(let item of subjects) {
          item.genres = item.genres.join('/')
        }
        if(pageNo == 0) {
          that.setData({
            loading: false,
            movies: subjects,
            loadmore: subjects.length >= 20
          });
        } else {
          that.setData({
            loading: false,
            movies: that.data.movies.concat(subjects),
            loadmore: subjects.length >= 20
          });
        }
      }
    })
  },

  bindViewTap: function(event) {
    if(app.globalData.config.hasPermission) {
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
    const wantSeeLayout = isGrid ? 'linear' : 'grid';
    wx.setStorage({
      key: 'setting',
      data: { ...app.globalData.setting, wantSeeLayout },
    })
    this.setData({ 
      isGrid: !isGrid
    }, () => {
      app.globalData.setting = { ...app.globalData.setting, wantSeeLayout };
    });
  }
})