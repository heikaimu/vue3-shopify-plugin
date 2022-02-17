/*
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-10 14:49:34
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-10 15:03:07
 */
export default class Event {
  constructor() {
    this.clientList = new Map();
  }

  add(target, handler) {
    let effects = this.clientList.get(target);
    if (!effects) {
      effects = new Set();
    }
    effects.add(handler);
    this.clientList.set(target, effects);
  }

  trigger(target, ...params) {
    const effects = this.clientList.get(target);
    if (!effects) {
      return;
    }

    effects.forEach(effect => {
      effect(...params);
    });
  }

  // remove(target) {
  //   this.clientList.delete(target);
  // }
}
