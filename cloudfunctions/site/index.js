// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 
 * @param {object} event
 * @param {'submitPages'} event.action
 * @param {object} [event.payload = {}]
 * @param {Array<{ path: string; query: string; }>} [event.payload.pages]
 */
exports.main = async (event, context) => {
  const { action, payload = {} } = event;

  switch (action) {
    case 'submitPages':
      return await cloud.openapi.search.submitPages(payload);
    default:
  }
}
