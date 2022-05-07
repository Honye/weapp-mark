export class EventEmitter {
  /** @type {Map<string, ((...args: any[]) => void)[]>} */
  listeners

  constructor() {
    this.listeners = new Map();
  }

  /**
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  on(eventName, listener) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).push(listener);
    } else {
      this.listeners.set(eventName, [listener]);
    }
  }

  /**
   * @param {string} eventName
   * @param {*} args
   */
  emit(eventName, ...args) {
    if (this.listeners.has(eventName)) {
      for (const fn of this.listeners.get(eventName)) {
        fn.apply(this, args);
      }
    }
  }

  /**
   * @param {string} eventName
   * @param {(...args: any[]) => void} [listener]
   */
  off(eventName, listener) {
    if (!listener) {
      this.listeners.delete(eventName);
    } else {
      const listeners = this.listeners.get(eventName);
      listeners.splice(listeners.findIndex((item) => item === listener), 1);
    }
  }
}
