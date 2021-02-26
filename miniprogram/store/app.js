import { action } from 'mobx-miniprogram';

export default {
  version: '1.0.7',
  hasPublished: false,

  update: action(function (data = {}) {
    for (const key in data) {
      this[key] = data[key];
    }
  })
}
