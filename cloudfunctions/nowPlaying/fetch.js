const cheerio = require('cheerio');
const fetch = require('node-fetch');

const fetchTrendingList = async () => {
  const data = await fetch('https://github.com/trending');
  const $ = cheerio.load(await data.text());
  const allTitles = $('.Box .Box-row')
    .get()
    .map(repo => {
      const $repo = $(repo);
      const title = $repo.find('.h3').text().trim();
      const [owner, name] = title.split('/').map(v => v.trim());
      return `${owner}/${name}`;
    });
  console.log(allTitles);
};

const fetchNowPlaying = async () => {
  const data = await fetch('https://movie.douban.com/cinema/nowplaying/wuhan/');
  const $ = cheerio.load(await data.text());
  const movies = $('ul.lists .list-item')
    .get()
    .map(movie => {
      const $movie = $(movie);
      const id = $movie.attr('id');
      const title = $movie.attr('data-title');
      const realTime = $movie.attr('data-release');
      const duration = $movie.attr('data-duration');
      const rating = $movie.attr('data-score');
      const img = $movie.find('.poster img')
        .attr('src');
      return {
        id,
        title,
        realTime,
        durations: [duration],
        rating,
        img
      };
    });
  console.log('movies===', movies);
  return movies;
};

module.exports = {
  fetchTrendingList,
  fetchNowPlaying
};