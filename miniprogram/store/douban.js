export default {
  accessToken: '',
  refreshToken: '',
  /**
   * @type {{
   * name: string;
   * weixin_binded: boolean;
   * phone: string;
   * avatar: { medium: string; median: string; large: string; raw: string; small: string; icon: string; };
   * id: string;
   * uid: string;
   * }|null}
   */
  user: null,
  
  update (data = {}) {
    this.user = data;
  }
}
