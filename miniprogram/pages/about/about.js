import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import md from 'markdown-ast';
import { store } from '../../store/index';
import { getRepoInfo, getRepoReadme } from '../../apis/github';

const music = {
  src: 'http://music.163.com/song/media/outer/url?id=1404596131.mp3',
  title: 'See you again',
  cover: 'http://p2.music.126.net/JIc9X91OSH-7fUZqVfQXAQ==/7731765766799133.jpg',
  singer: 'Wiz Khalifa / Charlie Puth',
  epname: 'Furious 7 (Original Motion Picture Soundtrack)',
  url: 'https://music.163.com/#/song?id=30953009'
};
const audioManager = wx.getBackgroundAudioManager();

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    music,
    datas: {
      image: 'https://img9.doubanio.com/view/photo/r/public/p2635531435.webp'
    },
    playing: false,
    repo: null,
    readmeHTML: '',
    nodes: []
  },

  storeBindings: {
    store,
    fields: {
      app: () => store.app
    }
  },

  onLoad (options) {
    this.initAudio();
    this.initAudioListener();
    this.getRepoInfo();
    getRepoReadme({
      media: 'html',
      owner: 'Honye',
      repo: 'weapp-mark'
    })
      .then((res) => {
        this.setData({
          readmeHTML: res
        });
      });

    const nodes = md(store.app.intro);
    this.setData({ nodes });
  },

  onShow (options) {
    this.setData({
      playing: !audioManager.paused
    });
  },

  /** 播放背景音乐 */
  initAudio () {
    if (!audioManager.src && !audioManager.paused) {
      // case 背景音乐未初始化且不是用户主动关闭时初始化音乐
      audioManager.src = music.src;
      audioManager.title = music.title;
      audioManager.coverImgUrl = music.cover;
      audioManager.epname = music.epname;
      audioManager.webUrl = music.url;
    }
  },

  /** 播放/暂停 */
  audioToggle () {
    if (!audioManager.src) {
      audioManager.src = music.src; // 自动播放
    } else if (audioManager.paused) {
      audioManager.play();
    } else {
      audioManager.pause();
    }
  },

  /** 初始化音乐播放/暂停/停止监听 */
  initAudioListener () {
    audioManager.onPlay(() => {
      this.setData({
        playing: true
      });
    });
    audioManager.onPause(() => {
      this.setData({
        playing: false
      });
    });
    audioManager.onStop(() => {
      this.setData({
        playing: false
      });
    });
  },

  getRepoInfo () {
    getRepoInfo({
      owner: 'honye',
      repo: 'weapp-mark'
    })
      .then((res) => {
        this.setData({ repo: res });
      });
  },

  toWebview (e) {
    const { url } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/webview/index?url=${url}`,
    })
  }
})
