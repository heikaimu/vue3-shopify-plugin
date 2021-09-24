/*
 * @Description: 画布渲染器
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-23 13:24:29
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-24 11:28:35
 */

import { fabric } from 'fabric';
import 'fabric-customise-controls';

export default class CanvasRenderer {
  constructor(id, { width, height, scale }) {
    this.canvasSize = { width, height }
    this.fabricInstance = this._instanceFabric(id, { width, height });
    this.scale = scale || 1;
    this.layers = [];
    this._controlAction();
  }

  // 实列化fabric
  _instanceFabric(id, { width, height }) {
    const instance = new fabric.Canvas(id, {
      width: width,
      height: height,
      selection: false,
    });
    instance.preserveObjectStacking = true;
    return instance;
  }

  // 清楚画布
  _clear() {
    this.fabricInstance.clear();
  }

  // 控制器样式修改
  _controlAction() {
    fabric.Canvas.prototype.customiseControls({
      tl: {
        action: (e, target) => {
          if (typeof this.replacePhoto === 'function') {
            this.replacePhoto();
          }
        },
        cursor: 'pointer'
      },
      tr: {
        action: 'scale',
        cursor: 'pointer'
      },
      br: {
        action: 'rotate',
        cursor: 'pointer'
      },
      bl: {
        action: (e, target) => {
          const scaleX = target.scaleX;
          target.set({
            scaleX: -Math.abs(scaleX)
          });
          this.fabricInstance.renderAll();
        },
        cursor: 'pointer'
      }
    });
  }

