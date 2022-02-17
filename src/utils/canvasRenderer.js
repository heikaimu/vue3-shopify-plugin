/*
 * @Description: 画布渲染器
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-23 13:24:29
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-02-16 15:19:11
 */

import { fabric } from 'fabric';
import 'fabric-customise-controls';

const VBOX_URL = 'https://cdn.shopifycdn.net/s/files/1/0343/0275/4948/files/vFace.png?v=1634089968';
const ICON_TL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWklEQVRYR+2WS6hOYRSGn3coA5EBM6EwcAklROdQh4nBGVBCkWLgmCi3EaVcSilChGMgA7ekTBg45TbBwP1WTJQiMxlIr5b21n+2/9/f3sdf/+Ss2d7fWu/37vW9+/2W6HCow/szTKBSB2zvAHYCYyoe2Rdgn6RjqfwkAduTgXdAgJ5IAQLjgU1Z3lxJj8tqqhDYC+wBuiUNVCCA7a3AUeC0pM2VCdjuAdYC6wpFSaDiJrYfAXMK748AVyXdz9//7YDtNcCFFmyTrWxCYCVwqQVer6TrsdZI4B6wENgmKZi2PWyHNk4BDyUtKBIw8FTSzNTOtlcDS4ClwE/gZgZ6uULte2CSpD8f39iBIDAgqbsViO1RQHRnQ5bzEfgVgNnzXWCVpM8lGHeArtoEbIegQlgRB4GLkp7Fg+2pmU+sz9YnSvrQjITt+gRsjwZeAuOAHkm3W4D3AteAN/EHSPreRJxDInAICDc8J2lj2Tnbzn3jsKTt7SJwA1gBTJP0OkFgeogZuCVpWbsIfAJ+SApbTobtOP8RkuLIBsVQNdBxAh0/glyExyX1JTSwCzgAtFWEE4DnwMjcQEqMJgztGzBF0te2aCAzmzCZ/gxwd9hvwYiiM1uy9cWSwhX/iSGJMEexvQiIWyyfjIpWHMbTJ+l8SYfqG1EjmO2xme3OAOLiirsgpp5XwElJQapl/FcHkgZQIaGMQMwDs4FZkt5WwKqdYjvwHwBPms0D4fFngBfAldro1QqWA/Ma58tBQ6ntLmA/ML8aXu2smAX7JZ3NK5NTce0tahYME+h4B34DdsNYMI+a3t0AAAAASUVORK5CYII=';
const ICON_TR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABLElEQVRYR+2WMU7EMBBF3z8Doqei4RJLQ0EPNR0V/XbsHoICKmpqeujokbgESFzhI6+8KERObIeEFVLcejz/+c+ME7HjpR3rMwP8Xwds3wKHNT0k6bgdP8gB2w/AWY048DwmwAkQHDiogBgPoEIU247xM8C0DtheAVfAa7PZ/qQEUfw61vpT0t62TwYDxDl/kXTf13Qt8RC6lhTc2KxBAI05/3GbNkhO/DcAT8AiJJCUfKxKxCcDKBWfBCAhvpK07uoT2+/APnAn6bLoW2A7WYJa8ejABXAq6TwF2VXfLoDtbUKu3puXPte1AAHsCLjps71UfNPkqeCuEtQkLo2dAbIOFFr5BiwlPRbGf4eNBRASJuc8B9QHkDvb3P/omvNckkE/pbmkNfszwOzAF0fStCFcRTQ2AAAAAElFTkSuQmCC';
const ICON_BL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAgCAYAAACPb1E+AAAC8ElEQVRYR82YT4hNYRjGf092bGzIhlIWapRkoYT8yUoUNigZRUZZGaEUMynKNLNRakRG+RNFip0yo1HKYhYSjYWQzSzEQknUq/d2zu27555z7jlnzpVvc+vc7z3P77zn/Z7zfp+oMMzsPrBA0qYw3MwMGJN0ML5uZruAB8CApMEKcqhskJntA257nKSW+AhyIoQ3swHgHPALWClpuqxmFcgnwLYKkB5yXtLZrkKa2TpgMhYpmUkP+wCskPSzDGipTJrZFeDoLCA9tE/SaFcgzWwJ8A6YmwPp9ee12vj1EdRkfOmFpPXdgjwNXASeAlvTajJNOAXSp22X5LVdaBR+3Wb2BugB9gJ3MxZOkUx66D1JewoR+pspMjGwnY+Ae+B4xdUdyrkdvS6iXxQyth23D1/ddUCOSOqvBTJhO4uBZTVBzgBLi9hRx0wGtnNL0n4z21gTpCexX9JIp2zmQka28ym6yWZJ4zVDTklaPVvI2HZeSVoT+V6dmfRb7pb0MA+0UyY/A16HRyRdLQBZ1IJCpseSdlSCDGznO7BQ0u9OkCXMPDk1144yM2lmz4ENwLCkE/FdO9Skl4J/FieC+XGrlpesUUl9WRNSIRO20yPpbUFIb3qz+sk8yB/R20rtjrIgx4ADQFu91Ly6Q/BTki6lPUkbZMJ2dkp6FAZ2EXJa0vKikHENpQZ1ETLTjtIy+Q2YD5yUNJR8si5DPpO0JamZ3Eh5HXo9+gLw3eDXfwzpcm12lIScAlYB1yUdyvC9vC9OFTNPylyTdDi82IQ0M/dE90YfayW9LAs5CzNvWZvAvLA7CiF9A+8b+UlJDpw6OtRkHZl03RY7akAmbKdX0s2KkFXNPCn3RZL3DI0RQw4Dx4EZSYuyAKMHqrsLypJrdkcx5B9gDnBB0pn/BLL5eZWZHQMuR2AtB1A5sHXscfJyEf/XsCOHdMFG91J2VDhmKSsx6AcNDnkD6C0b7XtvSX7C1hxmdgd4nzjBiI/+KkjQgPwLZlwVP+daef0AAAAASUVORK5CYII=';
const ICON_BR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5ElEQVRYR8WWSahOYRjHf/9YoFCsWMhcMi1koRApN+MOkWJhWphKsSHExrBBFvdSigyxNIQNoSwMyQJZGCLDgmRDUX89er/Pueeeb7rfp/vUW9/5zjnP/3fe95lED5t6WJ9uAdgeCkxM6zvwFngHvJcU13Vb3QC2pwDrgDnAqCoK54Bzkq7WQ1ETICMc4mE/gFdpvQB6AYOAwUBAxu6E3QOOS7pQDaQqgO0lwMXk4ANwAmiX9LHIqe0hwHpgbQZkg6T2ShAVAXLie6sJ550nkIPAynRvu6RDRRCFADnxlZLO1nOeBSDHgI3p/82S4rqTVQKIbY/tny3pdnfES+/Y3gPsBuIIZ0iK+ClbtSOYJul+M+Lxru3ewB1gWsSQpFIw/3VdMwuaBUgQC4AryVebpJslv50AbC8Hfku61ArhrA/bEUcrgF2S9ncBsN0feAj8kjThPwCsBk4BlyUtLgI4DGxLN/ZKiuBpmdkeDkTh+gZMlvS5HAO2ZwG3cmp9Jf1sliBlQcnNVGA+EHXlXxDavgbMy4mdlrSqBQDxceG/b4GvLbK9CThaQWi8pGctgDgAbM/5eSNpRABEkShlQ/wO2gflLWpBLKQAj+Y0KQOxSNKVchqmHv8EGACMk/S62S/PpWGkeLTqsGuSojZ0LkS2bwBzo5tJOtlKgPBlOwACpHy0+UK0D9gJnJcURaOlZnsssEZSOR7yAG3A9aS6sN6pphFK232y6d2lF9juSANFNKKZkn43IlD0rO1Jkp4W3SsCGAncTRNN0xUxM1tckrQ0D1FpHsjWhiOStnZnF3KDzdKiJldtHoi+EP0h7Aywo9IsWGHbo++XZsFC8S5pmHdkO4bLiImwmkNpSrUQjhUTclhF8ZoAyeGyNNdNz4BEwYqu9hX4AoxOa0wa0ePRAO+Q9Kja8dU9EdmOyhW1oVp9eAnEDFlTuARVN0DpBdsDgWGZ1Q94DDyX9KnRYG0YoFGBWs/3OMAfr8wMGJFpMYMAAAAASUVORK5CYII=';
const ICON_DELETE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAVVJREFUWEftlzFOw0AQRd8vaZFyBChAogB6yAGgpAbRwh24A7QICipKOAChBwqk0HCESLSUH61kI+Ow9i6KlSjEpXd25833+u+smPKjKecnG8B2D1iPgA8ljXKK+gvAHbAXSXIvab9rgDNgJ5LkUVIYT36yFUheOTFwDMD2A7CbOD83bCCpX500ewAlXUWJvqRBbqmp8dE9MBcAtleBGyD4w9FvqnSqgO2wmcOmHtt8JUw2QOGEPUlv1YpsrwGjqhN2BVA64bak5wBhewt4An44YVcApU98/x2xRAuAhQILBeZWgdDxbALHpesV7ngJvFQ7ok4USD1mC4ec/FnwrwDOgRPgOnaWt6lh+wo4BC4kneb2A+X3C/M+gNe2hLXxDWC5eBdt6xrb8uKMv224CbUxDYGDeu/Q2BXXV7S9BKxUqmlLWo4H1d4lfTZNmL2LSWp5k4r7AiUUTTDPV9MhAAAAAElFTkSuQmCC';

