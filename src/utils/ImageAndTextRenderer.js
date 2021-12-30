/*
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-08 17:30:37
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-30 14:01:23
 */
import { fabric } from 'fabric';
import 'fabric-customise-controls';
import Event from "./Event";

const ICON_TL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWklEQVRYR+2WS6hOYRSGn3coA5EBM6EwcAklROdQh4nBGVBCkWLgmCi3EaVcSilChGMgA7ekTBg45TbBwP1WTJQiMxlIr5b21n+2/9/f3sdf/+Ss2d7fWu/37vW9+/2W6HCow/szTKBSB2zvAHYCYyoe2Rdgn6RjqfwkAduTgXdAgJ5IAQLjgU1Z3lxJj8tqqhDYC+wBuiUNVCCA7a3AUeC0pM2VCdjuAdYC6wpFSaDiJrYfAXMK748AVyXdz9//7YDtNcCFFmyTrWxCYCVwqQVer6TrsdZI4B6wENgmKZi2PWyHNk4BDyUtKBIw8FTSzNTOtlcDS4ClwE/gZgZ6uULte2CSpD8f39iBIDAgqbsViO1RQHRnQ5bzEfgVgNnzXWCVpM8lGHeArtoEbIegQlgRB4GLkp7Fg+2pmU+sz9YnSvrQjITt+gRsjwZeAuOAHkm3W4D3AteAN/EHSPreRJxDInAICDc8J2lj2Tnbzn3jsKTt7SJwA1gBTJP0OkFgeogZuCVpWbsIfAJ+SApbTobtOP8RkuLIBsVQNdBxAh0/glyExyX1JTSwCzgAtFWEE4DnwMjcQEqMJgztGzBF0te2aCAzmzCZ/gxwd9hvwYiiM1uy9cWSwhX/iSGJMEexvQiIWyyfjIpWHMbTJ+l8SYfqG1EjmO2xme3OAOLiirsgpp5XwElJQapl/FcHkgZQIaGMQMwDs4FZkt5WwKqdYjvwHwBPms0D4fFngBfAldro1QqWA/Ma58tBQ6ntLmA/ML8aXu2smAX7JZ3NK5NTce0tahYME+h4B34DdsNYMI+a3t0AAAAASUVORK5CYII=';
const ICON_TR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABLElEQVRYR+2WMU7EMBBF3z8Doqei4RJLQ0EPNR0V/XbsHoICKmpqeujokbgESFzhI6+8KERObIeEFVLcejz/+c+ME7HjpR3rMwP8Xwds3wKHNT0k6bgdP8gB2w/AWY048DwmwAkQHDiogBgPoEIU247xM8C0DtheAVfAa7PZ/qQEUfw61vpT0t62TwYDxDl/kXTf13Qt8RC6lhTc2KxBAI05/3GbNkhO/DcAT8AiJJCUfKxKxCcDKBWfBCAhvpK07uoT2+/APnAn6bLoW2A7WYJa8ejABXAq6TwF2VXfLoDtbUKu3puXPte1AAHsCLjps71UfNPkqeCuEtQkLo2dAbIOFFr5BiwlPRbGf4eNBRASJuc8B9QHkDvb3P/omvNckkE/pbmkNfszwOzAF0fStCFcRTQ2AAAAAElFTkSuQmCC';
const ICON_BL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAgCAYAAACPb1E+AAAC8ElEQVRYR82YT4hNYRjGf092bGzIhlIWapRkoYT8yUoUNigZRUZZGaEUMynKNLNRakRG+RNFip0yo1HKYhYSjYWQzSzEQknUq/d2zu27555z7jlnzpVvc+vc7z3P77zn/Z7zfp+oMMzsPrBA0qYw3MwMGJN0ML5uZruAB8CApMEKcqhskJntA257nKSW+AhyIoQ3swHgHPALWClpuqxmFcgnwLYKkB5yXtLZrkKa2TpgMhYpmUkP+wCskPSzDGipTJrZFeDoLCA9tE/SaFcgzWwJ8A6YmwPp9ee12vj1EdRkfOmFpPXdgjwNXASeAlvTajJNOAXSp22X5LVdaBR+3Wb2BugB9gJ3MxZOkUx66D1JewoR+pspMjGwnY+Ae+B4xdUdyrkdvS6iXxQyth23D1/ddUCOSOqvBTJhO4uBZTVBzgBLi9hRx0wGtnNL0n4z21gTpCexX9JIp2zmQka28ym6yWZJ4zVDTklaPVvI2HZeSVoT+V6dmfRb7pb0MA+0UyY/A16HRyRdLQBZ1IJCpseSdlSCDGznO7BQ0u9OkCXMPDk1144yM2lmz4ENwLCkE/FdO9Skl4J/FieC+XGrlpesUUl9WRNSIRO20yPpbUFIb3qz+sk8yB/R20rtjrIgx4ADQFu91Ly6Q/BTki6lPUkbZMJ2dkp6FAZ2EXJa0vKikHENpQZ1ETLTjtIy+Q2YD5yUNJR8si5DPpO0JamZ3Eh5HXo9+gLw3eDXfwzpcm12lIScAlYB1yUdyvC9vC9OFTNPylyTdDi82IQ0M/dE90YfayW9LAs5CzNvWZvAvLA7CiF9A+8b+UlJDpw6OtRkHZl03RY7akAmbKdX0s2KkFXNPCn3RZL3DI0RQw4Dx4EZSYuyAKMHqrsLypJrdkcx5B9gDnBB0pn/BLL5eZWZHQMuR2AtB1A5sHXscfJyEf/XsCOHdMFG91J2VDhmKSsx6AcNDnkD6C0b7XtvSX7C1hxmdgd4nzjBiI/+KkjQgPwLZlwVP+daef0AAAAASUVORK5CYII=';
const ICON_BR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5ElEQVRYR8WWSahOYRjHf/9YoFCsWMhcMi1koRApN+MOkWJhWphKsSHExrBBFvdSigyxNIQNoSwMyQJZGCLDgmRDUX89er/Pueeeb7rfp/vUW9/5zjnP/3fe95lED5t6WJ9uAdgeCkxM6zvwFngHvJcU13Vb3QC2pwDrgDnAqCoK54Bzkq7WQ1ETICMc4mE/gFdpvQB6AYOAwUBAxu6E3QOOS7pQDaQqgO0lwMXk4ANwAmiX9LHIqe0hwHpgbQZkg6T2ShAVAXLie6sJ550nkIPAynRvu6RDRRCFADnxlZLO1nOeBSDHgI3p/82S4rqTVQKIbY/tny3pdnfES+/Y3gPsBuIIZ0iK+ClbtSOYJul+M+Lxru3ewB1gWsSQpFIw/3VdMwuaBUgQC4AryVebpJslv50AbC8Hfku61ArhrA/bEUcrgF2S9ncBsN0feAj8kjThPwCsBk4BlyUtLgI4DGxLN/ZKiuBpmdkeDkTh+gZMlvS5HAO2ZwG3cmp9Jf1sliBlQcnNVGA+EHXlXxDavgbMy4mdlrSqBQDxceG/b4GvLbK9CThaQWi8pGctgDgAbM/5eSNpRABEkShlQ/wO2gflLWpBLKQAj+Y0KQOxSNKVchqmHv8EGACMk/S62S/PpWGkeLTqsGuSojZ0LkS2bwBzo5tJOtlKgPBlOwACpHy0+UK0D9gJnJcURaOlZnsssEZSOR7yAG3A9aS6sN6pphFK232y6d2lF9juSANFNKKZkn43IlD0rO1Jkp4W3SsCGAncTRNN0xUxM1tckrQ0D1FpHsjWhiOStnZnF3KDzdKiJldtHoi+EP0h7Aywo9IsWGHbo++XZsFC8S5pmHdkO4bLiImwmkNpSrUQjhUTclhF8ZoAyeGyNNdNz4BEwYqu9hX4AoxOa0wa0ePRAO+Q9Kja8dU9EdmOyhW1oVp9eAnEDFlTuARVN0DpBdsDgWGZ1Q94DDyX9KnRYG0YoFGBWs/3OMAfr8wMGJFpMYMAAAAASUVORK5CYII=';
const ICON_DELETE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAVVJREFUWEftlzFOw0AQRd8vaZFyBChAogB6yAGgpAbRwh24A7QICipKOAChBwqk0HCESLSUH61kI+Ow9i6KlSjEpXd25833+u+smPKjKecnG8B2D1iPgA8ljXKK+gvAHbAXSXIvab9rgDNgJ5LkUVIYT36yFUheOTFwDMD2A7CbOD83bCCpX500ewAlXUWJvqRBbqmp8dE9MBcAtleBGyD4w9FvqnSqgO2wmcOmHtt8JUw2QOGEPUlv1YpsrwGjqhN2BVA64bak5wBhewt4An44YVcApU98/x2xRAuAhQILBeZWgdDxbALHpesV7ngJvFQ7ok4USD1mC4ec/FnwrwDOgRPgOnaWt6lh+wo4BC4kneb2A+X3C/M+gNe2hLXxDWC5eBdt6xrb8uKMv224CbUxDYGDeu/Q2BXXV7S9BKxUqmlLWo4H1d4lfTZNmL2LSWp5k4r7AiUUTTDPV9MhAAAAAElFTkSuQmCC';
const ICON_PERSON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAAAXNSR0IArs4c6QAAAQtJREFUOE+10qFL3WEUxvHPk02ChoFhxWpcn2EiwvwDRFheNgxWNAoiGgyCQf8Ck01RzJMVsQ0GggaLTRDhyA+88lPv9V5B3/i+5/m+nO858Q4n78DQE1JV3zGDTzhL8qvXh10hVTWBdZzgFN9wkWShG6gXZBl3SX43oaoaxTmGk9w8B/WCHGIpyVEnUFUv7jpvHwrZepC52mrnHyaS/B+0nS9ovLTF3ib50VdsVU1jCpMYR/PrNT5jCLv4m2StDXt0UlWLmMcGjpP8aRdW1Qhm8RVzSR6zbUhjfyXJXr8trqoz/OxMrw3ZxD6u+kFwgLEkl03tkxE/7MIADDtJtl/dk0EoXcW+NdiuvwcshGMR7ZqM6QAAAABJRU5ErkJggg==';

