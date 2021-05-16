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
    // case 老用户登录，更新用户信息
    const user = users[0];
    const serverDate = db.serverDate();
    const updateData = {
      latest_login: serverDate,
      update_at: serverDate
    };
    if (typeof wxUserInfo === 'object') {
      // 每次登录都更新最新信息
      updateData.rawData = wxUserInfo;
      for (const key in wxUserInfo) {
        if (
          Object.prototype.hasOwnProperty.call(wxUserInfo, key)
          && !isInvalid(wxUserInfo[key])
        ) {
          updateData[key] = wxUserInfo[key];
        }
      }
    }
    await usersCollection.doc(user._id)
      .update({
        data: updateData
      });
    const updatedUser = { ...user, ...updateData };
    if (updatedUser.douban) {
      const { expires_at: expiresAt } = updatedUser.douban;
      if (!expiresAt || new Date(expiresAt).getTime() < Date.now()) {
        // 豆瓣登录已失效，清除 access_token
        updatedUser.douban.access_token = '';
      }
    }
    return {
      data: updatedUser,
      message: 'cloud.login:ok'
    };
  }

  // case 新用户登录
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
    // 每次登录都更新最新信息
    user.rawData = wxUserInfo;
    for (const key in wxUserInfo) {
      if (
        Object.prototype.hasOwnProperty.call(wxUserInfo, key)
        && !isInvalid(wxUserInfo[key])
      ) {
        user[key] = wxUserInfo[key];
      }
    }
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
};

const isInvalid = (data) => {
  return data === undefined
    || data === null
    || data === ''
    || (typeof data === 'number' && isNaN(data));
}

// 云函数入口函数
exports.main = async (event, context) => {
  return await login(event, context);
}