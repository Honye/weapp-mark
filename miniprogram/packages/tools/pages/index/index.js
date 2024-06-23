Component({
  methods: {
    async scan() {
      const { result } = await wx.scanCode();
      const { confirm } = await wx.showModal({
        content: result,
        cancelText: '复制',
        confirmText: '知道了'
      });
      if (!confirm) {
        await wx.setClipboardData({ data: result });
        wx.showToast({ icon: 'none', title: '复制成功' });
      }
    }
  }
});