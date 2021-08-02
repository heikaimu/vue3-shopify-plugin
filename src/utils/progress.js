/*
 * @Description: 虚假进度条
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-26 09:36:56
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-26 09:40:59
 */
import { addTicker, removeTicker } from "./ticker";

/**
 * @param {Number} parts - 总任务数
 * @param {Number} speed - 速度
 * @param {Function} onProgress - 执行过程回调函数
 * @param {Function} onComplete - 执行完成回调函数
 */
export default class Progress {
  constructor({ parts, speed = 1000, onProgress, onComplete }) {
    this._parts = parts;
    this._total = 100;
    this._onePartPercent = this._total / this._parts;
    this._completeParts = 0;
    this._percent = 0;
    this._speed = speed;
    this._onProgress = onProgress ? onProgress : null;
    this._onComplete = onComplete ? onComplete : null;
  }

  start() {
    addTicker(this.handleTicker, this);
  }

  handleTicker(val) {
    this.handleAutoAddPercent(val);
  }

  _n = 0;
  handleAutoAddPercent(val) {
    this._n += val;
    if (this._n >= this.getRandomSpeed()) {
      this._n = 0;
      this.addPercent();
      if (this._onProgress) {
        this._onProgress(this._percent);
      }
    }
  }

  addPercent() {
    const min = Math.max(0, Math.floor(this._onePartPercent * this._completeParts));
    const max = Math.min(Math.floor(this._onePartPercent * (this._completeParts + 1)), 100);
    const total = this._total;

    if (this._percent >= total) {
      this._percent = total;
      this.end();
      return;
    }

    if (this._percent < min) {
      this._percent = min;
      return;
    }

    if (this._percent >= max - 1) {
      this._percent = max - 1;
      return;
    }

    this._percent += 1;
  }

  getRandomSpeed() {
    const min = this._speed - 500;
    const max = this._speed + 500;
    return Math.random() * (max - min) + min;
  }

  next() {
    this._completeParts += 1;
  }

  end() {
    removeTicker(this.handleTicker, this);
    if (this._onComplete) {
      this._onComplete();
    }
  }

  get percent() {
    return this._percent;
  }
}