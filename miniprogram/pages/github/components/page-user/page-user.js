import { getSelfInfo } from '../../../../apis/github';
import wxCloud from '../../../../utils/wxCloud';

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  data: {
    user: null,
    homeInfo: null
  },

  lifetimes: {
    async attached () {
      this.getUserInfo();
    }
  },

  methods: {
    async getUserInfo () {
      getSelfInfo()
        .then((res) => {
          this.setData({
            user: res
          });
        });
      const info = await wxCloud('github', {
        action: 'homePage',
        data: {
          user: 'honye'
        }
      });
      this.setData({
        homeInfo: info
      });
    }
  }
});
