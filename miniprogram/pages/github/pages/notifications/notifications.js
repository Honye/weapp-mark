import * as GitHubApis from '../../../../apis/github';

Page({
  data: {
    list: []
  },

  onLoad () {

    this.getStarredList();

    this.getAllNotifications();

    GitHubApis.getRepoReadme({
      owner: 'honye',
      repo: 'weapp-mark'
    })
      .then((res) => {
        console.log('repository readme', res);
      });
  },

  getAllNotifications () {
    GitHubApis.getNotifications({
      all: true,
      since: new Date('2020/05/19').toISOString(),
      per_page: 10,
      page: 1
    })
      .then((res) => {
        console.log('GitHub notifications', res);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  async getStarredList () {
    const resp = await GitHubApis.getStarredList({
      sort: 'created',
      direction: 'desc',
      per_page: 2,
      page: 1
    });
    console.log('Starred list==', resp);
    this.setData({
      list: resp
    });
  }
});
