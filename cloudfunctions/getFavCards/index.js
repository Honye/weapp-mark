// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
})

const db = cloud.database()
const _ = db.command
const $ = _.aggregate

/** 获取用户喜欢的卡片 */
const getFavCards = async (event, context) => {
    // const { userInfo: { openId } } = event
    const { OPENID: openId } = cloud.getWXContext();
    const records = await db.collection('card_like')
        .aggregate()
        .match({
            openid: openId,
        })
        .lookup({
            from: 'cards',
            localField: 'card_id',
            foreignField: '_id',
            as: 'card_detail',
        })
        // 过滤掉卡片已不存在（删除）的数据
        .match({
            card_detail: _.elemMatch({
                _id: _.exists(true),
            }),
        })
        // 只返回卡片信息
        .replaceRoot({
            newRoot: $.arrayElemAt(['$card_detail', 0]),
        })
        .end();
    return records;
}

// 云函数入口函数
exports.main = async (event, context) => {
    return getFavCards(event, context)
}