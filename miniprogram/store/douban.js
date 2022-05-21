export default {
  accessToken: '',
  refreshToken: '',
  /** @type {Douban.AccountInfo | null} */
  user: null,
  
  update (data = {}) {
    for (const key in data) {
      this[key] = data[key];
    }
  },

  /**
   * // FIXME async 函数时更新存在问题，视图先更新，状态后变化
   */
  logout() {
    this.accessToken = '';
    this.refreshToken = '';
    this.user = null;
  },
}
