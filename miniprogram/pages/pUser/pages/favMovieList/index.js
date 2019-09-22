// 喜欢的影单
import wxCloud from '../../../../utils/wxCloud'

Page({

    data: {
        tabs: ['我的', '喜欢'],
        currentNav: 0,
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
    },

    handleTabChange(e) {
        const { value } = e.detail
        console.log('tab change', value)
    },

    handleTabItemTap(e) {
        const { value } = e.detail
        console.log('tab item tap', value)
    },

    /** 改变 Tab */
    changeTab(e) {
        const { nav } = e.currentTarget.dataset;
        const { currentNav } = this.data;
        if (currentNav != nav) {
            this.setData({
                currentNav: nav
            });
        }
    },

    showMoreAction() {
        wx.showActionSheet({
            itemList: ["编辑", "分享", "删除"],
            success(res) {
                console.log("操作", res.tapIndex)
            },
        })
    },
})