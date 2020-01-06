// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  // {
  //   env: 'dv-963c46'
  // }
)

const db = cloud.database()

/**
 * 获取卡片列表
 */
const getCards = async (event, context) => {
    let cards = []
    let message = 'success'
    await db.collection('cards').get().then(({ data }) => {
        cards = data
    }).catch( err => {
        message = err.errMsg || err
    })
    for(let i = 0, length = cards.length; i < length; ++i) {
        await db.collection('cardRelations').where({
            id: cards[i].id,
        }).get().then(({ data }) => {
            cards[i].likeCount = data.length && data[0].favUsers ? data[0].favUsers.length : 0
        }).catch(err => {
            message = err.errMsg || err
        })
        const { userInfo: { openId } } = event
        await db.collection('userRelations').where({
            _openid: openId,
        }).get().then(({ data }) => {
            cards[i].liked = data.length && data[0].favCards.includes(cards[i].id)
        }).catch( err => {
            message = err.errMsg || JSON.stringify(err)
        })
    }

    return {
        data: cards,
        message,
    }
}

// 云函数入口函数
exports.main = async (event, context) => {
    return await getCards(event, context)
}