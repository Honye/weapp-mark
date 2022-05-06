export default {
  version: '1.1.7',
  hasPublished: false,

  update (data = {}) {
    for (const key in data) {
      this[key] = data[key];
    }
  }
}
