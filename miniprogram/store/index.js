import { observable, action } from 'mobx-miniprogram';
import app from './app';
import user from './user';
import douban from './douban';

/**
 * @template {Record<string, any>} T
 * @param {T} modules { moduleA: any, moduleB: any }
 * @returns {T}
 */
const scopeModule = (modules) => {
  Object.keys(modules).forEach((key, index) => {
    const value = modules[key];
    if (Object.prototype.toString.call(value) === '[object Object]') {
      Object.keys(value).forEach((mKey) => {
        const mValue = value[mKey];
        if (typeof mValue === 'function') {
          modules[`${key}/${mKey}`] = action(function (...args) {
            mValue.call(value, ...args);
            this[key] = Object.assign({}, value);
          });
          delete value[mKey];
        }
      });
    }
  });
  return modules;
};

export const store = observable(scopeModule({
  app,
  user,
  douban
}));

// export const store = observable({
//   app: {
//     version: '1.0.14',
//     hasPublished: false
//   },
//   'app/update': action(function (data = {}) {
//     this.app = Object.assign({}, this.app, data);
//   }),

//   user: {
//     info: null
//   },
//   'user/updateUserInfo': action(function (userInfo) {
//     this.user = Object.assign({}, this.user, { info: userInfo });
//   }),

//   douban: {
//     accessToken: '',
//     refreshToken: '',
//     /**
//      * @type {{
//      * name: string;
//      * weixin_binded: boolean;
//      * phone: string;
//      * avatar: { medium: string; median: string; large: string; raw: string; small: string; icon: string; };
//      * id: string;
//      * uid: string;
//      * }|null}
//      */
//     user: null
//   },
//   'douban/update': action(function (data = {}) {
//     this.douban = Object.assign({}, this.douban, data);
//   })
// });
