// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const qs = require('querystring');

/**
 * 已迁移至 Vercel
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const usedInVercel = async () => {
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
          login: owner,
          avatar_url: `https://github.com/${owner}.png`
        },
        name,
        description,
        language,
        stargazers_count: starCount
      };
    });
  return list;
};

const fetchTrendingList = async (params) => {
  let url = 'https://www.imarkr.com/api/trending';
  if (params) {
    const query = qs.stringify(params);
    if (query) {
      url += `?${query}`;
    }
  }
  const data = await fetch(url).then((resp) => resp.json());
  return data;
}

/**
 * 云函数入口函数
 * 
 * @param {object} event
 * @param {string} [event.language]
 * @param {'daily'|'weekly'|'monthly'} [event.since]
 * @param {string} [event.spoken_language_code]
 */
exports.main = async (event, context) => {
  return fetchTrendingList(event);
}