export default class CanvasRenderer {
  constructor(id, { width, height, scale }) {
    this.canvasSize = { width, height };
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
      selection: false
    });
    instance.preserveObjectStacking = true;
    return instance;
  }

  // 清空画布
  _clear() {
    this.fabricInstance.clear();
  }

  // 控制器样式修改
  _controlAction() {
    fabric.Canvas.prototype.customiseControls({
      tl: {
        action: (e, target) => {
          const item = this.fabricInstance.getActiveObject();
          typeof this.replacePhoto === 'function' && this.replacePhoto(item);
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
    layer.setControlsVisibility({
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
        icon: type === 'annex' ? ICON_DELETE : ICON_TL
      },
      tr: {
        icon: ICON_TR
      },
      bl: {
        icon: ICON_BL
      },
      br: {
        icon: ICON_BR
      }
    }, () => {
      this.fabricInstance.renderAll();
    });
  }

  // 渲染
  async render({ layers, success, replacePhoto, singleClick }) {
    // 图层
    this.layers = layers || [];
    // 点击切换图片按钮回调
    typeof replacePhoto === 'function' ? this.replacePhoto = replacePhoto : null;
    // 单次点击
    typeof singleClick === 'function' ? this.singleClick = singleClick : null;
    // 清空画布
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
    });
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      await this._addLayerItem(item);
    }
  }

  // 添加图层
  _addLayerItem(item, active) {
    return new Promise((resolve) => {
      const { type } = item;
      switch (type) {
        case 'svg':
          this._addSVG(item, resolve);
          break;

        case 'text':
          this._addText(item, resolve);
          break;

        case 'vBox':
          this._addVBox(item, resolve);
          break;

        case 'background':
          this._addBackground(item, resolve);
          break;

        case 'overlay':
          this._addOverlay(item, resolve);
          break;

        default:
          this._addNormalImage(item, resolve, active);
          break;
      }
    });
  }

  // 添加SVG
  _addSVG(config, resolve) {
    const { url, type, name } = config;
    fabric.loadSVGFromURL(url, (objects, options) => {
      const mask = fabric.util.groupSVGElements(objects, options);
      mask.scale(this.scale).set({
        left: mask.left * this.scale,
        top: mask.top * this.scale,
        fill: 'black',
        selectable: false,
        name: name || type
      });
      this.fabricInstance.add(mask);
      resolve();
    });
  }

  // 添加文字
  _addText(config, resolve) {
    const { fontSize, width, left, top, angle = 0, text, color, fontFamily, selectable, stroke = '#ffffff', strokeWidth = 0 } = config;
    var t = new fabric.Text(text, {
      fontSize: fontSize * this.scale,
      fill: color,
      fontFamily,
      stroke,
      strokeWidth,
      left: left * this.scale,
      top: top * this.scale,
      angle,
      selectable,
      transparentCorners: false,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      type: 'text',
      originalWidth: width
    });
    this.fabricInstance.add(t);
    resolve();
  }

  // 添加虚拟BOX
  _addVBox(config, resolve) {
    const { left, top, width, angle = 0, originX = 'left', originY = 'top', selectable = true, name, type, globalCompositeOperation, id } = config;

    fabric.Image.fromURL(VBOX_URL, img => {
      const targetWidth = width * this.scale;
      const scale = targetWidth / img.width;
      img.scale(scale).set({
        left: left * this.scale,
        top: top * this.scale,
        angle,
        originX,
        originY,
        selectable,
        name: name || type,
        globalCompositeOperation,
        type: 'vBox',
        id
      });

      img.on('mousedown', () => {
        typeof this.singleClick === 'function' && this.singleClick({
          layer: img,
          config: config
        });
      });

      this.fabricInstance.add(img);
      resolve();
    });
  }

  // 背景
  _addBackground(config, resolve) {
    const { url, globalCompositeOperation } = config;
    fabric.Image.fromURL(url, img => {
      const targetWidth = this.canvasSize.width;
      const scale = targetWidth / img.width;
      img.scale(scale).set({
        left: 0,
        top: 0,
        globalCompositeOperation
      });
      this.fabricInstance.setBackgroundImage(img, this.fabricInstance.renderAll.bind(this.fabricInstance));
      resolve();
    }, {
      crossOrigin: 'Anonymous'
    });
  }

  // 背景
  _addOverlay(config, resolve) {
    const { url, globalCompositeOperation } = config;
    fabric.Image.fromURL(url, img => {
      const targetWidth = this.canvasSize.width;
      const scale = targetWidth / img.width;
      img.scale(scale).set({
        left: 0,
        top: 0,
        globalCompositeOperation
      });
      this.fabricInstance.setOverlayImage(img, this.fabricInstance.renderAll.bind(this.fabricInstance));
      resolve();
    }, {
      crossOrigin: 'Anonymous'
    });
  }

  /**
   * 设置图层的缩放以及位置
   * @param {*} config - 配置信息
   * @param {*} resolve - promise成功回调
   * @param {*} active - 是否设置激活状态
   */
  _addNormalImage(config, resolve, active) {
    const { url, id, type, name, top, left, width, angle = 0, offset, originX = 'left', originY = 'top', selectable = true, customControls = false, globalCompositeOperation } = config;
    fabric.Image.fromURL(url, img => {
      const targetWidth = width * this.scale;
      const scale = targetWidth / img.width;
      const offsetX = 0;
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
        offset: {
          top: offsetY,
          left: offsetX
        },
        angle,
        originX,
        originY,
        selectable,
        globalCompositeOperation,
        name: name || type,
        type,
        id
      });

      img.on('mousedown', () => {
        typeof this.singleClick === 'function' && this.singleClick({
          layer: img,
          config: config
        });
      });

      // 是否自定义控制器
      if (customControls) {
        this._controlStyleOne(img, type);
      }

      // 是否设置激活
      if (active) {
        this.fabricInstance.setActiveObject(img);
      }

      this.fabricInstance.add(img);

      resolve();
    }, {
      crossOrigin: 'Anonymous'
    });
  }

  /**
   * 获取所有图层的位置信息
   * @returns {Object}
   */
  getOptions() {
    const items = this.fabricInstance.getObjects();
    const current = [];
    const original = [];
    items.map(item => {
      const options = this.getItemOption(item);
      current.push(options.current);
      original.push(options.original);
    });
    return {
      current,
      original
    };
  }

  // 获取单个图层的位置信息
  getItemOption(item) {
    const { left, top, angle = 0, width, offset, type, name, scaleX } = item;

    // 当前的配置
    const offsetLeft = offset ? offset.left : 0;
    const offsetTop = offset ? offset.top : 0;
    const current = {
      left: left - offsetLeft,
      top: top - offsetTop,
      width: width * scaleX,
      angle,
      type,
      name
    };

    // 原始尺寸的配置
    const original = {
      left: (left - offsetLeft) / this.scale,
      top: (top - offsetTop) / this.scale,
      width: (width * scaleX) / this.scale,
      angle,
      type,
      name
    };

    return {
      current,
      original
    };
  }

  // 设置激活
  setActiveObject(obj) {
    if (!obj) {
      return;
    }

    this.fabricInstance.setActiveObject(obj);
    this.fabricInstance.renderAll();
  }

  discardActiveObject() {
    this.fabricInstance.discardActiveObject();
    this.fabricInstance.renderAll();
  }

  /**
   * 添加图层
   * @param {*} item - 新增的图层信息
   * @param {*} active - 是否设置新增的图层为激活状态
   * @returns
   */
  add(item, active = false, refresh = true) {
    return new Promise(async(resolve, reject) => {
      if (!item) {
        reject();
      } else {
        await this._addLayerItem(item, active);
        refresh && this.fabricInstance.renderAll();
        resolve();
      }
    });
  }

  // 更新
  update({ type, name, layer, options }) {
    if (layer) {
      layer.set({ ...options });
    } else {
      const items = this.fabricInstance.getObjects();
      for (const item of items) {
        if (name && item.name === name) {
          item.set({ ...options });
        } else if (type && item.type === type) {
          item.set({ ...options });
        }
      }
    }

    this.fabricInstance.renderAll();
  }

  // 刷新
  refresh() {
    this.fabricInstance.renderAll();
  }

  // 删除图层
  remove({ name, type, layer }) {
    if (layer) {
      this.fabricInstance.remove(layer);
    } else {
      const items = this.fabricInstance.getObjects();
      for (const item of items) {
        if (name && item.name === name) {
          this.fabricInstance.remove(item);
        } else if (type && item.type === type) {
          this.fabricInstance.remove(item);
        }
      }
    }

    this.fabricInstance.renderAll();
  }

  // 获取图层
  getObjects() {
    return this.fabricInstance.getObjects();
  }

  // 获取激活图层
  getActiveObject() {
    return this.fabricInstance.getActiveObject();
  }

  // 重新渲染
  renderAll() {
    this.fabricInstance.renderAll();
  }

  // 获取渲染预览图
  toDataURL(targetWidth) {
    if (targetWidth) {
      const targetHeight = this.canvasSize.height / this.canvasSize.width * targetWidth;
      this.fabricInstance.setWidth(targetWidth);
      this.fabricInstance.setHeight(targetHeight);
      this.fabricInstance.setZoom(targetWidth / this.canvasSize.width);
    }
    return this.fabricInstance.toDataURL({
      format: 'png',
      quality: 1
    });
  }
}
