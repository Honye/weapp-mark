import { EventEmitter } from '../miniprogram/utils/EventEmitter';

describe('event listener', () => {
  const eventEmitter = new EventEmitter();
  const listener = () => {
    expect(true).toBe(true);
  };
  test('listen', () => {
    eventEmitter.on('name', listener);
    eventEmitter.emit('name');
  });
  test('off listener', () => {
    eventEmitter.off('name', listener);
    expect(eventEmitter.#listeners.get('name')).toEqual(expect.not.arrayContaining([listener]));
  });
});

test('event listener bind this', () => {
  const eventEmitter = new EventEmitter();
  const obj = {
    a: 'a',
    fn() {
      expect(this.a).toBe('a');
    },
  };
  eventEmitter.on('name', obj.fn.bind(obj));
  eventEmitter.emit('name');
  eventEmitter.off('name', obj.fn);
});
