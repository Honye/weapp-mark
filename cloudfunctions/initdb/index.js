const cloud = require('wx-server-sdk')

cloud.init(
  // {
  //   env: 'dv-963c46'
  // }
)

const db = cloud.database()

/**
 * 初始化表 banners
 */
const initBanners = async () => {
    console.log('*** start initBanners ***')
    const banners = [{
            image: 'http://static.zhidao.manmankan.com/kimages/201609/26_1474884213331602.jpg',
            type: 'image',
        },
        {
            image: 'http://www.stdaily.com/zhuanti01/2017sc/2017-09/29/581248/images/188f4c63b10547bebf39131bb25c1162.png',
            type: '',
        },
        {
            image: 'https://pbs.twimg.com/media/Cr9fC-dUMAABqEC.jpg',
        },
    ]
    let docLength = 0
    await db.collection('banners').get().then(({
        data
    }) => {
        docLength = data.length
    })
    for (let i = 0, length = banners.length; i < length; ++i) {
        await db.collection('banners').add({
            data: {
                id: docLength + i + 1,
                createTime: db.serverDate(),
                ...banners[i]
            }
        }).then(res => {
            console.log('*** add banner successed ***', res)
        }).catch(err => {
            console.error('*** add banner failed ***', err)
        })
    }
    console.log('*** initBanners finished ***')
}

/**
 * 初始化表 articles
 */
const initArticles = async () => {
    console.log('*** start init articles ***')
    const articles = [
        {
            id: 1125,
            image: "http://7xqnv7.com2.z0.glb.qiniucdn.com/2017-12-21_5a3b66c4e3c92.jpg",
            title: "那些温情电影都告诉了我们什么？！",
            likeCount: 104
        },
        {
            id: 1118,
            image: "http://7xqnv7.com2.z0.glb.qiniucdn.com/2017-12-17_5a362f082c25f.jpg",
            title: "我想知道流星能飞多久",
            likeCount: 99
        },
        {
            id: 1119,
            image: "http://7xqnv7.com2.z0.glb.qiniucdn.com/2017-12-18_5a376fc20e33e.jpg",
            title: "《月升王国》谁说大人的世界没有童话？",
            likeCount: 33
        },
        {
            id: 1102,
            image: "http://7xqnv7.com2.z0.glb.qiniucdn.com/2017-12-03_5a236db32a980.jpg",
            title: "每一个童年都值得被爱：《西葫芦的生活》",
            likeCount: 69
        },
        {
            id: 1074,
            image: "http://7xqnv7.com2.z0.glb.qiniucdn.com/2017-11-04_59fd63d65798d.jpg",
            title: "《蝴蝶梦》：她低到了尘埃里，终将摆脱前任的阴影",
            likeCount: 25
        },
        {
            id: 1062,
            image: "http://7xqnv7.com2.z0.glb.qiniucdn.com/2017-10-27_59f2d62abb85d.jpg",
            title: "《生吃》才不是史上最恐怖的影片，但成长确实是一个思之极恐的过程",
            likeCount: 107
        },
        {
            id: 1059,
            image: "http://7xqnv7.com2.z0.glb.qiniucdn.com/2017-10-27_59f2af5ae403b.jpg",
            title: "谁的人生不迷茫？今敏惊悚悬疑电影《未麻的部屋》观影感悟",
            likeCount: 55
        },
    ]
    for (let i = 0, length = articles.length; i < length; ++i) {
        await db.collection('articles').add({
            data: {
                createTime: db.serverDate(),
                ...articles[i]
            }
        }).then(res => {
            console.log('*** add article successed ***', res)
        }).catch(err => {
            console.error('*** add article failed ***', err)
        })
    }
    console.log('*** init articles finished ***')
}

/**
 * 初始化表 cards
 */
const initCards = async () => {
    console.log('*** start init cards ***')
    const cards = [
        {
            id: 11,
            "image": "https://img3.doubanio.com/view/photo/raw/public/p579724050.jpg",
            quote: "人心其实很脆弱，所以我们要经常哄哄它，经常把手放在心脏旁，对自己说：平安无事，平安无事，平安无事……",
            source: "《三傻大闹宝莱坞》",
            likeCount: 84,
            shareCount: 12,
            movieId: 3793023
        },
        {
            id: 10,
            image: "https://img1.doubanio.com/view/photo/raw/public/p2245932509.jpg",
            quote: "当恋爱了，就算最枯燥的工作也能忍受。",
            source: "《海街日记》",
            likeCount: 51,
            shareCount: 10,
            movieId: 25895901
        },
        {
            id: 9,
            image: "https://img1.doubanio.com/view/photo/l/public/p456514379.jpg",
            quote: "为了你在乎的东西值得冒险。",
            source: "《南极大冒险》",
            likeCount: 52,
            shareCount: 11,
            movieId: 1477448
        },
        {
            id: 8,
            image: "https://img3.doubanio.com/view/photo/l/public/p1716666870.jpg",
            quote: "我一直以为最糟糕的情况是你离开我，其实最令我难过的，是你不快乐。",
            source: "《精灵旅社》",
            likeCount: 121,
            shareCount: 19,
            movieId: 3269068
        },
        {
            id: 7,
            image: "https://img3.doubanio.com/view/photo/l/public/p1106861692.jpg",
            quote: "贬低他人，并不会令自己变得多伟大。",
            source: "《贱女孩》",
            likeCount: 64,
            shareCount: 11,
            movieId: 1309084
        },
        {
            id: 6,
            image: "https://img3.doubanio.com/view/photo/l/public/p2374369280.jpg",
            quote: "尽管已提前知晓人生，以及它的走向，我无所畏惧，并且会珍惜每一分钟。",
            source: "《降临》",
            likeCount: 63,
            shareCount: 10,
            movieId: 21324900
        },
        {
            id: 5,
            image: "https://img3.doubanio.com/view/photo/l/public/p1694419516.jpg",
            quote: "不要让别人告诉你，你不能做什么。只要有梦想，就要去追求。那些做不到的人总要告诉你，你也不行。想要什么就得去努力，去追求。",
            source: "《当幸福来敲门》",
            likeCount: 74,
            shareCount: 15,
            movieId: 1849031
        },
        {
            id: 4,
            image: "https://img3.doubanio.com/view/photo/l/public/p1140053562.jpg",
            quote: "真正的失败者不是那些没有赢的人，而是那些害怕失败而不敢尝试的人。",
            source: "《阳光小美女》",
            likeCount: 98,
            shareCount: 18,
            movieId: 1777612
        },
        {
            id: 3,
            image: "https://img3.doubanio.com/view/photo/l/public/p800791080.jpg",
            quote: "探戈走错了可以重来，人生则不可...",
            source: "《闻香识女人》",
            likeCount: 81,
            shareCount: 11,
            movieId: 1298624
        }
    ]
    for (let i = 0, length = cards.length; i < length; ++i) {
        await db.collection('cards').add({
            data: {
                createTime: db.serverDate(),
                ...cards[i]
            }
        }).then(res => {
            console.log('*** add card successed ***', res)
        }).catch(err => {
            console.error('*** add card failed ***', err)
        })
    }
    console.log('*** init cards finished ***')
}

exports.main = async(event, context) => {
    console.log('*** 开始初始化 ***')
    // await initBanners()
    // await initArticles()
    await initCards()
    console.log('*** 初始化结束 ***')
}