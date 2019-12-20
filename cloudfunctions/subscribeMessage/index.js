// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async () => {
  const wxContext = cloud.getWXContext()
  console.log('openid==>', wxContext.OPENID)

  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: wxContext.OPENID,
      templateId: 'sJz8Heo9GSqMwhnJFlpEHbm-rmIhUlhOkEOoSvY6BwE',
      data: {
        thing1: {
          value: '《Dr.STONE》',
        },
        time2: {
          value: '2019-12-16 10:00:00'
        },
        name3: {
          value: 'Honye'
        },
      }
    })
    return result
  } catch (err) {
    console.error(err)
    return err
  }
}