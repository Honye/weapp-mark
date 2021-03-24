import wxCloud from '../../../../utils/wxCloud';

Page({
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
      { title: 'Python', value: 'python' }
    ],
    languageIndex: -1,
    language: '',
    dateRanges: [
      { title: 'Today', value: 'daily' },
      { title: 'This week', value: 'weekly' },
      { title: 'This month', value: 'monthly' }
    ],
    dateRangeIndex: 0,
    list: []
  },

  onLoad () {
    this.getTrendingList();
  },

  async getTrendingList () {
    const {
      languages, languageIndex, language,
      dateRanges, dateRangeIndex,
      spokenLanguages, spokenLanguageIndex
    } = this.data;
    const res = await wxCloud('trending', {
      language: language || languages[languageIndex]?.value,
      since: dateRanges[dateRangeIndex]?.value,
      spoken_language_code: spokenLanguages[spokenLanguageIndex]?.value
    });
    this.setData({
      list: res
    });
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
        }
      }
    });
  }
});
