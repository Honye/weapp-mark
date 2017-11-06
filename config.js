
var douBanHost = "https://api.douban.com";
var gitHubHost = "https://hongye567.github.io";
var codingHost = "https://honye.coding.me";

var config = {

  douBanHost,

  gitHubHost,

  codingHost,
  // 默认配置
  configUrl: `${gitHubHost}/static/json/config.json`,
  // 首页轮播图
  bannersUrl: `${gitHubHost}/static/json/banner.json`,
  // 首页文章
  acticlesUrl: `${gitHubHost}/static/json/articles.json`,
  // 分类类别
  classifyUrl: `${gitHubHost}/static/json/classify.json`,
  // 每日卡片
  cardsUrl: `${gitHubHost}/static/json/cards.json`,
  // 豆瓣热映
  inTheatersUrl: `${douBanHost}/v2/movie/in_theaters`,
  // 即将上映
  commingSoonUrl: `${douBanHost}/v2/movie/coming_soon`,
  // 影视条目信息
  subjectInfoUrl: `${douBanHost}/v2/movie/subject`,
  // 影视搜索
  searchUrl: `${douBanHost}/v2/movie/search`,
};

module.exports = config;