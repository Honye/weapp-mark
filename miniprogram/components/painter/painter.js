import Pen from './lib/pen';
import Downloader from './lib/downloader';

const util = require('./lib/util');

const downloader = new Downloader();

// 最大尝试的绘制次数
const MAX_PAINT_COUNT = 5;
Component({
  canvasWidthInPx: 0,
  canvasHeightInPx: 0,
  paintCount: 0,
  /**
   * 组件的属性列表
   */
  properties: {
    customStyle: {
      type: String,
    },
    palette: {
      type: Object,
      observer: function (newVal, oldVal) {
        if (this.isNeedRefresh(newVal, oldVal)) {
          this.paintCount = 0;
          this.startPaint();
        }
      },
    },
    widthPixels: {
      type: Number,
      value: 0
    },
    // 启用脏检查，默认 false
    dirty: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    picURL: '',
    showCanvas: true,
    painterStyle: '',
  },

  methods: {
    /**
     * 判断一个 object 是否为 空
     * @param {object} object
     */
    isEmpty(object) {
      for (const i in object) {
        return false;
      }
      return true;
    },

    isNeedRefresh(newVal, oldVal) {
      if (!newVal || this.isEmpty(newVal) || (this.data.dirty && util.equal(newVal, oldVal))) {
        return false;
      }
      return true;
    },

    startPaint() {
      if (this.isEmpty(this.properties.palette)) {
        return;
      }

      if (!(getApp().systemInfo && getApp().systemInfo.screenWidth)) {
        try {
          getApp().systemInfo = wx.getSystemInfoSync();
        } catch (e) {
          const error = `Painter get system info failed, ${JSON.stringify(e)}`;
          this.triggerEvent('imgErr', {
            error: error
          });
          console.error(error);
          return;
        }
      }
      let screenK = getApp().systemInfo.screenWidth / 750;
      setStringPrototype(screenK, 1);
      
      this.downloadImages().then((palette) => {
        const {
          width,
          height
        } = palette;
        
        if (!width || !height) {
          console.error(`You should set width and height correctly for painter, width: ${width}, height: ${height}`);
          return;
        }
        this.canvasWidthInPx = width.toPx();
        if (this.properties.widthPixels) {
          // 如果重新设置过像素宽度，则重新设置比例
          setStringPrototype(screenK, this.properties.widthPixels / this.canvasWidthInPx)
          this.canvasWidthInPx = this.properties.widthPixels
        }
  
        this.canvasHeightInPx = height.toPx();
        this.setData({
          painterStyle: `width:${this.canvasWidthInPx}px;height:${this.canvasHeightInPx}px;`,
        });
        const ctx = wx.createCanvasContext('k-canvas', this);
        const pen = new Pen(ctx, palette);
        pen.paint(() => {
          this.saveImgToLocal();
        });
      });
    },

    downloadImages() {
      return new Promise((resolve, reject) => {
        let preCount = 0;
        let completeCount = 0;
        const paletteCopy = JSON.parse(JSON.stringify(this.properties.palette));
        if (paletteCopy.background) {
          preCount++;
          downloader.download(paletteCopy.background).then((path) => {
            paletteCopy.background = path;
            completeCount++;
            if (preCount === completeCount) {
              resolve(paletteCopy);
            }
          }, () => {
            completeCount++;
            if (preCount === completeCount) {
              resolve(paletteCopy);
            }
          });
        }
        if (paletteCopy.views) {
          for (const view of paletteCopy.views) {
            if (view && view.type === 'image' && view.url) {
              preCount++;
              /* eslint-disable no-loop-func */
              downloader.download(view.url).then((path) => {
                view.url = path;
                wx.getImageInfo({
                  src: view.url,
                  success: (res) => {
                    // 获得一下图片信息，供后续裁减使用
                    view.sWidth = res.width;
                    view.sHeight = res.height;
                  },
                  fail: (error) => {
                    // 如果图片坏了，则直接置空，防止坑爹的 canvas 画崩溃了
                    console.error(`getImageInfo ${view.url} failed, ${JSON.stringify(error)}`);
                    view.url = "";
                  },
                  complete: () => {
                    completeCount++;
                    if (preCount === completeCount) {
                      resolve(paletteCopy);
                    }
                  },
                });
              }, () => {
                completeCount++;
                if (preCount === completeCount) {
                  resolve(paletteCopy);
                }
              });
            }
          }
        }
        if (preCount === 0) {
          resolve(paletteCopy);
        }
      });
    },

    saveImgToLocal() {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'k-canvas',
          success: (res) => {
            this.getImageInfo(res.tempFilePath);
          },
          fail: (error) => {
            console.error(`canvasToTempFilePath failed, ${JSON.stringify(error)}`);
            this.triggerEvent('imgErr', {
              error: error
            });
          },
        }, this);
      }, 300);
    },

    getImageInfo(filePath) {
      wx.getImageInfo({
        src: filePath,
        success: (infoRes) => {
          if (this.paintCount > MAX_PAINT_COUNT) {
            const error = `The result is always fault, even we tried ${MAX_PAINT_COUNT} times`;
            console.error(error);
            this.triggerEvent('imgErr', {
              error: error
            });
            return;
          }
          // 比例相符时才证明绘制成功，否则进行强制重绘制
          if (Math.abs((infoRes.width * this.canvasHeightInPx - this.canvasWidthInPx * infoRes.height) / (infoRes.height * this.canvasHeightInPx)) < 0.01) {
            this.triggerEvent('imgOK', {
              path: filePath
            });
          } else {
            this.startPaint();
          }
          this.paintCount++;
        },
        fail: (error) => {
          console.error(`getImageInfo failed, ${JSON.stringify(error)}`);
          this.triggerEvent('imgErr', {
            error: error
          });
        },
      });
    },
  },
});


function setStringPrototype(screenK, scale) {
  /* eslint-disable no-extend-native */
  /**
   * 是否支持负数
   * @param {Boolean} minus 是否支持负数
   */
  String.prototype.toPx = function toPx(minus) {
    let reg;
    if (minus) {
      reg = /^-?[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g;
    } else {
      reg = /^[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g;
    }
    const results = reg.exec(this);
    if (!this || !results) {
      console.error(`The size: ${this} is illegal`);
      return 0;
    }
    const unit = results[2];
    const value = parseFloat(this);

    let res = 0;
    if (unit === 'rpx') {
      res = Math.round(value * screenK * (scale || 1));
    } else if (unit === 'px') {
      res = Math.round(value * (scale || 1));
    }
    return res;
  };
}