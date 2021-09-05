export default {
  version: '1.1.3',
  hasPublished: false,

  update (data = {}) {
    for (const key in data) {
      this[key] = data[key];
    }
  }
}
