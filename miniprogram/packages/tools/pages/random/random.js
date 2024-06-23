Component({
  data: {
    min: '',
    max: '',
    num: ''
  },
  methods: {
    generate() {
      let { min, max } = this.data;
      min = Number(min);
      max = Number(max);
      this.setData({
        num: Math.floor(Math.random() * max)
      });
    }
  }
});
