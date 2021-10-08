/*
 * @Description: 图片组合
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-29 14:33:04
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-27 11:24:04
 */
import { fabric } from 'fabric';
import { loadImage } from './image';

export class CombineImage {
  constructor() {
    this.canvas = new fabric.Canvas('composing');
  }

  getURL({ size, backgroundImage, layerList, layerImage }, id) {
    return new Promise(async (reolve) => {
      await this.setCanvasSize(size);
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
          reolve({
            url,
            id
          });
        }, 300);
      });
    });
  }

  async setCanvasSize(size) {
    this.canvas.setWidth(size.width);
    this.canvas.setHeight(size.height);
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
    const { angle, left, top, width } = item;
    return new Promise((resolve) => {
      fabric.Image.fromURL(url, (img) => {
        img.scale(width / img.width).set({
          left,
          top,
          angle,
          originX: 'center',
          originY: 'center',
          centeredScaling: true
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
