# Mark

[![Honye](https://img.shields.io/badge/Honye-红叶-red.svg)](https://honye.github.io/)  [![license](https://img.shields.io/github/license/hongye567/weapp-mark.svg)](https://github.com/Honye/weapp-mark/blob/master/LICENSE)

<p align="center">
    <img src="./docs/screenshots/IMG_5435.JPG" height="258px" >
</p>


纯属娱乐学习项目，偶尔记录下开发中遇到的问题和想法，不定期更新，如果你有什么建议也请告诉我（[issues](https://github.com/Honye/weapp-mark/issues)）。项目中自己有封装一些组件，可在项目结构查看。

~~影视数据全部由[豆瓣](https://developers.douban.com/) API 提供。~~ 目前豆瓣搜索接口已经没有免费的可以使用了，由豆瓣提供的数据可能不能正常使用了，项目提供了 mock 数据可使用。小程序个人开发功能限制太多，无法完全上线。如若喜欢可以克隆项目自己运行看看。

## 💥 扫码体验

<img src="./docs/screenshots/IMG_5437.JPG" alt="小程序码" title="小程序码" width="300">

## 🔱 分支 Branches

1. [main](https://github.com/Honye/weapp-mark/tree/main) - 采用[微信小程序云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)，无需后台也能开发一款完整的小程序。
2. [master](https://github.com/Honye/weapp-mark/tree/master) - 后台服务由 [LeanCloud 云服务](https://leancloud.cn/)支撑。
3. [cdn-ui](https://github.com/Honye/weapp-mark/tree/cdn-ui) - 没有后台服务支撑，全部采用 HTTP 请求的个人博客的静态 JSON 文件。

[在线思维导图](https://www.processon.com/view/5a5c45d7e4b0abe85d562bda)

**注意事项：**

使用自定义组件 [Component](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)，小程序基础版本库要在 1.6.3 以上；

使用 [wxParse](https://github.com/icindy/wxParse)，小程序基础版本库要在 1.6.6 及以上。

小程序[简易双向绑定](https://developers.weixin.qq.com/miniprogram/dev/framework/view/two-way-bindings.html)，小程序基础版本库 2.9.3 及以上

## 🎨 功能 Features

- 云函数实现微信登录
- 云函数定时任务实现每日卡片
- 云函数聚合查询实现卡片收藏
- Grid 多列表格布局
- Grid 布局实现瀑布流
- 云函数爬取 GitHub Trending
- 关于页背景音频播放
- 分别使用 template 和 Component 实现公用组件
- CSS3 属性动画

## 🐢 规范 Code of conduct

时间久了自己都忘记了以前给自己定的规范是啥，导致代码很不统一，给自己备份个项目规范🥱

[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

## 🛠 运行 Run

没有使用其它打包工具，无需额外的环境配置，直接 clone 本项目，使用微信 Web 开发工具打开即可看见效果。

**注意：** 如果你没有 AppID 可能看不到数据，手机无法预览。开发工具需要关闭安全域名的校验，**工具栏 --> 详情 --> 项目设置 --> 勾选不校验安全域名...以及 HTTPS 证书**。

#### Mock API

参考官方文档 [API Mock/规则导入导出](https://developers.weixin.qq.com/miniprogram/dev/devtools/api-mock.html)，导入 [mock/mock.config.json](./mock/mock.config.json)

## 🪶 笔记 Notes

[小程序使用 IconFont](https://github.com/Honye/notes/blob/vuepress/WeChat/miniprogram-iconfont.md)

[云开发关联表（集合）案例](https://github.com/Hongye567/weapp-mark/wiki/小程序关联表学习)

[写项目时的想法](https://github.com/Hongye567/weapp-mark/wiki/thought)

[边写边记](https://github.com/Hongye567/weapp-mark/wiki/小程序笔记)

[小程序使用外部字体](https://github.com/Honye/notes/blob/vuepress/WeChat/use-other-font.md)

[小程序自定义评分组件 - tempalte 实现（精度 0.1）](https://github.com/Hongye567/weapp-mark/wiki/小程序自定义评分组件-template（精度0.1）)

[小程序自定义评分组件 - Component 实现（精度0.1）](https://github.com/Hongye567/weapp-mark/wiki/小程序自定义评分组件-Component（精度0.1）)

## 📐 结构 Structure

```
├── apis
├── assets
├── components  组件化 Component
│    ├── cover-page 可下拉关闭的半屏组件
│    ├── pre-image 图片预加载
│    ├── rating 评分
│    └── tabs
├── cloudfunctions
├── pages
│    └── common  模板 template
│        ├── actionsheet 操作菜单
│        ├── cell 列表单元
│        ├── dropmenu 下拉菜单
│        ├── loading 加载/加载更多
│        ├── rating  评分
│        ├── share 底部分享菜单
│        ├── wxParse  富文本、HTML 和 MD 解析，小程序基础版本库 1.6.6 及以上
│        └── component.js  wux 针对 template 的组件化，写得挺好，借鉴一下
├── style
│    ├── weui.wxss
│    ├── animate.wxss CSS 动画
│    └── font-awesome.min.wxss Font Awesome 字体图标
├── utils
│    └── wxCloud.js 云函数二次封装
├── app.js
├── app.json
└── app.wxss
```

## 🔗 参考 Reference

1. 微信官方UI样式 [weui-wxss](https://github.com/Tencent/weui-wxss/)
2. 富文本、HTML 和 Markdown 解析 [wxParse](https://github.com/icindy/wxParse)
3. 针对 template 的自定义组件 [wux](https://github.com/skyvow/wux)
4. [LeanCloud 云服务](https://leancloud.cn/)提供后台支撑
5. [云服务开发环境（官方）](https://cloud.tencent.com/document/product/619/11447)
6. [小程序解决方案（官方）](https://cloud.tencent.com/solution/la)
