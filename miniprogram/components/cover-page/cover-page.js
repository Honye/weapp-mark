Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    distance: {
      type: Number,
      value: 60
    }
  },

  methods: {
    /**
     * @param {object} params
     * @param {boolean} params.visible
     */
    setVisible ({ visible }) {
      this.setData({ visible });
    },
  
    show () {
      this.setVisible({ visible: true });
    },
  
    hide () {
      this.setVisible({ visible: false });
    },

    prevent () {
      // avoid warning
    }
  }

});
