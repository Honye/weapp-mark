import { Base64 } from '../../../../utils/Base64';

Component({
  data: {
    options: [
      { label: 'URL 编码', value: 'urlencode' },
      { label: 'Base64', value: 'base64' }
    ],
    type: 0,
    input: '',
    output: ''
  },
  methods: {
    encode() {
      let { options, type, input } = this.data;
      type = options[type].value
      if (type === 'urlencode') {
        this.setData({
          output: encodeURIComponent(input)
        });
      } else if (type === 'base64') {
        this.setData({
          output: Base64.encode(input)
        });
      }
    },
    decode() {
      let { options, type, input } = this.data;
      type = options[type].value
      if (type === 'urlencode') {
        this.setData({
          output: decodeURIComponent(input)
        });
      } else if (type === 'base64') {
        this.setData({
          output: Base64.decode(input)
        });
      }
    }
  }
});
