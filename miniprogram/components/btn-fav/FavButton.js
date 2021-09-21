// @ts-check
Component({
  properties: {
    height: {
      type: String,
      value: '2em'
    },
    width: {
      type: String,
      value: '2em'
    },
    checked: {
      type: Boolean,
      value: false
    },
    iconNormal: {
      type: String,
      value: '/assets/images/icon-unlike.png'
    },
    iconChecked: {
      type: String,
      value: '/assets/images/icon-liked.png'
    },
  },

  data: {},

  methods: {
    _onToggle (e) {
      const { checked } = this.data;
      this.triggerEvent('change', { checked })
    }
  }
})
