// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  // {
  //   env: 'dv-963c46'
  // }
)

const db = cloud.database()

/** 获取是否喜欢 */
const getFavStatus = (event, context) => {
    const { userInfo: { openId }, id: articleID } = event
    return db.collection('userRelations').where({
        _openid: openId,
    }).get().then(({ data }) => {
        let result = false
        if (data.length) {
            result = data[0].favoriteArticles && data[0].favoriteArticles.includes(articleID)
        }
        return {
            data: result,
            message: 'success',
        }
    }).catch( err => {
        return Promise.reject({
            data: false,
            message: err.errMsg || JSON.stringify(err),
        })
    })
}

// 云函数入口函数
exports.main = async (event, context) => {
    return getFavStatus(event, context)
}