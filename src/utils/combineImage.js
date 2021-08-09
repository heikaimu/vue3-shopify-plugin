/*
 * @Description: 图片组合
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-29 14:33:04
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-04 15:39:54
 */
import { fabric } from 'fabric';
import { loadImage } from './image';

export class CombineImage {
  constructor() {
    this.canvas = new fabric.Canvas('composing');
  }

  getURL({ backgroundImage, layerList, layerImage }) {
    return new Promise(async (reolve) => {
      await this.setCanvasSize(backgroundImage);
      const queue = [];
      if (backgroundImage) {
        queue.push(this.setBackground(backgroundImage));
      }
      if (layerList && layerList.length > 0) {
        queue.push(this.addLayerList(layerList, layerImage));
      }
      Promise.all(queue).then(() => {
        setTimeout(() => {
          const url = this.canvas.toDataURL({
            format: 'png',
            quality: 1
          });
          reolve(url);
        }, 300);
      });
    });
  }

  async setCanvasSize(backgroundImage) {
    const image = await loadImage(backgroundImage);
    this.canvas.setWidth(image.width);
    this.canvas.setHeight(image.height);
    this.canvas.clear();
  }

  addLayerList(list, url) {
    return new Promise((reolve, reject) => {
      const queue = [];
      for (const item of list) {
        queue.push(this.addLayer(item, url));
      }

      Promise.all(queue).then(() => {
        reolve();
      });
    });
  }

  addLayer(item, url) {
    const { scale, angle, left, top } = item;
    return new Promise((resolve) => {
      fabric.Image.fromURL(url, (img) => {
        img.scale(scale).set({
          left,
          top,
          angle
        });
        this.canvas.add(img);
        resolve();
      }, {
        crossOrigin: 'Anonymous'
      });
    });
  }

  setBackground(url) {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(url, (img) => {
        this.canvas.setBackgroundImage(
          img,
          this.canvas.renderAll.bind(this.canvas)
        );
        resolve();
      }, {
        crossOrigin: 'Anonymous'
      });
    });
  }

  stop() {

  }
}
