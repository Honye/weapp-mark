Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    loading: Boolean
  },

  attached() {
    this.observe()
  },

  detached() {
    this.observer && this.observer.disconnect()
  },

  methods: {
    observe() {
      this.observer = this.createIntersectionObserver({
        thresholds: [0],
        initialRatio: 1
      })
      this.observer
        .relativeToViewport({
          bottom: 60
        })
        .observe('.load-more', (res) => {
          if (res.intersectionRatio > 0 && !this.loading) {
            this.triggerEvent('loadmore')
          }
        })
    }
  }
})