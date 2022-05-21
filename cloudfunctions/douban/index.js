// 云函数入口文件
const cloud = require('wx-server-sdk');
const fetch = require('node-fetch');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const { request } = require('./request.js');
const db = cloud.database();

/**
 * 云函数入口函数
 * @param {object} event
 * @param {'cron'|'api.proxy'|'login'|'logout'|'fetch'} [event.action]
 * @param {object} [event.payload]
 */ 
exports.main = async (event, context) => {
  /** 默认视为定时任务 */
  const { action = 'cron' } = event;
  switch (action) {
    case 'cron':
      /** 每日定时存储每日卡片信息 */
      await storeTodayItem();
      break;
    case 'login':
      return login(event.payload);
    case 'logout':
      return logout();
    case 'fetch': {
      const { url, ...payload } = event.payload;
      return fetch(url, payload).then((resp) => resp.json());
    }
    default:
  }

  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

/**
 * 将今日豆瓣日历卡片存入集合
 * 
 * - 用于定时任务
 */
const storeTodayItem = async () => {
  // 云函数默认时区为 UTC+0
  const date = new Date();
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  const now = new Date(utcTime + 8 * 60 * 60 * 1000);
  const res = await request({
    headers: {
      'User-Agent': 'api-client/0.1.3 com.douban.frodo/6.50.0'
    },
    path: '/calendar/today',
    data: {
      date: now.toISOString().substring(0, 10),
      alt: 'json',
      _sig: 'tuOyn+2uZDBFGAFBLklc2GkuQk4=',
      _ts: 1610703479,
      apiKey: '0ab215a8b1977939201640fa14c66bab'
    }
  });
  return db.collection('cards').add({
    data: {
      createTime: db.serverDate(),
      image: res.comment.poster,
      likeCount: 0,
      movieId: res.subject.id,
      quote: res.comment.content,
      shareCount: 0,
      source: `《${res.subject.title}》`
    }
  });
}

/**
 * 存储登录用户信息及 token
 * @param {object} params
 * @param {string} params.uid
 * @param {string} params.user_name
 * @param {string} params.access_token
 * @param {string} params.refresh_token
 * @param {number} params.expires_in token 有效时间，秒为单位
 */
const login = async (params) => {
  const wxContext = cloud.getWXContext();
  const userCollection = db.collection('users');
  const { data: users = [] } = await userCollection
    .where({
      openid: wxContext.OPENID
    })
    .limit(1)
    .get();
  const user = users[0];
  if (user) {
    const { expires_in: expiresIn, ...douban } = params;
    const updateData = {
      douban: {
        ...douban,
        expires_at: db.serverDate({
          offset: (expiresIn - 60) * 1000
        })
      },
      update_at: db.serverDate()
    };
    const { _id, ...profile } = user;
    return await userCollection.doc(_id)
      .set({
        data: { ...profile, ...updateData },
      });
  }
  throw new Error(`user openid=${wxContext.OPENID} not found`);
}

const logout = async () => {
  const wxContext = cloud.getWXContext();
  const usersCollection = db.collection('users');
  const user = await usersCollection
    .where({ openid: wxContext.OPENID })
    .limit(1)
    .get()
    .then(({ data }) => data[0]);
  
  if (user) {
    return usersCollection.doc(user._id)
      .update({
        data: { douban: null },
        update_at: db.serverDate(),
      });
  }

  throw new Error(`user openid=${wxContext.OPENID} not found`);
};
}

