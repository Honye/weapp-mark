// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 云函数入口函数
exports.main = async (event, context) => {
  const { contentType, buffer } = await cloud.openapi.wxacode.get({
    path: 'pages/tabs/discovery/discovery'
  });
  const base64 = buffer.toString('base64');
  return `data:${contentType};base64,${base64}`;
}