import wxCloud from '../../utils/wxCloud';

export class RequestController {
  /** @type {WechatMiniprogram.RequestTask} */
  task;

  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        if (Object.prototype.hasOwnProperty.call(target, prop)) {
          return Reflect.get(target, prop);
        } else {
          return target.task[prop];
        }
      }
    });
  }
}

/**
 * @template T
 * @param {RequestOption<T>} config
 * @returns {Promise<RequestSuccessResult<T>}
 * @example
 *
 * ```
 * const controller = new RequestController();
 * request({
 *   ...config,
 *   controller
 * });
 * // 中断请求任务
 * controller.abort();
 * ```
 */
export const request = ({ baseURL, controller, ...config }) => {
  return new Promise((resolve, reject) => {
    const requestTask = wx.request(
      /** @type {WechatMiniprogram.RequestOption<T>} */
      ({
        ...config,
        url: `${baseURL}${config.url}`,
        success: (res) => {
          res.ok = res.statusCode >= 200 && res.statusCode < 300;
          resolve(res);
        },
        fail: (err) => reject(err),
      })
    );
    if (controller) {
      controller.task = requestTask;
    }
  });
};

/**
 * @template T
 * @param {*} options 
 * @returns {Promise<T>}
 */
export const cloudFetch = (options) => {
  return wxCloud('douban', {
    action: 'fetch',
    payload: options,
  });
};