  // 图层控制器特殊样式
  _controlStyleOne(layer, type) {
    // 显示
    layer.setControlsVisibility({ // 这个方法是重点
      tl: type !== 'annex',
      bl: type !== 'annex',
      mtr: false,
      ml: false,
      mr: false,
      mt: false,
      mb: false
    });

    // 重构控制器样式
    layer.customiseCornerIcons({
      settings: {
        borderColor: '#e02433',
        cornerSize: 25,
        cornerBackgroundColor: '#e02433',
        cornerShape: 'circle',
        cornerPadding: 10
      },
      tl: {
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWklEQVRYR+2WS6hOYRSGn3coA5EBM6EwcAklROdQh4nBGVBCkWLgmCi3EaVcSilChGMgA7ekTBg45TbBwP1WTJQiMxlIr5b21n+2/9/f3sdf/+Ss2d7fWu/37vW9+/2W6HCow/szTKBSB2zvAHYCYyoe2Rdgn6RjqfwkAduTgXdAgJ5IAQLjgU1Z3lxJj8tqqhDYC+wBuiUNVCCA7a3AUeC0pM2VCdjuAdYC6wpFSaDiJrYfAXMK748AVyXdz9//7YDtNcCFFmyTrWxCYCVwqQVer6TrsdZI4B6wENgmKZi2PWyHNk4BDyUtKBIw8FTSzNTOtlcDS4ClwE/gZgZ6uULte2CSpD8f39iBIDAgqbsViO1RQHRnQ5bzEfgVgNnzXWCVpM8lGHeArtoEbIegQlgRB4GLkp7Fg+2pmU+sz9YnSvrQjITt+gRsjwZeAuOAHkm3W4D3AteAN/EHSPreRJxDInAICDc8J2lj2Tnbzn3jsKTt7SJwA1gBTJP0OkFgeogZuCVpWbsIfAJ+SApbTobtOP8RkuLIBsVQNdBxAh0/glyExyX1JTSwCzgAtFWEE4DnwMjcQEqMJgztGzBF0te2aCAzmzCZ/gxwd9hvwYiiM1uy9cWSwhX/iSGJMEexvQiIWyyfjIpWHMbTJ+l8SYfqG1EjmO2xme3OAOLiirsgpp5XwElJQapl/FcHkgZQIaGMQMwDs4FZkt5WwKqdYjvwHwBPms0D4fFngBfAldro1QqWA/Ma58tBQ6ntLmA/ML8aXu2smAX7JZ3NK5NTce0tahYME+h4B34DdsNYMI+a3t0AAAAASUVORK5CYII='
        // icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACjUlEQVRYR8VXv4+NURA9p0ehUCkJIaGwFRI2kUiERGMLREiEhFqhQuUvIKEhYiOxhcIWJBIrsSpbkBAbdCoRhd3+yLzMfRnfu/f77vsR71bvffd+M2fuzDkzHzHlxSn7x1gAJG2zAEh+GzWQkQFI2gXgkzveTfLzKCDGAXAYwGt3Okty6X8D2APggzvdS/LjRAFIugngEIA3JO33wPIzVgNt+zcA3CqdKaZAkl2vXbOtooFS1JJOAniW9klmfbUBsKgMva0lkrNNZ5J2OAtWM3tVAbQWYS4Nki4BOAfAamCjO14DYDXwiOR9eybJbs8CKKawB36YwpH0HsC+jndWSM7U2q0GIOkpgFPB8DyAV/7/CIAzYW+B5FwNiCoAko4DeB4MzpFciA4kGTgDmdYJkotdIGoBLAPY78ZmSK7kDEuy9FiabL0jeWAoAK7tWwH8jsIiyYpsA4DOqw2pWieZitSK0op2M4AfsXf0b6Ch7Qa8x/3G86sk77ZFJekKgDt+ptcjnE2J0rbV7x0RgHW2r8F4AmBc/+LPL5B82AHgPIAHfmYnydUMgO3pFv6pAY92C4C1mGdJf5zz8yTPdgB47IwwG5vSWa8PS8nP2Dlri/AtgFRQAwwITiITlkkeHKoIS4dd/e6F/QEmNBhgRy8nVWwDUXUDZiCjgqYDaQYw2Y0iVa2G1QAcRFMNc8F1UjW+1NWMjgG4BuAiye8OwlTxujcj0wZb696Mbkf1k2Ty/Ivky1IaatvxE5Knm0acNTaQDMyDjXlgKgPJUQAvEuhxBpIi+sqRrHWsG6oIYwoatCs2qInoQM6ITzxTHctj7+hre1fEzf2RU+CUtK+jLAtqgYwFoNbJRKR4Es5yNv4C17IiMHYEETkAAAAASUVORK5CYII='
      },
      tr: {
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABLElEQVRYR+2WMU7EMBBF3z8Doqei4RJLQ0EPNR0V/XbsHoICKmpqeujokbgESFzhI6+8KERObIeEFVLcejz/+c+ME7HjpR3rMwP8Xwds3wKHNT0k6bgdP8gB2w/AWY048DwmwAkQHDiogBgPoEIU247xM8C0DtheAVfAa7PZ/qQEUfw61vpT0t62TwYDxDl/kXTf13Qt8RC6lhTc2KxBAI05/3GbNkhO/DcAT8AiJJCUfKxKxCcDKBWfBCAhvpK07uoT2+/APnAn6bLoW2A7WYJa8ejABXAq6TwF2VXfLoDtbUKu3puXPte1AAHsCLjps71UfNPkqeCuEtQkLo2dAbIOFFr5BiwlPRbGf4eNBRASJuc8B9QHkDvb3P/omvNckkE/pbmkNfszwOzAF0fStCFcRTQ2AAAAAElFTkSuQmCC'
      },
      bl: {
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAgCAYAAACPb1E+AAAC8ElEQVRYR82YT4hNYRjGf092bGzIhlIWapRkoYT8yUoUNigZRUZZGaEUMynKNLNRakRG+RNFip0yo1HKYhYSjYWQzSzEQknUq/d2zu27555z7jlnzpVvc+vc7z3P77zn/Z7zfp+oMMzsPrBA0qYw3MwMGJN0ML5uZruAB8CApMEKcqhskJntA257nKSW+AhyIoQ3swHgHPALWClpuqxmFcgnwLYKkB5yXtLZrkKa2TpgMhYpmUkP+wCskPSzDGipTJrZFeDoLCA9tE/SaFcgzWwJ8A6YmwPp9ee12vj1EdRkfOmFpPXdgjwNXASeAlvTajJNOAXSp22X5LVdaBR+3Wb2BugB9gJ3MxZOkUx66D1JewoR+pspMjGwnY+Ae+B4xdUdyrkdvS6iXxQyth23D1/ddUCOSOqvBTJhO4uBZTVBzgBLi9hRx0wGtnNL0n4z21gTpCexX9JIp2zmQka28ym6yWZJ4zVDTklaPVvI2HZeSVoT+V6dmfRb7pb0MA+0UyY/A16HRyRdLQBZ1IJCpseSdlSCDGznO7BQ0u9OkCXMPDk1144yM2lmz4ENwLCkE/FdO9Skl4J/FieC+XGrlpesUUl9WRNSIRO20yPpbUFIb3qz+sk8yB/R20rtjrIgx4ADQFu91Ly6Q/BTki6lPUkbZMJ2dkp6FAZ2EXJa0vKikHENpQZ1ETLTjtIy+Q2YD5yUNJR8si5DPpO0JamZ3Eh5HXo9+gLw3eDXfwzpcm12lIScAlYB1yUdyvC9vC9OFTNPylyTdDi82IQ0M/dE90YfayW9LAs5CzNvWZvAvLA7CiF9A+8b+UlJDpw6OtRkHZl03RY7akAmbKdX0s2KkFXNPCn3RZL3DI0RQw4Dx4EZSYuyAKMHqrsLypJrdkcx5B9gDnBB0pn/BLL5eZWZHQMuR2AtB1A5sHXscfJyEf/XsCOHdMFG91J2VDhmKSsx6AcNDnkD6C0b7XtvSX7C1hxmdgd4nzjBiI/+KkjQgPwLZlwVP+daef0AAAAASUVORK5CYII='
      },
      br: {
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5ElEQVRYR8WWSahOYRjHf/9YoFCsWMhcMi1koRApN+MOkWJhWphKsSHExrBBFvdSigyxNIQNoSwMyQJZGCLDgmRDUX89er/Pueeeb7rfp/vUW9/5zjnP/3fe95lED5t6WJ9uAdgeCkxM6zvwFngHvJcU13Vb3QC2pwDrgDnAqCoK54Bzkq7WQ1ETICMc4mE/gFdpvQB6AYOAwUBAxu6E3QOOS7pQDaQqgO0lwMXk4ANwAmiX9LHIqe0hwHpgbQZkg6T2ShAVAXLie6sJ550nkIPAynRvu6RDRRCFADnxlZLO1nOeBSDHgI3p/82S4rqTVQKIbY/tny3pdnfES+/Y3gPsBuIIZ0iK+ClbtSOYJul+M+Lxru3ewB1gWsSQpFIw/3VdMwuaBUgQC4AryVebpJslv50AbC8Hfku61ArhrA/bEUcrgF2S9ncBsN0feAj8kjThPwCsBk4BlyUtLgI4DGxLN/ZKiuBpmdkeDkTh+gZMlvS5HAO2ZwG3cmp9Jf1sliBlQcnNVGA+EHXlXxDavgbMy4mdlrSqBQDxceG/b4GvLbK9CThaQWi8pGctgDgAbM/5eSNpRABEkShlQ/wO2gflLWpBLKQAj+Y0KQOxSNKVchqmHv8EGACMk/S62S/PpWGkeLTqsGuSojZ0LkS2bwBzo5tJOtlKgPBlOwACpHy0+UK0D9gJnJcURaOlZnsssEZSOR7yAG3A9aS6sN6pphFK232y6d2lF9juSANFNKKZkn43IlD0rO1Jkp4W3SsCGAncTRNN0xUxM1tckrQ0D1FpHsjWhiOStnZnF3KDzdKiJldtHoi+EP0h7Aywo9IsWGHbo++XZsFC8S5pmHdkO4bLiImwmkNpSrUQjhUTclhF8ZoAyeGyNNdNz4BEwYqu9hX4AoxOa0wa0ePRAO+Q9Kja8dU9EdmOyhW1oVp9eAnEDFlTuARVN0DpBdsDgWGZ1Q94DDyX9KnRYG0YoFGBWs/3OMAfr8wMGJFpMYMAAAAASUVORK5CYII='
      }
    }, () => {
      this.fabricInstance.renderAll();
    });
  }

