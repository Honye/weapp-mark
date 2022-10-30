/**
 * GitHub 相关云函数入口
 */

/**
 * @typedef {object} ResponseType 云函数调用成功响应
 * @property {number} code 0：成功；-1：失败
 * @property {any} data 请求结果
 * @property {string} message 请求信息
 */

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const { request } = require('./fetch');
const db = cloud.database();

/**
 * 云函数入口函数
 * @param {object} event
 * @param {string} event.action
 * @param {object} event.data
 */
exports.main = async (event, context) => {
  const { action } = event;
  switch (action) {
    case 'setAccessToken':
      return setAccessToken(event.data);
    case 'getStarredList':
      return getStarredList(event.data);
    case 'removeAccessToken':
      return removeAccessToken(event.data);
    case 'homePage':
      return getHomePage(event.data);
    default:
  }
}

const queryUser = async () => {
  const users = db.collection('users');
  const context = cloud.getWXContext();
  const openId = context.OPENID;
  const { data: [user] } = await users.where({ openid: openId })
    .limit(1)
    .get();
  return user;
};

/**
 * 设置 GitHub AccessToken
 * 
 * [new token](https://github.com/settings/tokens/new)
 * 
 * @param {object} params
 * @param {string} params.token
 */
const setAccessToken = async (params) => {
  const users = db.collection('users');
  const context = cloud.getWXContext();
  const openId = context.OPENID;
  const updateTime = new Date();
  const { data: [user] } = await users.where({
    openid: openId
  })
    .limit(1)
    .get();
  
  if (!user) {
    /** @type {ResponseType} */
    const ret = {
      code: -1,
      message: 'user not found',
    };
    return ret;
  }

  await users.doc(user._id)
    .update({
      data: {
        update_at: updateTime,
        githubToken: params.token
      }
    });
  
  /** @type {ResponseType} */
  const ret = {
    code: 0,
    message: 'set github token success'
  };
  return ret;
};

const removeAccessToken = async () => {
  const user = await queryUser();
  /** @type {ResponseType} */
  const ret = {
    code: 0,
    message: 'remove github token success'
  };
  if (!user) {
    ret.code = -1;
    ret.message = 'user not found';
    return ret;
  }
  const users = db.collection('users');
  await users.doc(user._id)
    .update({
      data: {
        update_at: db.serverDate(),
        githubToken: null
      }
    });
  return ret;
};

/**
 * 获取用户 Star repositories
 * 
 * [List repositories starred by the authenticated user](https://docs.github.com/en/rest/reference/activity#list-repositories-starred-by-the-authenticated-user)
 * 
 * @param {object} params
 * @param {'created'|'updated'} params.sort
 * @param {'asc'|'desc'} params.direction
 * @param {number} params.per_page max 100
 * @param {number} params.page
 */
const getStarredList = async (params) => {
  const resp = await request({
    path: '/user/starred',
    data: params
  })
    .then(resp => resp.json());
  return {
    code: 0,
    data: resp
  };
};

/**
 * GitHub user home page info
 * 
 * @param {object} params
 * @param {string} params.user
 */
const getHomePage = async (params) => {
  return request({
    url: `https://www.imarkr.com/api/github/${params.user}`
  }).then((resp) => resp.json());
};
