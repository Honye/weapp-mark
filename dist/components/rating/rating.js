// 组件-评分

Component({

  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    },
    rating: {
      type: Number,
      value: 7.5
    },
    max: {
      type: Number,
      value: 10
    }
  },

  data: {
    // 这里是一些组件内部数据
    someData: {}
  },

  methods: {
    // 这里是一个自定义方法
    customMethod: function () { }
  }

})