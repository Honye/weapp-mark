
Page({

  data: {
    rating: 7.5,
    max: 10
  },

  handleChange: function(e) {
    console.log("事件", e.detail);
    this.setData({
      rating: e.detail.value
    })
  }

})