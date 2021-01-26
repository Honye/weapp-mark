// 云函数入口文件
const cloud = require('wx-server-sdk');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

cloud.init();

const fetchShowingSoon = async () => {
  const data = await fetch('https://movie.douban.com/cinema/later/shanghai/');
  const $ = cheerio.load(await data.text());
  const movies = $('#showing-soon .item')
    .get()
    .map(movie => {
      const $movie = $(movie);
      const title = $movie.find('.intro h3').text().trim();
      const realTime = $movie.find('.intro li.dt:nth-child(1)').text().trim();
      const genres = $movie.find('.intro li.dt:nth-child(2)').text().trim();
      const img = $movie.find('a.thumb img')
        .attr('src');
      return {
        title,
        realTime,
        genres,
        img
      };
    });
  console.log('movies===', movies);
  return movies;
};

// 云函数入口函数
exports.main = async (event, context) => {
  const list = await fetchShowingSoon();
  return list;
}