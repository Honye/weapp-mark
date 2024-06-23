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
    case 'api.proxy':
      // case 代理接口请求，伪装请求
      return apiProxy(event.payload);
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
  const res = await request({
    headers: {
      'User-Agent': 'api-client/0.1.3 com.douban.frodo/8.0.0'
    },
    path: '/calendar/today',
    data: {
      date: new Intl.DateTimeFormat('zh-CN').format().replace(/\//g, '-'),
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

/**
 * 
 * @param {WechatMiniprogram.RequestOption} params
 */
const apiProxy = (params) => {
  const headers = Object.assign({},
    {
      Referer: 'https://servicewechat.com/wx2f9b06c1de1ccfca/81/page-frame.html',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.2(0x18000236) NetType/WIFI Language/en'
    },
    params.header
  );
  return request({
    url: params.url,
    method: params.method,
    data: params.data,
    headers
  });
}

/**
 * @typedef {'movie_showing'|'movie_soon'} RankType
 */

/**
 * 各个排行榜
 * @param {object} params
 * @param {RankType} params.type
 * @param {object} params.params
 */
const getRankList = async (params) => {
  const collectionName = params.type;
  /** @type {Record<RankType, string>} */
  const names = {
    movie_showing: '正在热映',
    movie_soon: '即将上映'
  };
  /**
   * @type {{
   * _id: string;
   * update_time: Date;
   * }}
   */
  let stored;
  try {
    const ranks = await db.collection(collectionName)
    .where({ key: collectionName })
    .limit(1)
    .get();
    stored = ranks[0];
  } catch (e) {
    if (e.errCode === -502005) {
      await db.createCollection(collectionName);
    }
  }
  if (stored && stored.update_time.getTime() + 2 * 60 * 60 * 1000 > Date.now()) {
    // 每两小时一更新
    return stored.data;
  }

  const res = await apiProxy(params.params);
  if (stored) {
    // case 更新
    db.collection(collectionName)
      .doc(stored._id)
      .update({
        data: {
          update_time: db.serverDate(),
          data: res
        }
      });
  } else {
    // case 存储
    db.collection(collectionName)
      .add({
        data: {
          key: collectionName,
          title: names[collectionName],
          create_time: db.serverDate(),
          update_time: db.serverDate(),
          data: res
        }
      });
  }
  return res;
}
