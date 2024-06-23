// liked cards
import wxCloud from '../../../../utils/wxCloud';

Page({

  data: {
    cards: null,
  },

  onLoad(options) {
    // this.getFavCards();
  },

  /** get the cards user liked */
  async getFavCards() {
    const res = await wxCloud('getFavCards');
    this.setData({ cards: res.list || [] });
  },
});
