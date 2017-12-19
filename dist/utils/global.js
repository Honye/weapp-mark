// 应用全局 app 属性及方法
'use strict';

// 获取应用实例
( () => {
  const app = getApp();

  /**
   * 主要用来提供两版显示
   * 本地版本号大于服务端版本号代表未发布，简版显示应对审核
   * 本地版本号小余等于服务端版本号代表已发布
   */
  const version = {
    versionCode: 6,
    versionName: '1.0.4'
  };

  let globalData = {
    version,
    userInfo: null,
    setting: {},
    config: {
      hasPermission: true
    }
  }

  Object.assign(app, {
    globalData
  })
  
})()