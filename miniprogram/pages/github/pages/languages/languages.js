import languages from '../../../../utils/github-colors';

Page({
  data: {
    /**
     * @type {Array<{
     * alpha: string;
     * anchor: string;
     * subItems: Array<{
     *   name: string;
     *   color: string;
     * }>
     * }>}
     */
    list: [],
    changed: false
  },

  onLoad () {
    this.setLanguages();
  },

  onUnload () {
    // 如果 stared 改变了就通知上一页改变后的 stared 列表
    const { _changed, list } = this.data;
    if (_changed) {
      const first = list[0];
      let stared = [];
      if (first.anchor === 'star') {
        stared = first.subItems;
      }
      this.getOpenerEventChannel()?.emit?.('onChange', { stared });
    }
  },

  setLanguages () {
    const list = Object.keys(languages)
      .map((key) => {
        return {
          alpha: key.charAt(0).toUpperCase(),
          data: {
            name: key,
            ...languages[key]
          }
        }
      })
      .sort((c1, c2) => {
        const isNaN1 = isNaN(Number(c1.alpha));
        const isNaN2 = isNaN(Number(c2.alpha));
        // 不考虑中文和特殊字符
        if (isNaN1 && isNaN2) {
          // case 都是字母
          return c1 - c2;
        }
        if (!isNaN1 && !isNaN2) {
          // case 都是数字
          return c1 - c2;
        }
        // 其中一个是数字、一个是字母
        if (isNaN1) {
          return -1;
        } else {
          return 1;
        }
      });
    
    const map = new Map();
    for (const lang of list) {
      const alpha = isNaN(lang.alpha) ? lang.alpha : '#';
      if (!map.has(alpha)) {
        map.set(alpha, []);
      }
      map.get(alpha).push(lang.data);
    }
    const res = [];
    for (const [alpha, items] of map) {
      res.push({
        alpha,
        anchor: alpha === '#' ? 'shaf' : alpha,
        subItems: items
      });
    }
    this.setData({ list: res });
  },

  handleChoose (e) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel?.emit?.('choose', { value: e.detail.item });
    wx.navigateBack();
  },

  onLangStar (e) {
    this.data._changed = true;
    const { data, stared, indexes } = e.detail.value;
    const { list } = this.data;
    const firstItem = list[0];
    list[indexes[0]].subItems[indexes[1]].stared = stared;
    if (stared) {
      if (firstItem.anchor === 'star') {
        firstItem.subItems.push(data);
      } else {
        list.unshift({
          alpha: '✩',
          anchor: 'star',
          subItems: [data]
        });
      }
    } else {
      if (firstItem.anchor === 'star') {
        const { subItems } = firstItem;
        if (subItems.length === 1) {
          list.splice(0, 1);
        } else {
          const index = firstItem.subItems.findIndex((item) => item.name === data.name);
          subItems.splice(index, 1);
        }
      }
    }
    this.setData({ list });
  }
});
