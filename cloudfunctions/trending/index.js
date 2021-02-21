// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const fetchTrendingList = async () => {
  const data = await fetch('https://github.com/trending');
  const $ = cheerio.load(await data.text());
  const list = $('.Box .Box-row')
    .get()
    .map(repo => {
      const $repo = $(repo);
      const title = $repo.find('.h3').text().trim();
      const [owner, name] = title.split('/').map(v => v.trim());
      const description = $(($repo.children())[2]).text().trim();
      const language = $repo.find('[itemprop="programmingLanguage"]').text().trim();
      const starCount = $repo.find('[aria-label="star"].octicon.octicon-star').parent().text().trim();
      return {
        owner: {
          login: owner
        },
        name,
        description,
        language,
        stargazers_count: starCount
      };
    });
  return list;
};

// 云函数入口函数
exports.main = async (event, context) => {
  return fetchTrendingList();
}