Page({

  data: {
    /** @type {Array<Categorie>} */
    categories: [],
    list: [],
    loaded: false,
  },

  onLoad(options) {
    this.getData()
  },

  /**
   * 获取数据
   */
  async getData () {
    const data = [
      {
        name: '榜单',
        icon: 'https://i.loli.net/2019/12/30/xyh67CYXlOeEoSp.png',
        children: [
          {
            name: '一周口碑',
            url: '/packages/douban/pages/collection/collection?type=movie_weekly_best'
          },
          {
            name: 'TOP250',
            url: '/packages/douban/pages/collection/collection?type=movie_top250'
          },
          {
            name: '华语口碑',
            url: '/packages/douban/pages/collection/collection?type=tv_chinese_best_weekly'
          },
          {
            name: '全球口碑',
            url: '/packages/douban/pages/collection/collection?type=tv_global_best_weekly'
          },
          {
            name: '华语电影',
            url: '/packages/douban/pages/collection/collection?type=ECFYHQBWQ'
          },
          {
            name: '外语电影',
            url: '/packages/douban/pages/collection/collection?type=ECFQHXCTQ'
          },
          {
            name: '冷门佳片',
            url: '/packages/douban/pages/collection/collection?type=ECOUHS3TY'
          },
          {
            name: '经典科幻',
            url: '/packages/douban/pages/collection/collection?type=movie_scifi'
          },
          {
            name: '经典喜剧',
            url: '/packages/douban/pages/collection/collection?type=movie_comedy'
          },
          {
            name: '经典动作',
            url: '/packages/douban/pages/collection/collection?type=movie_action'
          },
          {
            name: '经典爱情',
            url: '/packages/douban/pages/collection/collection?type=movie_love'
          }
        ]
      }
    ];
    this.modifyData(data);
  },

  /**
   * 调整数据
   * @param {Array<Categorie>} categories
   */
  modifyData(categories) {
    for (let item of categories) {
      if (item.children.length < 6) {
        for (let i = 0, length = (6 - item.children.length); i < length; i++) {
          item.children.push(" ");
        }
      } else if ((item.children.length - 6) % 4 !== 0) {
        for (let i = 0, length = (4 - (item.children.length - 6) % 4); i < length; i++) {
          item.children.push(" ");
        }
      }
    }
    this.setData({
      list: categories,
      loaded: true
    });
  },

  toList(e) {
    const {item} = e.currentTarget.dataset;
    if(item!=" ") {
      if (item.url) {
        wx.navigateTo({
          url: item.url
        });
      }
    }
  }
})

/**
 * @typedef {{
 * _id: string;
 * id: number;
 * name: string;
 * icon?: string;
 * pid: number;
 * children?: Array<Categorie>
 * }} Categorie 分类
 */
