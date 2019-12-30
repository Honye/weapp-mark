// 分类查找
import wxCloud from '../../../../utils/wxCloud'

Page({

  data: {
    categories: [],
    loaded: false,
  },

  onLoad(options) {
    this.getData()
  },

  /**
   * 获取数据
   */
  getData() {
    wxCloud('getCategories')
      .then(({ data = [] }) => {
        this.modifyData(data)
      })
  },

  /**
   * 调整数据
   */
  modifyData(categories) {
    for (let item of categories) {
      if (item.children.length < 6) {
        for (let i = 0, length = (6 - item.children.length); i < length; i++) {
          item.children.push(" ");
        }
      } else if ((item.children.length - 6) % 4 !== 0) {
        for (let i = 0, length = (4 - (item.children.length - 6) % 4); i < length; i++) {
          item.children.push(" ");
        }
      }
    }
    this.setData({
      categories,
      loaded: true
    });
  },

  toList(e) {
    const {item} = e.currentTarget.dataset;
    if(item!=" ") {
      wx.navigateTo({
        url: `/pages/pArticle/pages/list/list?title=${item.name}`,
      })
    }
  }
})