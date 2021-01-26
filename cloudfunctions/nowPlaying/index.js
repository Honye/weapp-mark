// 云函数入口文件
const cloud = require('wx-server-sdk');
const { fetchNowPlaying } = require('./fetch');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const list = await fetchNowPlaying();
  return list;
}