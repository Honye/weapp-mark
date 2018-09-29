// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'dv-963c46'
})

const db = cloud.database()
const _ = db.command

/** 获取用户喜欢的卡片 */
const getFavCards = (event, context) => {
    const { userInfo: { openId } } = event
    return db.collection('userRelations').where({
        _openid: openId,
    }).get().then(({ data }) => {
        if (data.length) {
            return db.collection('cards').where({
                id: _.in(data[0].favCards.map(item => Number(item))),
            }).field({
                id: true,
                image: true,
                quote: true,
                source: true,
            }).get().then(({ data }) => {
                return {
                    data,
                    message: 'success',
                }
            }).catch(err => {
                return Promise.reject({
                    data: {},
                    message: err.errMsg || JSON.stringify(err),
                })
            })
        } else {
            return {
                data: [],
                message: 'success',
            }
        }
    }).catch( err => {
        return Promise.reject({
            data: {},
            message: err.errMsg || JSON.stringify(err),
        })
    })
}

// 云函数入口函数
exports.main = async (event, context) => {
    return getFavCards(event, context)
}