export default {
  version: '1.0.15',
  hasPublished: false,

  update (data = {}) {
    for (const key in data) {
      this[key] = data[key];
    }
  }
}
