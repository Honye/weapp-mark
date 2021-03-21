Page({
  data: {
    icons: [
      { class: 'icon-daimabeifen' },
      { class: 'icon-dot' },
      { class: 'icon-ios-git-merge' },
      { class: 'icon-license' },
      { class: 'icon-star' },
      { class: 'icon-github' }
    ]
  },

  handleIconTap (e) {
    const { class: className } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: `iconfont ${className}`,
      success: () => {
        wx.showToast({
          title: '类名已复制'
        });
      }
    });
  }
});
