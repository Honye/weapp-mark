// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { id: cardID } = event;
  const { OPENID } = cloud.getWXContext();
  const collectionName = 'card_like';
  let record;
  try {
    const records = await db.collection(collectionName)
      .where({
        openid: OPENID,
        card_id: cardID
      })
      .limit(1)
      .get();
    record = records.data[0];
  } catch (e) {
    if (e.errCode === -502005) {
      /** 集合不存在，新创建集合 */
      await db.createCollection(collectionName);
    }
  }

  if (record) {
    return await db.collection(collectionName)
      .doc(record._id)
      .update({
        data: {
          update_at: db.serverDate(),
          state: Number(!record.state)
        }
      });
  }

  /** 不存在集合时肯定是做喜欢操作 */
  return await db.collection(collectionName)
    .add({
      data: {
        openid: OPENID,
        create_at: db.serverDate(),
        update_at: db.serverDate(),
        card_id: cardID,
        state: 1
      }
    });
}
