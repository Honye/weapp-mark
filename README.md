# Mark
仿 Mark 应用页面的微信小程序

小程序个人开发功能限制太多，无法完全上线，为了过审核都要费尽心思。原想项目完全上线了再开源的，方便大家看效果，但疲于过审核，算了，直接开源再一步一步完善吧。

作为学习项目写的不是很好，以后不定期更新，尽量做到更好，如果你有什么建议也请告诉我（issues）。项目中自己有封装一些组件，可在项目结构查看

你要是喜欢这清爽的界面，又觉得功能不够强悍，体验又不是很美观，我强烈建议你去体验原生应用 Mark。各大应用商店都可下载（搜索“Mark”）

![效果图1](http://opz28dn03.bkt.clouddn.com/images/IMG_1558.JPG?imageslim&imageView2/2/h/300)
![效果图2](http://opz28dn03.bkt.clouddn.com/images/IMG_1559.JPG?imageslim&imageView2/2/h/300)
![效果图3](http://opz28dn03.bkt.clouddn.com/images/CTJB2779.GIF?imageslim&imageView2/2/h/300)

**注意事项：**
此小程序因没有后台服务，数据都是网络静态数据和本地存储。

## 运行
没有使用其它打包工具，无需额外的环境配置，直接 clone 本项目，使用微信 Web 开发工具打开 `dist` 文件夹即可看见效果。

## 项目结构
```
├── assets 静态资源
│    ├── images 图片资源
│    └── styles 公用样式
├── components  组件化 Component
│    ├── pre-image 图片预加载
│    └── rating 评分
├── pages  页面
│    └── common  模板 template
│        ├── rating  评分
│        ├── wxParse  富文本、HTML 和 MD 解析
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

## 资源
1. 微信官方UI样式 [weui-wxss](https://github.com/Tencent/weui-wxss/)
2. 富文本、HTML 和 Markdown 解析 [wxParse](https://github.com/icindy/wxParse)
3. [小程序使用外部字体](./doc/小程序使用外部字体.md)，本人使用的是 [Font Awesome](http://fontawesome.io/)
4. 针对 template 的自定义组件 [wux](https://github.com/skyvow/wux)