export default class ImageAndTextRenderer {
  constructor(canvasID, active = true) {
    // 画布
    if (active) {
      this.instance = new fabric.Canvas(canvasID);
    } else {
      this.instance = new fabric.StaticCanvas(canvasID);
    }


    // 选中对象不置顶
    this.instance.preserveObjectStacking = true;

    this.width = 0;
    this.height = 0;

    // 图层
    this.layerList = [];

    // 控制器
    this._controlAction();

    // 订阅者
    this.event = new Event();
  }

  /**
   * 初始化画布
   * @param {object} params - 参数
   * @param {number} params.width - 宽
   * @param {number} params.height - 宽
   * @param {object} params.backgroundImage - 背景图
   * @param {object} params.overlayImage - 遮盖图
   * @param {array} params.layerList - 图层
   * @param {number} zoomLevel - 缩放倍数
   */
  async init({ id, name, width, height, backgroundImage, overlayImage, layerList = [] }, zoomLevel = 1) {
    this.id = id;

    // 清空画布
    this.instance.clear();

    // 画布缩放
    this.name = name;
    this.width = width;
    this.height = height;

    // 缩放画布
    this.zoomLevel = zoomLevel;
    this.instance.setZoom(zoomLevel);

    // 设置画布宽高
    this.setCanvasSize(width * zoomLevel, height * zoomLevel);

    // 渲染
    const queue = [];

    // 图层
    for (const group of layerList) {
      group.active = false;
    }
    this.layerList = layerList;
    queue.push(this.renderLayers(layerList));

    // 背景
    backgroundImage && queue.push(this.setBackgroundImage(backgroundImage));

    // 遮盖
    overlayImage && queue.push(this.setOverlayImage(overlayImage));

    return new Promise((resolve, reject) => {
      Promise.all(queue).then((res) => {
        resolve();
      });
    });
  }

