// Tabs
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {
        tabs: {
            type: Array,
            value: [],
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        currentIndex: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _handleTabTap(e) {
            const { index } = e.currentTarget.dataset
            const { currentIndex } = this.data
            if (index !== currentIndex) {
                this.setData({
                    currentIndex: index,
                })
                this.triggerEvent('change', { value: index })
            }
            this.triggerEvent('itemtap', { value: index })
        },
    }
})
