import { getRepoReadme, getRepoInfo } from '../../../../apis/github';
import towxml from '../../../../components/towxml/index';

Page({
  options: {
    pureDataPattern: /^_/
  },

  data: {
    _owner: '',
    _repo: '',
    _branch: '',
    nodes: null
  },

  /**
   * @param {object} options
   * @param {string} options.owner
   * @param {string} options.repo
   * @param {string} options.branch
   */
  onLoad (options) {
    console.log(options);
    this.data._owner = options.owner;
    this.data._repo = options.repo;
    if (options.branch) this.data._branch = options.branch;
    wx.setNavigationBarTitle({
      title: options.repo
    });
    this.getReadme();
  },

  async getReadme () {
    const { _owner, _repo, _branch } = this.data;
    // Trending 爬取不到默认分支名
    const promises = [
      getRepoReadme({
        owner: _owner,
        repo: _repo,
        ref: _branch || undefined,
        media: 'raw'
      })
    ];
    if (!_branch) {
      promises.push(
        getRepoInfo({
          owner: _owner,
          repo: _repo
        })
      );
    } else {
      promises.push(
        Promise.resolve({ default_branch: _branch })
      );
    }

    const [markdown, repoinfo] = await Promise.all(promises);
    const nodes = towxml(markdown, 'markdown', {
      base: `https://raw.githubusercontent.com/${_owner}/${_repo}/${repoinfo.default_branch}/`,
      events: {
				tap: (e) => {
          const { data } = e.currentTarget.dataset;
          const { tag, attr } = data;
          switch (tag) {
            case 'img':
              wx.previewImage({
                urls: [attr.src],
                current: attr.src
              });
              break;
            case 'navigator': {
              const href = attr.href;
              if (href.startsWith('https://')) {
                wx.setClipboardData({
                  data: href,
                  success: () => {
                    wx.showToast({
                      icon: 'none',
                      title: '链接已复制'
                    });
                  }
                });
              }
              break;
            }
            default:
          }
        }
			}
    });
    this.setData({
      nodes
    });
  }
});
