### 主题

```js
    colors: {
        mainColor: '#496069',
        cyan: '#4CDFAA',
        placeColor: '#eee'
    }
```

### 持久化存储

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
        // “已看”
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

### 网络数据
1. 横幅广告 banners

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | int | 唯一 ID |
| image | String | 横幅图 |
| artilceId | int | 对应的文章 ID，用于显示详情 |
| articleUrl | String | 对应文章 URL，若可以使用 webview |

2. 文章 articles

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | int | 唯一 ID |
| title | String | 文章标题 |
| image | String | 用于在列表和头部显示的图片（宣传图）|
| likeCount | int | 喜欢数 |
| commentCount | int | 评论数 |
| shareCount | int | 分享数 |
| authorId | int | 撰稿人 ID |

3. 分类标签 tags

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | int | 唯一 ID |
| title | String | 标签名 |

4. 卡片 cards

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | int | 唯一 ID |
| image | String | 卡片图片资源 |
| quote | String | 引用文本台词 |
| source | String | 引用源（影名）|
| videoId | int | 影视 ID |
