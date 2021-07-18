/*
 * @Description: 请求并发限制器
 * @Version: 2.0
 * @Autor: Yaowen Liu
 * @Date: 2020-07-02 14:32:25
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-05-19 14:57:06
 */
export default class RequestDecorator {
  constructor({
    maxLimit = 5,
    requestApi
  }) {
    // 最大并发数
    this.maxLimit = maxLimit;
    // 请求队列，存储超出最大并发数的请求
    this.requestQueue = [];
    // 当前并发数量
    this.currentConcurrent = 0;
    // 请求api
    this.requestApi = requestApi;
  }

  // 发起api请求
  async request(...args) {
    // 若当前并发请求数超过最大数限制，则将请求拦截在此
    // startBlocking返回一个Promise，并将该promise的resolve加入到请求队列中
    // 当执行请求完成后，当前并发数量-1，并调用next执行队列中的请求
    // 调用next函数时，会获取队列中首个resolve并执行
    if (this.currentConcurrent >= this.maxLimit) {
      await this.startBlocking();
    }
    try {
      this.currentConcurrent++;
      const result = await this.requestApi(...args);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    } finally {
      // console.log('当前并发数量' + this.currentConcurrent);
      this.currentConcurrent--;
      this.next();
    }
  }
  // 创建一个promise，将它的resolve加入到队列中
  // 调用next函数时，执行队列中首个resolve
  startBlocking() {
    let _resolve;
    const promise = new Promise((resolve, reject) => {
      _resolve = resolve;
    });
    this.requestQueue.push(_resolve);
    return promise;
  }
  // 从队列中取出首个resolve并执行
  next() {
    if (this.requestQueue.length <= 0) return;
    const _resolve = this.requestQueue.shift();
    _resolve();
  }
}
