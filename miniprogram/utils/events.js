import { EventEmitter } from './EventEmitter';

export const emitter = new EventEmitter();

export const events = {
  /** Tab 影视列表 - 刷新 */
  TAB_MOVIES_UPDATE: 'tab_movies_update',
  /** 登录成功 */
  LOGIN_SUCCESS: 'login_success',
};
