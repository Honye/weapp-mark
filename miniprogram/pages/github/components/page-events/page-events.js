import { getEvents } from '../../../../apis/github';

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  data: {
    _page: 1,
    _perPage: 20,
    events: []
  },

  lifetimes: {
    attached () {
      this.getEventList();
    }
  },

  methods: {
    async getEventList () {
      const { _page, _perPage } = this.data;
      const res = await getEvents({
        username: 'Honye',
        per_page: _perPage,
        page: _page
      });
      this.setData({
        events: res
      });
    }
  }
});
