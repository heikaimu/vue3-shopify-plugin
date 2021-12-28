/*
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-08 17:30:37
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-27 17:59:17
 */
import { fabric } from 'fabric';

export default class ImageAndTextRenderer {
  constructor(canvasID) {
    // 画布
    this.instance = new fabric.Canvas(canvasID);

    // 选中对象不置顶
    this.instance.preserveObjectStacking = true;

    this.width = 0;
    this.height = 0;

    // 图层
    this.layerList = [];
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
}


function getRenderList(list) {
  const imageList = list.filter(item => item.type === 'image');
  const textList = list.filter(item => item.type === 'text');
  return [...imageList, ...textList];
}