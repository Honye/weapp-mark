import { compareVersions } from '../../../../utils/util';
const db = wx.cloud.database();

Page({
  data: {
    app: null,
    version: '1.0.0'
  },

  async onLoad () {
    // FIXME collection app 不存在时异常
    const { data: [app] } = await db.collection('app')
      .orderBy('created_at', 'desc')
      .limit(1)
      .get();
    if (app) {
      this.setData({
        app,
        version: app.version
      });
    }
  },

  async submit (e) {
    const { version } = e.detail.value;
    if (!version) {
      wx.showModal({
        title: '提示',
        content: '请输入版本号'
      });
      return;
    }
    
    const { app } = this.data;
    if (compareVersions(version, app.version) < 0) {
      const couldUpdate = await new Promise((resolve) => {
        wx.showModal({
          title: '警告',
          content: `线上版本为 v${app.version}，确定降低版本为 v${version} 吗？`,
          success: ({ confirm }) => resolve(confirm)
        });
      });
      if (!couldUpdate) return;
    }

    if (compareVersions(version, app.version) === 0) {
      wx.showModal({
        title: '提示',
        content: '与线上版本一致，无需修改',
        showCancel: false
      });
      return;
    }

    await db.collection('app')
      .add({
        data: {
          created_at: db.serverDate(),
          version
        }
      });
    wx.showToast({
      icon: 'none',
      title: '更新版本成功'
    });
  }
});
