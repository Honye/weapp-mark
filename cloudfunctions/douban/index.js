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
      date: (new Intl.DateTimeFormat('zh-Hans-CN').format(new Date())).replace(/\//g, '-'),
      alt: 'json',
      _sig: 'tuOyn+2uZDBFGAFBLklc2GkuQk4=',
      _ts: 1610703479
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