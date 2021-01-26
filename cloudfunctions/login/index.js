// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const login = async (event, context) => {
  const wxUserInfo = event.wxUserInfo && event.wxUserInfo.data;
  if (typeof wxUserInfo === 'object') {
    // 😞用户表里字段和微信返回的字段大小写不一致，避免存多字段，替换字段
    wxUserInfo.openid = wxUserInfo.openId || wxUserInfo.openid;
    delete wxUserInfo.openId;
    wxUserInfo.unionid = wxUserInfo.unionId || wxUserInfo.unionid;
    delete wxUserInfo.unionId;
  }

  try {
    await db.createCollection('users');
  } catch (err) {
    // "users" collection already exist
    // do nothing
  }
  const usersCollection = db.collection('users');
  const wxContext = cloud.getWXContext();
  const { data: users } = await usersCollection
    .where({
      openid: wxContext.OPENID
    })
    .limit(1)
    .get();
  if (users && users.length) {
    const user = users[0];
    const updateData = {
      latest_login: db.serverDate()
    };
    if (typeof wxUserInfo === 'object') {
      // 只更新用户表不存在的信息和 rawData
      updateData.rawData = wxUserInfo;
      for (const key in wxUserInfo) {
        if (Object.prototype.hasOwnProperty.call(wxUserInfo, key) && !user[key]) {
          updateData[key] = wxUserInfo[key];
        }
      }
    }
    await usersCollection.doc(user._id)
      .update({
        data: updateData
      });
    return {
      data: { ...user, ...updateData },
      message: 'cloud.login:ok'
    };
  } else {
    const serverDate = db.serverDate();
    const user = {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
      create_at: serverDate,
      update_at: serverDate,
      latest_login: serverDate
    };
    if (typeof wxUserInfo === 'object') {
      // 只更新用户表不存在的信息和 rawData
      Object.assign(user, {
        ...wxUserInfo,
        ...user,
        rawData: wxUserInfo
      });
    }
    const { _id } = await usersCollection.add({
      data: user
    });
    return {
      data: {
        _id,
        ...user
      },
      message: 'cloud.login:ok'
    };
  }
};

// 云函数入口函数
exports.main = async (event, context) => {
  return await login(event, context);
}