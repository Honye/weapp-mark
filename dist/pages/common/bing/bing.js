// 必应壁纸
'use strict';
import utils from './../../../utils/util.js';

export default class Bing {

  constructor() {
    const pages = getCurrentPages();
    this.page = pages[pages.length-1]
    this.setData = this.page.setData.bind(this.page)
    this._init()
  }

  _init() {
    let bings = [];
    for (let i = 0; i < 10; i++) {
      let bing = {};
      bing.title = utils.getPreDate(i);
      bing.image = `https://bing.ioliu.cn/v1?d=${i}`;
      bings.push(bing);
    }
    this.setData({ bings });
    this._initMethod()
  }

  /**
   * 将方法挂载到 page 上
   */
  _initMethod() {
    this.page['$mark.onPreImg'] = (e) => {
      const { url } = e.currentTarget.dataset,
        { bings } = this.page.data;
      let urls = [];
      for (let item of bings) {
        urls.push(item.image)
      }
      wx.previewImage({
        current: url,
        urls
      })
    }
  }

}