  // 渲染
  async render({ layers, success, replacePhoto}) {
    // 图层
    this.layers = layers || [];
    // 点击切换图片按钮回调
    typeof replacePhoto === 'function' ? this.replacePhoto = replacePhoto : null;
    //清空画布
    this._clear();
    // 加载资源
    await this._loadResource();
    // 加载完成后调用成功回调
    typeof success === 'function' && success(this.fabricInstance.getObjects());
  }

  // 加载资源
  async _loadResource() {
    await this._addLayers(this.layers);
    return Promise.resolve();
  }

  // 添加图层集合
  async _addLayers(list) {
    list = list.sort((a, b) => {
      return a.sort - b.sort;
    })
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      await this._addLayerItem(item);
    }
  }

  // 添加图层
  _addLayerItem(item) {
    return new Promise((resolve) => {
      const { url, type } = item;
      if (type === 'svg') {
        fabric.loadSVGFromURL(url, (objects, options) => {
          const mask = fabric.util.groupSVGElements(objects, options);
          mask.scale(this.scale).set({
            left: mask.left * this.scale,
            top: mask.top * this.scale,
            fill: 'black',
            selectable: false,
            name: type
          });
          this.fabricInstance.add(mask);
          resolve();
        });
      } else {
        fabric.Image.fromURL(url, img => {
          this._setLayer(img, item);
          if (type === 'overlay') {
            this.fabricInstance.setOverlayImage(img, this.fabricInstance.renderAll.bind(this.fabricInstance));
          } else if (type === 'background') {
            this.fabricInstance.setBackgroundImage(img, this.fabricInstance.renderAll.bind(this.fabricInstance));
          } else {
            this.fabricInstance.add(img);
          }
          resolve();
        }, {
          crossOrigin: 'Anonymous'
        })
      }
    })
  }

  // 设置图层的缩放以及位置
  _setLayer(img, data) {
    const { type, top, left, width, angle, offset, originX = 'left', originY = 'top', selectable = true, customControls = false, globalCompositeOperation } = data;
    const targetWidth = width * this.scale;
    const scale = type === 'svg' ? this.scale : targetWidth / img.width;

    let offsetX = 0;
    let offsetY = 0;
    if (offset) {
      // const chinLeft = offset[0] * scale;
      const chinTop = offset[1] * scale;
      // const centerX = avatar.width * scale / 2;
      const bottomY = img.height * scale;
      // offsetX = centerX - chinLeft; 注释调X轴偏移
      offsetY = bottomY - chinTop;
    }

    img.scale(scale).set({
      top: top * this.scale + offsetY,
      left: left * this.scale + offsetX,
      angle,
      originX,
      originY,
      selectable,
      globalCompositeOperation,
      name: type
    })

    if (customControls) {
      this._controlStyleOne(img, type);
    }
  }

  // 获取当前配置
  getOptions() {

  }

  // 设置激活
  setActiveObject(obj) {
    this.fabricInstance.setActiveObject(obj);
    this.fabricInstance.renderAll();
  }

  // 获取渲染预览图
  toDataURL() {
    return this.fabricInstance.toDataURL({
      format: 'png',
      quality: 1
    });
  }
}
