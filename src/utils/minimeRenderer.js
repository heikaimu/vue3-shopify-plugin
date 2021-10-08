/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-02 15:51:31
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-26 10:32:05
 */
import RequestDecorator from './requestDecorator';
import Minime from './canvasRenderer';

const COUNT = 10;
const minimeList = [];
for (let i = 0; i < COUNT; i++) {
  const renderer = new Minime("", {
    width: 500,
    height: 650,
    scale: 500 / 3100
  });

  minimeList.push({
    renderer,
    free: true
  })
}

// 空闲的
function getFreeMinime() {
  const freeItem = minimeList.find(item => item.free);
  if (freeItem) {
    freeItem.free = false;
    return freeItem;
  }
  return;
}

export const renderer = new RequestDecorator({
  maxLimit: COUNT,
  requestApi: renderImage
});

// 渲染
function renderImage(layers) {
  return new Promise((resolve) => {
    const minime = getFreeMinime();
    if (minime) {
      minime.renderer.render({
        layers,
        success: () => {
          const url = minime.renderer.toDataURL({
            format: 'png',
            quality: 1
          });
          minime.free = true;
          resolve(url);
        }
      });
    } else {
      resolve('');
    }
  })
}

// 清空所有渲染器队列
export function clearRenderer() {
  renderer.clear();
}
