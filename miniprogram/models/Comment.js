/**
 * 影片短评
 */
import utils from '../utils/util'

export default class Comment {
    id = 0         // ID
    nickname = ''  // 昵称
    avatar = ''    // 头像
    rating = 0     // 评分
    time = ''      // 评论时间
    content = ''   // 评论内容

    constructor(props) {
        this.id = props.id
        this.nickname = props.nickname
        this.avatar = props.avatar
        this.rating = props.rating
        this.time = props.time
        this.content = props.content
    }

    static fromMtime(obj) {
        return new Comment({
            id: obj.tweetId,
            nickname: obj.ca,
            avatar: obj.caimg,
            rating: obj.cr,
            time: obj.cd ? utils.formatTime(new Date(obj.cd)) : '',
            content: obj.ce,
        })
    }

    static fromDouban(obj) {
        return new Comment({
            id: obj.id,
            nickname: obj.user.name,
            avatar: obj.user.avatar,
            rating: obj.rating && obj.rating.value * 2,
            time: obj.create_time,
            content: obj.comment,
        })
    }
}