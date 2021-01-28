# Mark

[![Honye](https://img.shields.io/badge/Honye-红叶-red.svg)](https://honye.github.io/)  [![license](https://img.shields.io/github/license/hongye567/weapp-mark.svg)](https://github.com/Honye/weapp-mark/blob/master/LICENSE)

仿 Mark 应用页面的微信小程序。

<p align="center">
    <img src="http://oz126ti4w.bkt.clouddn.com/image/mark.jpg" height="258px" >
</p>


纯属娱乐学习项目，偶尔记录下开发中遇到的问题和想法，不定期更新，如果你有什么建议也请告诉我（[issues](https://github.com/Honye/weapp-mark/issues)）。项目中自己有封装一些组件，可在项目结构查看。

~~影视数据全部由[豆瓣](https://developers.douban.com/) API 提供。~~ 目前豆瓣搜索接口已经没有免费的可以使用了，抓取的豆瓣评分小程序的 API。小程序个人开发功能限制太多，无法完全上线。如若喜欢可以下载原生应用 [Mark](http://a.app.qq.com/o/simple.jsp?pkgname=com.intlime.mark&fromcase=40002) 体验全部功能。

## Branches

1. [cloud](https://github.com/Honye/weapp-mark/tree/cloud) - 采用[微信小程序云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)，无需后台也能开发一款完整的小程序。
2. [master](https://github.com/Honye/weapp-mark/tree/master) - 后台服务由 [LeanCloud 云服务](https://leancloud.cn/)支撑。
3. [cdn-ui](https://github.com/Honye/weapp-mark/tree/cdn-ui) - 没有后台服务支撑，全部采用 HTTP 请求的个人博客的静态 JSON 文件。

[在线思维导图](https://www.processon.com/view/5a5c45d7e4b0abe85d562bda)

**注意事项：**

使用自定义组件 [Component](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)，小程序基础版本库要在 1.6.3 以上；

使用 [wxParse](https://github.com/icindy/wxParse)，小程序基础版本库要在 1.6.6 及以上。

小程序[简易双向绑定](https://developers.weixin.qq.com/miniprogram/dev/framework/view/two-way-bindings.html)，小程序基础版本库 2.9.3 及以上

## Logs

2021-01-28

- 云函数实现 GitHub 绑定
- 恢复豆瓣搜索和详情

2018-09-16

- [微信小程序云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)初体验

2018-01-15

- 新增 [LeanCloud 云服务](https://leancloud.cn/)
- 修复没有预告时显示空白视图问题

## Skills

- 图片显示预览、视频加载播放、背景音乐播放
- 本地数据存储
- CSS3 属性动画
- template、Component 分别实现自定义组件
- ES6、Promise
- LeanCloud

## Run

没有使用其它打包工具，无需额外的环境配置，直接 clone 本项目，使用微信 Web 开发工具打开即可看见效果。

**注意：** 如果你没有 AppID 可能看不到数据，手机无法预览。开发工具需要关闭安全域名的校验，**工具栏 --> 详情 --> 项目设置 --> 勾选不校验安全域名...以及 HTTPS 证书**。

## Docs

[云开发关联表（集合）案例](https://github.com/Hongye567/weapp-mark/wiki/小程序关联表学习)

[写项目时的想法](https://github.com/Hongye567/weapp-mark/wiki/thought)

[边写边记](https://github.com/Hongye567/weapp-mark/wiki/小程序笔记)

[小程序使用外部字体](https://github.com/Hongye567/weapp-mark/wiki/小程序使用外部字体)

[小程序自定义评分组件 - tempalte 实现（精度 0.1）](https://github.com/Hongye567/weapp-mark/wiki/小程序自定义评分组件-template（精度0.1）)

[小程序自定义评分组件 - Component 实现（精度0.1）](https://github.com/Hongye567/weapp-mark/wiki/小程序自定义评分组件-Component（精度0.1）)

## Contents

```
├── assets 静态资源
│    ├── libs 三方支持库
│    ├── images 图片资源
│    └── styles 公用样式
├── components  组件化 Component，小程序基础版本库 1.6.3 以上
│    ├── pre-image 图片预加载
│    └── rating 评分
├── cloudfunctions  云函数
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

## TODO

- [ ] 自定义轮播
- [ ] ScrollView 下拉刷新
- [ ] 数据本地存储工具
- [ ] 绘制卡片且保存
- [ ] 分组列表

## Sources

1. 微信官方UI样式 [weui-wxss](https://github.com/Tencent/weui-wxss/)
2. 富文本、HTML 和 Markdown 解析 [wxParse](https://github.com/icindy/wxParse)
3. 针对 template 的自定义组件 [wux](https://github.com/skyvow/wux)
4. [LeanCloud 云服务](https://leancloud.cn/)提供后台支撑
5. [云服务开发环境（官方）](https://cloud.tencent.com/document/product/619/11447)
6. [小程序解决方案（官方）](https://cloud.tencent.com/solution/la)



