
/**
 * wx.callFunction 的简单封装
 * @param {String} name 云函数名
 * @param {Object} data 传递参数
 * @param {Boolean} loading 是否显示加载提示框
 * @param {Boolean} showError 是否显示错误提示框
 */
const call = (name, data, loading = true, showError = true) => {
    if (loading) {
        wx.showLoading({
            title: 'loading...',
        })
    }
    
    return wx.cloud.callFunction({
        name,
        data,
    }).then(({ result, errMsg }) => {
        if (loading) {
            wx.hideLoading()
        }
        if (result) {
            return result
        } else {
            return Promise.reject({
                message: errMsg,
            })
        }
    }).catch( err => {
        if (loading) {
            wx.hideLoading()
        }
        if (showError) {
            wx.showModal({
                title: '异常',
                content: err.message || '未知异常',
            })
        }
        return Promise.reject(err)
    })
}

export default call
