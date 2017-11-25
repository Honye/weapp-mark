
Page({

  data: {
    rating: 7.5,
    max: 10,
    path: ''
  },

  handleChange: function(e) {
    console.log("事件", e.detail);
    this.setData({
      rating: e.detail.value
    })
  },

  onReady: function(e) {
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('firstCanvas')

    context.drawImage(
      'http://oz126ti4w.bkt.clouddn.com/image/2017110711091269781.jpg',
      0,0,350,200
    )
    context.fillText('隐约雷鸣 阴霾天空 但盼风雨来 能留你在此↵隐约雷鸣 阴霾天空 即使无风雨 我亦留此地',10,220)
    context.setStrokeStyle("#00ff00")
    context.setLineWidth(5)
    context.rect(0, 0, 200, 200)
    context.stroke()
    context.setStrokeStyle("#ff0000")
    context.setLineWidth(2)
    context.moveTo(160, 100)
    context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    context.moveTo(140, 100)
    context.arc(100, 100, 40, 0, Math.PI, false)
    context.moveTo(85, 80)
    context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    context.moveTo(125, 80)
    context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    context.stroke()
    context.draw()
  },

  saveCanvas() {
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: res => {
        console.log('成功', res);
        this.setData({
          path: res.tempFilePath
        })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res => {
            console.log("保存成功", res);
          },
          fail: err => {
            console.log("保存失败", err)
          }
        })
      },
      fail: err => {
        console.log("失败", err);
      }
    })
  },

})