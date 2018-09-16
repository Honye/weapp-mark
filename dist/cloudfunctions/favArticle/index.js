// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'dv-963c46'
})

const db = cloud.database()

/** 与用户关联 */
const relateUser = (event, context) => {
    const { userInfo: { openId }, id: articleID } = event
    return new Promise((resolve, reject) => {
        db.collection('userRelations').where({
            _openid: openId,
        }).get().then(({ data }) => {
            if (data.length) {
                let { favoriteArticles } = data[0]
                const has = favoriteArticles && favoriteArticles.includes(articleID)
                if (typeof favoriteArticles === 'undefined') {
                    favoriteArticles = [articleID]
                } else if (has) {
                    favoriteArticles = favoriteArticles.filter(item => item !== articleID)
                } else {
                    favoriteArticles = Array.from(new Set([articleID, ...favoriteArticles]))
                }
                db.collection('userRelations').doc(data[0]._id).update({
                    data: { favoriteArticles }
                }).then(res => {
                    resolve({ message: has ? '取消喜欢' : '喜欢成功' })
                })
            } else {
                db.collection('userRelations').add({
                    data: {
                        _openid: openId,
                        favoriteArticles: [articleID],
                    }
                }).then(res => {
                    resolve({ message: '喜欢成功' })
                })
            }
        }).catch(err => {
            reject(err)
        })
    })
}

/** 与文章关联 */
const relateArticle = (event, context) => {
    const { userInfo: { openId }, id: articleID } = event
    return new Promise((resolve, reject) => {
        db.collection('articleRelations').where({
            id: articleID,
        }).get().then(({ data }) => {
            if (data.length) {
                let { users } = data[0]
                const has = users && users.includes(openId)
                if (typeof users === 'undefined') {
                    users = [openId]
                } else if (has) {
                    users = users.filter(item => item !== openId)
                } else {
                    users = Array.from(new Set([openId, ...users]))
                }
                db.collection('articleRelations').doc(data[0]._id).update({
                    data: { users }
                }).then( res => {
                    resolve({ message: has ? '取消喜欢' : '喜欢成功' })
                }).catch( err => {
                    reject(err)
                })
            } else {
                db.collection('articleRelations').add({
                    data: {
                        id: articleID,
                        users: [openId],
                    }
                }).then( res => {
                    resolve({ message: '喜欢成功' })
                }).catch( err => {
                    reject(err)
                })
            }
        }).catch( err => {
            reject(err)
        })
    })
}

// 云函数入口函数
exports.main = async (event, context) => {
    return Promise.all([
        relateUser(event, context),
        relateArticle(event, context)
    ]).then( values => values[0] || values)
}