// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const { request } = require('./request.js');
const db = cloud.database();

/**
 * 云函数入口函数
 * @param {object} event
 * @param {'cron'} [event.action]
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
  const res = await request({
    headers: {
      'User-Agent': 'api-client/0.1.3 com.douban.frodo/6.50.0'
    },
    path: '/calendar/today',
    data: {
      date: (new Date()).toISOString().substring(0, 10),
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
    const updateData = {
      douban: params,
      update_at: db.serverDate()
    };
    return await userCollection.doc(user._id)
      .update({
        data: updateData
      });
  }
  throw new Error(`user openid=${wxContext.OPENID} not found`);
}

