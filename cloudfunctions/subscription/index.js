// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

const send = async (openid, data) => {
  return await cloud.openapi.subscribeMessage.send({
    touser: openid,
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
};

// 云函数入口函数
exports.main = async (event, context) => {
  const usersCollection = db.collection('users');
  const { data: users } = await usersCollection
    .limit(1)
    .get();
  for (const user of users) {
    await send(user.openid);
  }

  return {
    data: null,
    message: 'cloud.subscription:ok'
  }
}