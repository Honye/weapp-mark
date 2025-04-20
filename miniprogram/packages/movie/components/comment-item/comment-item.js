Component({
  properties: {
    avatar: { type: String, value: '' },
    nickname: { type: String, value: '' },
    rating: { type: Number, value: 0 },
    time: { type: String, value: '' },
    content: { type: String, value: '' },
  },
  data: {
    expanded: false
  },
  methods: {
    expand() {
      this.setData({ expanded: true })
    },
  },
})
