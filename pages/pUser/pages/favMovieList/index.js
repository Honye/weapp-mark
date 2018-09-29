// 喜欢的影单
import wxCloud from '../../../../utils/wxCloud'

Page({

    data: {
        list: null,
    },

    onLoad(options) {
        this.getFavArticles()
    },

    /** 获取喜欢的影单 */
    getFavArticles() {
        wxCloud('getFavArticles').then( res => {
            this.setData({
                list: res.data,
            })
        })
    },
    
    /** 取消喜欢 */
    onFavChange(e) {
        const { index, id } = e.currentTarget.dataset
        const { checked } = e.detail
        let { list } = this.data
        if (checked) {
            wxCloud('favArticle', { id }).then( res => {
                list.splice(index, 1)
                this.setData({ list })
                wx.showToast({
                    title: res.message,
                })
            })
        }
    }
})