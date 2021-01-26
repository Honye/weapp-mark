// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const fetchTrendingList = async () => {
  const data = await fetch('https://github.com/trending');
  const $ = cheerio.load(await data.text());
  const list = $('.Box .Box-row')
    .get()
    .map(repo => {
      const $repo = $(repo);
      const title = $repo.find('.h3').text().trim();
      const [owner, name] = title.split('/').map(v => v.trim());
      return `${owner}/${name}`;
    });
  return list;
};

// 云函数入口函数
exports.main = async (event, context) => {
  return fetchTrendingList();
}