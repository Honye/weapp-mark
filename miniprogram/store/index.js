import { observable } from 'mobx-miniprogram';
import app from './app';
import user from './user';

const scopeModule = (modules) => {
  Object.keys(modules).forEach((key, index) => {
    const value = modules[key];
    if (Object.prototype.toString.call(value) === '[object Object]') {
      Object.keys(value).forEach((mKey) => {
        const mValue = value[mKey];
        if (typeof mValue === 'function') {
          modules[`${key}/${mKey}`] = mValue.bind(value);
        }
      });
    }
  });
  return modules;
};

export const store = observable(scopeModule({
  app,
  user
}));
