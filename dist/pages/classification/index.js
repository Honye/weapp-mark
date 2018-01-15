// 分类查找
import { Honye } from './../../utils/apis.js';
import AV from './../../assets/libs/av-live-query-weapp-min.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classify: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchClassify()
  },

  /**
   * 获取数据
   */
  fetchClassify() {
    const that = this
    const query = new AV.Query('Classify')
    query.find().then(classify => {
      that.modifyData(classify)
    })
  },

  /**
   * 调整数据
   */
  modifyData(classify) {
    for (let item of classify) {
      if (item.get('children').length < 6) {
        for (let i = 0, length = (6 - item.get('children').length); i < length; i++) {
          item.get('children').push(" ");
        }
      } else if ((item.get('children').length - 6) % 4 !== 0) {
        for (let i = 0, length = (4 - (item.get('children').length - 6) % 4); i < length; i++) {
          item.get('children').push(" ");
        }
      }
    }
    this.setData({ classify });
  },

  toList(e) {
    const {item} = e.currentTarget.dataset;
    if(item!=" ") {
      wx.navigateTo({
        url: `/pages/article/list/list?title=${item}`,
      })
    }
  }
})