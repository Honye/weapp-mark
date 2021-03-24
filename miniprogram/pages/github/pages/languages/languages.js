import languages from '../../../../utils/github-colors';

Page({
  data: {
    list: []
  },

  onLoad () {
    this.setLanguages();
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
    eventChannel && eventChannel.emit('choose', { value: e.detail.item });
    wx.navigateBack();
  }
});
