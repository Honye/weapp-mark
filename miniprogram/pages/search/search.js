// pages/search/search.js
import { search } from '../../apis/douban.js';

const count = 20;  // 每页加载数据数目
Page({

  /** 页面的初始数据 */
  data: {
    inputVal: "",
    paragraph: '&emsp;人生就是一列开往坟墓的列车，路途上会有很多站，很难有人可以自始至终陪着走完。当陪你的人下车时，即使不舍也该心存感激，然后挥手道别。',
    result: null,
    loading: false,
    pageNo: 0,
    hasMore: true,
    history: [],
    hot: ['复仇者联盟4', '我们与恶的距离', '黑豹'],
  },

  onLoad(options) {
    const history = wx.getStorageSync('search_history') || []
    this.setData({
      history,
    })
  },

  clearInput() {
    this.setData({
      inputVal: "",
      result: null
    });
  },

  inputTyping(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /** 用户确认搜索 */
  inputConfirm() {
    const { inputVal } = this.data;
    if(inputVal.indexOf('hy:')===0) {
      this.hiddenCommand()
    } else {
      this.setData({
        scrollTop: 0,
        pageNo: 0,
        hasMore: true
      }, () => {
        this.searchMovie()
      })
    }
  },

  /** 搜索 */
  async searchMovie (e) {
    const { inputVal, pageNo, result } = this.data
    this.setData({
      loading: true
    })
    wx.showLoading({
      title: 'loading...',
    })
    const res = await search({
      q: inputVal,
      start: count * pageNo,
      count
    });
    wx.hideLoading();
    this.setData({
      result: pageNo ? [...result, ...res.items] : res.items,
      loading: false,
      pageNo: pageNo + 1,
      hasMore: res.total > count * (pageNo + 1)
    });
    this.setHistory();
  },

  /** 快速搜索 */
  quickSearch(e) {
    const { keywords } = e.currentTarget.dataset
    this.setData({
      inputVal: keywords,
      pageNo: 0,
    }, this.searchMovie)
  },

  /** 取消返回 */
  goBack() {
    wx.navigateBack()
  },

  /** 触底加载更多 */
  loadMore(e) {
    const { loading, hasMore } = this.data;
    if (!loading && hasMore) {
      this.searchMovie()
    }
  },

  /** 隐藏命令 */
  hiddenCommand() {
    const { inputVal } = this.data;
    const command = inputVal.split('hy:')[1].trim().toUpperCase();
    switch(command) {
      case 'OPEN MARK':  // 打开 Mark 小程序
        wx.navigateToMiniProgram({
          appId: 'wx5363d9bd45509430',
        })
        break;
      case 'OPEN TEST':  // 打开测试页
        wx.navigateTo({
          url: '/pages/first/first',
        })
        break;
      case 'EXAMPLE':
        wx.navigateTo({
          url: '/pages/example/index/index'
        });
        break;
      case 'CLOUD':
        wx.navigateTo({
          url: '/pages/cloud/pages/index/index'
        });
        break;
      default:
        wx.showToast({
          title: '命令错误！',
        })
        break;
    }
  },

  /** 搜索历史存储 */
  setHistory() {
    let { history, inputVal } = this.data
    let arr = history.slice(0, 3)
    arr.unshift(inputVal)
    history = [...(new Set(arr))]
    this.setData({
      history,
    })
    wx.setStorage({
      key: 'search_history',
      data: history,
    })
  },

  clearHistory() {
    wx.removeStorage({ key: 'search_history' })
    this.setData({
      history: [],
    })
  },

})