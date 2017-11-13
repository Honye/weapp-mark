
**注意事项：**
此小程序因没有后台服务，大多数据都采用本地存储，所以使用过程中若是删除了微信缓存可能导致数据丢失，请谨慎使用。在后续开发中会添加数据备份功能。

**持久化存储：**
1. 设置
 ```js
    setting: {
         // 是否接收通知 {boolean}
        notice: true,
        // “想看
        wantSee: {
            layout: 'linear',  // 布局方式 {enum['linear', 'grid']}
            sort: 'addtime'  // 排序方式  ['add', 'release', 'rating', 'name']
        },
        // “已看”布局方式 {enum['linear', 'grid']} 
        hasSeenLayout: 'grid', 
        hasSeen: {
            layout: 'grid',
            sort: 'rating'
        }
        // 搜索历史记录 {array['string']}
        searchHistory: [ '成龙', '战狼2' ],
    }
 ```

2. 用户
 ```js
    movies: {
        // 想看 {array[object]}
        wantSee: [
            {
                id: 26743549,  // 影视ID
                title: "大话西游之爱你一万年",  // 影名
                image: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2500309240.jpg",  // 封面图
                pubdates: [ "2017-09-28(中国大陆)" ],  // 上映时间
                duration: "40分钟",  // 时长/单集时长
                genres: [ "喜剧", "爱情", "古装" ],  // 影视类型
                rating: 3.4,  // 豆瓣评分
                date: "2017年11月5日"  // 加入时间
            }
        ],
        // 已看 {arr[object]}
        hasSeen: [
            {
                id: 26743549,  // 影视ID
                title: "大话西游之爱你一万年",  // 影名
                image: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2500309240.jpg",  // 封面图
                pubdates: [ "2017-09-28(中国大陆)" ],  // 上映时间
                duration: "40分钟",  // 时长/单集时长
                genres: [ "喜剧", "爱情", "古装" ],  // 影视类型
                rating: 3.4,  // 用户评分
                date: "2017年11月5日"  // 观影时间
            }
        ],
        // 用户影单 array[object]
        collection: [
            id: 11,  // 影单ID
            title: "我喜欢的电影",  // 影单名
            movies: [  // 影单中内容
                {
                    id: 26743549,  // 影视ID
                    title: "大话西游之爱你一万年",  // 影名
                    image: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2500309240.jpg"  // 封面图
                }
            ]
        ],
        // 喜欢的卡片
        cards: [
            {
                id: 123,  // 卡片ID
                content: "春生，夏糜，秋去，冬烬，春又来。",  // 内容
                source: "春夏秋冬又一春",  // 来源
                image: "https://.......jpg"  // 图片
            }
        ]
    }
 ```

**网络数据**