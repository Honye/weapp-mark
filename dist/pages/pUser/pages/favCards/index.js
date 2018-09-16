// liked cards
import wxCloud from '../../../../utils/wxCloud'

Page({

    data: {
        cards: null,
    },

    /** lifecycle */
    onLoad(options) {
        this.getFavCards()
    },

    /** get the cards user liked */
    getFavCards() {
        wxCloud('getFavCards').then( res => {
            this.setData({
                cards: res.data,
            })
        })
    },
})