  /**
   * 设置画布宽高
   * @param {*} width
   * @param {*} height
   */
  setCanvasSize(width, height) {
    this.instance.setWidth(width);
    this.instance.setHeight(height);
  }

  /**
   * 设置背景图
   * @param {object} data - 背景参数
   * @param {string} data.url - 图片地址
   * @param {string} [data.globalCompositeOperation=source-over'] - 叠加模式
   */
  setBackgroundImage(data) {
    this.backgroundImage = data;

    const { url, globalCompositeOperation = 'source-over' } = data;

    return new Promise((resolve, reject) => {
      if (!url) {
        resolve('背景不存在');
      } else {
        fabric.Image.fromURL(url, img => {
          img.scaleToWidth(this.width);
          img.set({
            globalCompositeOperation
          });
          this.instance.setBackgroundImage(img, () => {
            this.instance.renderAll();
            resolve(true);
          });
        }, {
          crossOrigin: 'Anonymous'
        });
      }
    });
  }

  /**
   * 设置背景图
   * @param {object} data - 背景参数
   * @param {string} data.url - 图片地址
   * @param {string} [data.globalCompositeOperation=source-over'] - 叠加模式
   */
  setOverlayImage(data) {
    this.overlayImage = data;

    const { url, globalCompositeOperation = 'source-over' } = data;

    return new Promise((resolve, reject) => {
      if (!url) {
        resolve('背景不存在');
      } else {
        fabric.Image.fromURL(url, img => {
          img.scaleToWidth(this.width);
          img.set({
            globalCompositeOperation
          });
          this.instance.setOverlayImage(img, () => {
            this.instance.renderAll();
            resolve(true);
          });
        }, {
          crossOrigin: 'Anonymous'
        });
      }
    });
  }

