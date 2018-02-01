# Mark
[![Honye](https://img.shields.io/badge/Honye-%E7%BA%A2%E5%8F%B6-000000.svg)](https://hongye567.github.io/)  [![license](https://img.shields.io/badge/license-Apache%202.0-000000.svg)](https://github.com/Hongye567/weapp-mark/blob/master/LICENSE)

仿 Mark 应用页面的微信小程序

[WePY 版本](https://github.com/Hongye567/wepy-mark)，还在完善中…

小程序个人开发功能限制太多，无法完全上线。建议将项目克隆下来运行程序体验全部功能。

![小程序体验](http://oz126ti4w.bkt.clouddn.com/image/mark.jpg)

作为学习项目一步一步走来，我会记录下我是如何从零完成此小程序的（doc 文件夹），以及途中遇到的所有问题，以后不定期更新，尽量做到更好，如果你有什么建议也请告诉我（issues）。项目中自己有封装一些组件，可在项目结构查看。

后台数据由 [LeanCloud 云服务](https://leancloud.cn/)支撑和[豆瓣](https://developers.douban.com/)提供的电影 Api。数据由我个人维护，由于缺少数据源，不会定期更新。如果你喜欢这类应用，你可以去下载原生应用 [Mark](http://a.app.qq.com/o/simple.jsp?pkgname=com.intlime.mark&fromcase=40002)。

![思维导图](http://oz126ti4w.bkt.clouddn.com/image/MarkMind.png)

[在线思维导图](https://www.processon.com/view/5a5c45d7e4b0abe85d562bda)

为了节省篇幅，效果图就不一一展示了，扫小程序码基本能体验全部了

[效果图1](http://opz28dn03.bkt.clouddn.com/images/IMG_1558.JPG?imageslim&imageView2/2/h/300)
[效果图2](http://opz28dn03.bkt.clouddn.com/images/IMG_1559.JPG?imageslim&imageView2/2/h/300)
[效果图3](http://opz28dn03.bkt.clouddn.com/images/CTJB2779.GIF?imageslim&imageView2/2/h/300)

**注意事项：**

使用自定义组件 [Component](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)，小程序基础版本库要在 1.6.3 以上；

使用 [wxParse](https://github.com/icindy/wxParse)，小程序基础版本库要在 1.6.6 及以上。

## 日志
2018-01-15

- 新增 [LeanCloud 云服务](https://leancloud.cn/)
- 修复没有预告时显示空白视图问题

## 技术
- API 的灵活使用
- 图片显示预览、视频加载播放、背景音乐播放
- 本地数据存储
- 列表加载显示
- CSS3 属性动画
- template、Component 分别实现自定义组件
- ES6、Promise 的灵活使用
- LeanCloud 云服务的使用

## 运行
没有使用其它打包工具，无需额外的环境配置，直接 clone 本项目，使用微信 Web 开发工具打开 `dist` 文件夹即可看见效果。

**注意：**如果你没有 AppID 可能看不到数据，手机无法预览。开发工具需要关闭安全域名的校验，**工具栏 --> 详情 --> 项目设置 --> 勾选不校验安全域名...以及 HTTPS 证书**。

## 文档（持续更新）
[写项目时的想法](./doc/thought.md)

[边写边记](./doc/小程序笔记)

[小程序使用外部字体](./doc/小程序使用外部字体.md)

[小程序自定义评分组件template（精度0.1）](./doc/小程序自定义评分组件template（精度0.1）.md)

[小程序自定义评分组件Component（精度0.1）](./doc/小程序自定义评分组件Component（精度0.1）.md)

## 项目结构
```
├── assets 静态资源
│    ├── libs 三方支持库
│    ├── images 图片资源
│    └── styles 公用样式
├── components  组件化 Component，小程序基础版本库 1.6.3 以上
│    ├── pre-image 图片预加载
│    └── rating 评分
├── pages  页面
│    └── common  模板 template
│        ├── rating  评分
│        ├── wxParse  富文本、HTML 和 MD 解析，小程序基础版本库 1.6.6 及以上
│        └── component.js  wux 针对 template 的组件化，写得挺好，借鉴一下
├── style  静态样式资源
│    ├── weui.wxss
│    ├── animate.wxss CSS 动画
│    └── font-awesome.min.wxss Font Awesome 字体图标
├── utils  封装的工具
│    └── apis.js API 配置及网络请求
├── app.js  应用入口
├── app.json  页面路径及窗口配置
└── app.wxss  应用共用样式
```

## 待办

- [ ] 自定义轮播
- [ ] ScrollView 下拉刷新
- [ ] 数据本地存储工具
- [ ] 绘制卡片且保存
- [ ] 分组列表
- [x]  后台开发（目前使用 LeanCloud）

## 资源
1. 微信官方UI样式 [weui-wxss](https://github.com/Tencent/weui-wxss/)
2. 富文本、HTML 和 Markdown 解析 [wxParse](https://github.com/icindy/wxParse)
3. [小程序使用外部字体](./doc/小程序使用外部字体.md)，本人使用的是 [Font Awesome](http://fontawesome.io/)
4. 针对 template 的自定义组件 [wux](https://github.com/skyvow/wux)
5. [LeanCloud 云服务](https://leancloud.cn/)提供后台支撑