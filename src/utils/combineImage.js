/*
 * @Description: 图片组合
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-29 14:33:04
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-29 17:34:52
 */
import { fabric } from 'fabric';

export class CombineImage {
  constructor({ width, height }) {
    this.canvas = new fabric.Canvas('composing', {
      width,
      height
    });
  }

  getURL({ backgroundImage, layerList, layerImage }) {
    return new Promise((reolve) => {
      this.canvas.clear();
      
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
}