  /**
   * 初始化渲染图层
   * @param {array} list - 图层组集合
   */
  async renderLayers(list) {
    const renderList = getRenderList(list);
    const queue = renderList.map(annex => {
      if (annex.type === 'text') {
        return this._getAnnexText(annex);
      }
      return this._getAnnexImg(annex, annex.curSkin);
    });

    return new Promise((resolve) => {
      Promise.all(queue).then(res => {
        for (const obj of res) {
          this.instance.add(obj);
        }

        resolve(true);
      });
    });
  }

  // 获取最终渲染图片
  toDataURL() {
    return this.instance.toDataURL();
  }

  // 保存图片
  savePreview(zoomLevel) {
    return new Promise((resolve, reject) => {
      this.setCanvasSize(this.width, this.height);
      this.instance.setZoom(zoomLevel);
      const url = this.toDataURL();
      resolve(url);
    })
  }

  /**
   * 操作对象
   * @param {object} obj - 操作的对象
   * @param {string} command - 指令
   * @param {number} [step=10] - 单次移动距离
   */
  handleObject(obj, command, step = 10) {

    switch (command) {
      case 'moveLeft':
        obj.left -= step;
        break;

      case 'moveRight':
        obj.left += step;
        break;

      case 'moveUp':
        obj.top -= step;
        break;

      case 'moveDown':
        obj.top += step;
        break;

      case 'zoomUp':
        obj.scale(obj.scaleX * 1.1);
        break;

      case 'zoomDown':
        obj.scale(obj.scaleX / 1.1);
        break;

      default:
        break;
    }

    this.instance.renderAll();
  }

  /**
   * 返回附件图片对象
   * @param {object} config - 附件参数
   * @returns {object}
   */
  _getAnnexImg(config) {
    return new Promise((resolve) => {
      const { id, url, type, name, top, left, width, angle = 0, originX = 'center', originY = 'center', selectable = true, active, globalCompositeOperation = 'source-over' } = config;

      fabric.Image.fromURL(url, img => {
        const targetWidth = width;
        const scale = targetWidth / img.width;

        img.scale(scale).set({
          top: top,
          left: left,
          angle,
          originX,
          originY,
          selectable,
          name: name,
          type,
          id,
          active,
          globalCompositeOperation
        });

        this._controlStyleOne(img);

        resolve(img);
      }, {
        crossOrigin: 'Anonymous'
      });
    });
  }

  /**
   * 获取文字对象
   * @param {object} config - 附件参数
   */
  _getAnnexText(config) {
    return new Promise((resolve, reject) => {
      const { id, type, name, width, left, top, angle = 0, selectable, text = '', fontFamily = '', color = '#111111', fontSize = 40 } = config;
      const t = new fabric.Text(text, {
        id,
        type,
        name,
        fontSize,
        fontFamily,
        fill: color,
        left,
        top,
        angle,
        selectable,
        transparentCorners: false,
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        originalWidth: width
      });

      resolve(t);
    });
  }


  // 获取图层
  getObjects() {
    return this.instance.getObjects();
  }

  // 更新
  update({ type, name, layer, options }) {
    if (layer) {
      layer.set({ ...options });
    } else {
      const items = this.instance.getObjects();
      for (const item of items) {
        if (name && item.name === name) {
          item.set({ ...options });
        } else if (type && item.type === type) {
          item.set({ ...options });
        }
      }
    }

    this.instance.renderAll();
  }

  /**
   * 缩放
   * @param {*} x
   * @param {*} y 
   * @param {*} newZoomLevel 
   */
  zoomToPoint(x, y, newZoomLevel) {
    const curZoomLevel = this.instance.getZoom();
    const zoomPoint = new fabric.Point(x * curZoomLevel, y * curZoomLevel);
    this.instance.zoomToPoint(zoomPoint, newZoomLevel);
  }

  /**
   * 还原缩放
   */
  resetZoom() {
    this.instance.setZoom(this.zoomLevel);
    this.instance.absolutePan({ x: 0, y: 0 });
  }

  /**
   * 订阅模式
   * @param {string} trigger - 触发器
   * @param {function} fn - 效果函数
   */
  on(trigger, fn) {
    this.event.add(trigger, fn);
  }

  // 控制器样式修改
  _controlAction() {
    fabric.Canvas.prototype.customiseControls({
      tl: {
        action: (e, target) => {
          // 订阅
          this.event.trigger('tlClick', target);
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
          this.instance.renderAll();
        },
        cursor: 'pointer'
      }
    });
  }

  // 图层控制器特殊样式
  _controlStyleOne(layer) {
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
        icon: ICON_PERSON
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
      this.instance.renderAll();
    });
  }
}


function getRenderList(list) {
  const imageList = list.filter(item => item.type === 'image');
  const textList = list.filter(item => item.type === 'text');
  return [...imageList, ...textList];
}