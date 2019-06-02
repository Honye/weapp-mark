// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  // {
  //   env: 'dv-963c46'
  // }
)


const db = cloud.database()

/** 与用户关联 */
const relateUser = (event, context) => {
    const { userInfo: { openId }, id: cardId } = event

    return new Promise((resolve, reject) => {
        db.collection('userRelations').where({
            _openid: openId,
        }).get().then(({ data }) => {
            if (data.length) {
                let { favCards } = data[0]
                const hasFav = favCards && favCards.includes(cardId)
                if (typeof favCards === 'undefined') {
                    favCards = [cardId]
                } else if (hasFav) {
                    favCards = favCards.filter(item => item !== cardId)
                } else {
                    favCards = Array.from(new Set([cardId, ...favCards]))
                }
                db.collection('userRelations').doc(data[0]._id).update({
                    data: { favCards }
                }).then(() => {
                    resolve({
                        data: {
                            liked: !hasFav,
                        },
                        message: hasFav ? '取消喜欢' : '喜欢成功',
                    })
                }).catch( err => {
                    reject({
                        data: {},
                        message: err.errMsg || JSON.stringify(err)
                    })
                })
            } else {
                db.collection('userRelations').add({
                    data: {
                        _openid: openId,
                        favCards: [cardId],
                    }
                }).then(() => {
                    resolve({
                        data: {
                            liked: true,
                        },
                        message: '喜欢成功',
                    })
                }).catch( err => {
                    reject({
                        data: {},
                        message: err.errMsg || JSON.stringify(err)
                    })
                })
            }
        }).catch( err => {
            reject({
                data: {},
                message: err.errMsg || JSON.stringify(err)
            })
        })
    })
}

/** 与卡片关联 */
const relateCard = (event, context) => {
    const { userInfo: { openId }, id: cardId } = event
    return new Promise((resolve, reject) => {
        db.collection('cardRelations').where({
            id: cardId,
        }).get().then(({ data }) => {
            if (data.length) {
                let { favUsers } = data[0]
                const has = favUsers && favUsers.includes(openId)
                if (typeof favUsers === 'undefined') {
                    favUsers = [openId]
                } else if (has) {
                    favUsers = favUsers.filter(item => item !== openId)
                } else {
                    favUsers = Array.from(new Set([openId, ...favUsers]))
                }
                db.collection('cardRelations').doc(data[0]._id).update({
                    data: { favUsers }
                }).then(() => {
                    resolve({
                        data: {
                            liked: !has,
                        },
                        message: has ? '取消喜欢': '喜欢成功',
                    })
                }).catch( err => {
                    reject({
                        data: {},
                        message: err.errMsg || JSON.stringify(err)
                    })
                })
            } else {
                db.collection('cardRelations').add({
                    data: {
                        id: cardId,
                        favUsers: [openId],
                    }
                }).then(() => {
                    resolve({
                        data: {
                            liked: true,
                        },
                        message: '喜欢成功',
                    })
                }).catch(err => {
                    reject({
                        data: {},
                        message: err.errMsg || JSON.stringify(err)
                    })
                })
            }
        }).catch(err => {
            reject({
                data: {},
                message: err.errMsg || JSON.stringify(err)
            })
        })
    })
}

// 云函数入口函数
exports.main = async (event, context) => {
    return Promise.all([
        relateUser(event, context),
        relateCard(event, context)
    ]).then(values => values[0] || values)
}