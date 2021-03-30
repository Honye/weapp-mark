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
