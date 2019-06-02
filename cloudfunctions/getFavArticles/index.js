// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  // {
  //   env: 'dv-963c46'
  // }
)

const db = cloud.database()
const _= db.command

/** 获取喜欢的影单 */
const getFavArticles = (event, context) => {
    const { userInfo: { openId } } = event
    return db.collection('userRelations').where({
        _openid: openId,
    }).get().then(({ data }) => {
        if (data.length) {
            return db.collection('articles').where({
                id: _.in(data[0].favoriteArticles ? data[0].favoriteArticles.map(item => Number(item)) : []),
            }).field({
                id: true,
                image: true,
                likeCount: true,
                title: true,
            }).get().then(({ data }) => {
                return {
                    data,
                    message: 'success',
                }
            }).catch( err => {
                console.error('*** 错误 ***', err)
                return Promise.reject({
                    data: [],
                    message: err.errMsg || JSON.stringify(err)
                })
            })
        } else {
            return {
                data: [],
                message: 'success',
            }
        }
    }).catch( err => {
        console.error('*** 错误 ***', err)
        return Promise.reject({
            data: [],
            message: err.errMsg || JSON.stringify(err)
        })
    })
}

// 云函数入口函数
exports.main = async (event, context) => {
    return getFavArticles(event, context)
}