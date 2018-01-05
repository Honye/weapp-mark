# Mark
仿 Mark 应用页面的微信小程序

[WePY 版本](https://github.com/Hongye567/wepy-mark)，还在完善中…

小程序个人开发功能限制太多，无法完全上线。建议将项目克隆下来运行程序体验全部功能。

![小程序体验](http://oz126ti4w.bkt.clouddn.com/image/mark.jpg)

作为学习项目一步一步走来，我会记录下我是如何从零完成此小程序的（doc 文件夹），以及途中遇到的所有问题，以后不定期更新，尽量做到更好，如果你有什么建议也请告诉我（issues）。项目中自己有封装一些组件，可在项目结构查看。

如果你喜欢这类应用，我强烈建议你去体验原生应用 Mark，毕竟我这小程序没有后台。各大应用商店都可下载（搜索“Mark”）。

![效果图1](http://opz28dn03.bkt.clouddn.com/images/IMG_1558.JPG?imageslim&imageView2/2/h/300)
![效果图2](http://opz28dn03.bkt.clouddn.com/images/IMG_1559.JPG?imageslim&imageView2/2/h/300)
![效果图3](http://opz28dn03.bkt.clouddn.com/images/CTJB2779.GIF?imageslim&imageView2/2/h/300)

**注意事项：**

此小程序因没有后台服务，数据都是网络静态数据和本地存储。

使用自定义组件 [Component](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)，小程序基础版本库要在 1.6.3 以上；

使用 [wxParse](https://github.com/icindy/wxParse)，小程序基础版本库要在 1.6.6 及以上。

## 运行
没有使用其它打包工具，无需额外的环境配置，直接 clone 本项目，使用微信 Web 开发工具打开 `dist` 文件夹即可看见效果。

## 文档
[写项目时的想法](./doc/thought.md)

[边写边记](./doc/小程序笔记)

[小程序使用外部字体](./doc/小程序使用外部字体.md)

[小程序自定义评分组件template（精度0.1）](./doc/小程序自定义评分组件 template（精度0.1）.md)

[小程序自定义评分组件Component（精度0.1）](./doc/小程序自定义评分组件 Component（精度0.1）.md)

## 项目结构
```
├── assets 静态资源
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
- [ ] 后台开发

## 资源
1. 微信官方UI样式 [weui-wxss](https://github.com/Tencent/weui-wxss/)
2. 富文本、HTML 和 Markdown 解析 [wxParse](https://github.com/icindy/wxParse)
3. [小程序使用外部字体](./doc/小程序使用外部字体.md)，本人使用的是 [Font Awesome](http://fontawesome.io/)
4. 针对 template 的自定义组件 [wux](https://github.com/skyvow/wux)