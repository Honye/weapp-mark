import wxCloud from '../../../../utils/wxCloud'

Page({
  async handleTap (e) {
    const { action } = e.currentTarget.dataset
    await wxCloud('douban', {
      action
    })
    wx.showToast({
      title: '请求并存储成功'
    })
  }
})
