const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  
  try {
    const { data = [] } = await db.collection('app')
      .orderBy('created_at', 'desc')
      .limit(1)
      .get();
    return data[0];
  } catch (e) {
    // 集合不存在
    if (e.errCode === -502005) {
      return { version: '0.0.0' };
    }
    throw e;
  }
}
