import wxCloud from '../../../../utils/wxCloud';

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  data: {
    spokenLanguages: [
      { title: 'Any', value: '' },
      { title: 'Chinese', value: 'zh' },
      { title: 'English', value: 'en' }
    ],
    spokenLanguageIndex: -1,
    languages: [
      { title: 'Any', value: '' },
      { title: 'JavaScript', value: 'javascript' },
      { title: 'Python', value: 'python' },
      { title: 'Dart', value: 'dart' }
    ],
    languageIndex: -1,
    language: '',
    dateRanges: [
      { title: 'Today', value: 'daily' },
      { title: 'This week', value: 'weekly' },
      { title: 'This month', value: 'monthly' }
    ],
    dateRangeIndex: 0,
    list: [],
    loading: false,
    sticky: true
  },

  lifetimes: {
    attached () {
      this.getTrendingList();
    }
  },

  methods: {
    onPageScroll (e) {
      const { scrollTop } = e.detail;
      if (scrollTop < this.scrollTop && !this.data.sticky) {
        this.setData({
          sticky: true
        });
      } else if (scrollTop > this.scrollTop && scrollTop > 0 && this.data.sticky) {
        this.setData({
          sticky: false
        });
      }
      this.scrollTop = scrollTop;
    },

    async getTrendingList () {
      const {
        languages, languageIndex, language,
        dateRanges, dateRangeIndex,
        spokenLanguages, spokenLanguageIndex
      } = this.data;
      wx.showNavigationBarLoading();
      this.setData({ loading: true });
      try {
        const res = await wxCloud('trending', {
          language: language || languages[languageIndex]?.value,
          since: dateRanges[dateRangeIndex]?.value,
          spoken_language_code: spokenLanguages[spokenLanguageIndex]?.value
        });
        wx.pageScrollTo({ scrollTop: 0 });
        this.setData({
          list: res,
          loading: false
        });
      } catch (e) {
        this.setData({
          loading: false
        });
      }
      wx.hideNavigationBarLoading();
    },

    handlePickerChange (e) {
      const { name } = e.currentTarget.dataset;
      const { value } = e.detail;
      switch (name) {
        case 'spokenLanguage':
          this.setData(
            { spokenLanguageIndex: value },
            () => this.getTrendingList()
          );
          break;
        case 'language':
          this.setData(
            { languageIndex: value },
            () => this.getTrendingList()
          );
          break;
        case 'dateRange':
          this.setData(
            { dateRangeIndex: value },
            () => this.getTrendingList()
          );
          break;
        default:
      }
    },

    toChooseLanguage (e) {
      wx.navigateTo({
        url: '../languages/languages',
        events: {
          choose: ({ value }) => {
            this.setData(
              { language: value.name },
              () => this.getTrendingList()
            );
          },
          onChange: ({ stared = [] }) => {
            const defaultOne = { title: 'Any', value: '' };
            const staredLanguages = stared.map((item) => ({
              title: item.name,
              value: item.name
            }));
            this.setData({
              languages: [defaultOne, ...staredLanguages]
            });
          }
        }
      });
    }
  }
});
