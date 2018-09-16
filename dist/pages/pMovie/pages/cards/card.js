// 每日卡片
import { $markShare } from '../../../common/index'
import wxCloud from '../../../../utils/wxCloud'

Page({

    data: {
        cards: [{}],
        current: 0,
        visible: false,
    },

    onLoad(options) {
        this.getCards()
    },

    /** 获取卡片 */
    getCards() {
        wxCloud('getCards').then( res => {
            this.setData({
                cards: res.data,
            })
        })
    },

    /** 用户点击右上角分享 */
    onShareAppMessage() {
        const { cards, current } = this.data
        return {
            title: cards[current].quote,
            path: `/pages/card/card?current=${current}`,
            imageUrl: cards[current].image,
        }
    },

    /** 切换卡片 */
    onChange(event) {
        this.setData({
            current: event.detail.current,
        })
    },

    /** 分享 */
    showShareMenu(e) {
        $markShare.show({
            titleText: '',
            buttons: [{
                    iconPath: '/assets/images/weixin_icon.png',
                    title: '微信好友',
                    openType: 'share'
                },
                {
                    iconPath: '/assets/images/weixin_circle_icon.png',
                    title: '微信朋友圈'
                },
                {
                    iconPath: '/assets/images/qq_icon.png',
                    title: 'QQ好友'
                },
                {
                    iconPath: '/assets/images/weibo_icon.png',
                    title: '微博'
                },
                {
                    iconPath: '/assets/images/save_pic_icon.png',
                    title: '保存图片'
                },
                {
                    iconPath: '/assets/images/share_more_icon.png',
                    title: '更多'
                },
            ],
            buttonClicked(index, item) {
                if (!item.openType) {
                    wx.showModal({
                        content: item.title,
                    })
                }
                return true
            }
        })
    },

    /** 喜欢/取消喜欢 */
    onFavChange(e) {
        const { checked } = e.detail
        let { cards, current } = this.data
        wxCloud('favCard', {
            id: cards[current].id,
        }).then( res => {
            wx.showToast({
                title: res.message,
            })
            cards[current].liked = !checked
            cards[current].likeCount = checked ? --cards[current].likeCount : ++cards[current].likeCount
            this.setData({ cards })
        })
    },
})