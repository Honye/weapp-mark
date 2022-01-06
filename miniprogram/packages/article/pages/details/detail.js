// 文章详情
import { Honye } from '../../../../utils/apis'
import WxParse from '../../../../pages/common/wxParse/wxParse'
import { $markShare } from '../../../../pages/common/index'
import wxCloud from '../../../../utils/wxCloud'

Page({

    data: {
        detail: null,
        checked: false
    },

    /** 生命周期函数--监听页面加载 */
    onLoad(options) {
        const id = Number(options.id)
        this.setData({
            articleID: id,
        })
        this.getDetail(id)
    },

    /**
     * 获取详情
     * @param {String} id 文章 ID
     */
    getDetail(id) {
        wx.showLoading({
            title: 'loading...',
        })
        Promise.all([
            Honye.get(`${Honye.ARTICLE_DETAIL}/${id}`),
            wxCloud('getArticleDetails', { id }),
        ]).then(([res1, res2]) => {
            this.setData({
                detail: res1,
                checked: res2.data,
            }, () => {
                WxParse.wxParse('article', 'html', res1.content, this)
            })
            wx.hideLoading()
        })
    },

    /** 💓 / 💔 */
    handleFavChange(e) {
        wxCloud('favArticle', {
            id: this.data.articleID,
        }).then( res => {
            const { checked } = this.data;
            this.setData({
                checked: !checked
            })
            wx.showToast({
                title: res.message,
            })
        })
    },

    /** 评论 */
    handleComment(e) {
        wx.showToast({
            title: '评论',
        })
    },

    /** 分享 */
    handleShare(e) {
        $markShare.show({
            titleText: '',
            buttons: [
                {
                    iconPath: '/assets/images/weixin_icon.png',
                    title: '微信好友',
                    openType: 'share'
                },
                {
                    iconPath: '/assets/images/weixin_circle_icon.png',
                    title: '微信朋友圈'
                },
                {
                    iconPath: '/assets/images/qq_zone_icon.png',
                    title: 'QQ空间'
                },
                {
                    iconPath: '/assets/images/copy_link_icon.png',
                    title: '复制链接'
                }
            ],
            buttonClicked(index, item) {
                if (!item.openType)
                    if (index == 5) {
                        wx.setClipboardData({
                            data: 'https://github.com/Hongye567/weapp-mark',
                            success: res => {
                                wx.showToast({
                                    title: '已复制到剪贴板',
                                })
                            }
                        })
                    } else {
                        wx.showModal({
                            content: item.title,
                        })
                    }
                return true
            }
        })
    }
})