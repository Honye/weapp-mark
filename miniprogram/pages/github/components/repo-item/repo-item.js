import colors from '../../../../utils/github-colors';

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    repo: {
      type: Object,
      value: {}
    }
  },
  data: {
    colors
  }
});
