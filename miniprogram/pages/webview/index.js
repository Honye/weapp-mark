// webview
Page({

    data: {
        url: '',
    },

    /** 生命周期函数--监听页面加载 */
    onLoad(options) {
        this.setData({
            url: options.url,
        })
    },

    /** 页面相关事件处理函数--监听用户下拉动作 */
    onPullDownRefresh() {

    },

    /**  用户点击右上角分享 */
    onShareAppMessage(options) {
        console.log(options.webViewUrl)
    },
})