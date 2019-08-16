/**
 * 演职员
 */
export default class Cast {
    
    id = 0       // ID
    avatar = ''  // 头像
    name = ''    // 名字
    type = ''    // 导演？演员？
    role = ''    // 角色名

    /**
     * 构造器
     * @param {Object} props 
     * @param {Number} props.id ID
     * @param {String} props.type ['Director', 'Actor']
     * @param {String} props.avatar 头像
     * @param {String} props.name 名字
     * @param {String} props.role 角色名
     */
    constructor(props) {
        this.id = props.id
        this.type = props.type
        this.avatar = props.avatar
        this.name = props.name
        this.role = props.role
    }

    /**
     * 获取演职员实例
     * @param {String} json 从时光网转换
     */
    static fromMtime(json) {
        const item = JSON.parse(json)
        return new Cast({
            id: item.id,
            type: item.type || 'Actor',
            avatar: item.image,
            name: item.name,
            role: item.personate,
        })
    }

    /**
     * 从豆瓣网获取演职员信息
     * @param {String} json
     */
    static fromDouban(json) {
        const item = JSON.parse(json)
        return new Cast({
            id: item.id,
            type: item.type || 'Actor',
            avatar: item.avatars.medium,
            name: item.name,
            role: '',
        })
    }

}
