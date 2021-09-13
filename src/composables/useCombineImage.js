/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 15:03:06
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-13 11:25:58
 */
import { reactive, toRefs, onMounted } from "vue";
import { fabric } from 'fabric';

const HEIGHT = 260;

export default function useCombineImage(props) {
  let _params = {};
  let _scale = 1;
  let _overlayImage = '';
  let _backgroundImage = '';
  let _canvasPreview = null;
  let _canvasOriginal = null;

  const state = reactive({
    loading: true,
    hasHandler: false
  })

  onMounted(() => {
    _canvasOriginal = new fabric.Canvas('canvasOriginal');
    _overlayImage = props.data.overlayImage;
    _backgroundImage = props.data.backgroundImage;
  })

  // 渲染效果图
  async function renderPreview(params, renderAll) {
    _params = params;
    const { backgroundImage, layerList, size } = _params;
    _scale = HEIGHT / size.height;
    // 是否显示控制器
    state.hasHandler = layerList.length === 1 && (_overlayImage || _backgroundImage);

    if (_canvasPreview && !renderAll) {
      // 如果有canvas并且不渲染所有则只渲染背景
      const queue = [];
      _setBackgroundAndOverlay(_canvasPreview, queue, backgroundImage, _scale);
    } else if (_canvasPreview && renderAll) {
      // 如果有canvas并且渲染所有
      _renderCanvas(params);
    } else {
      // 没有canvas的情况走完整流程
      _canvasPreview = new fabric.Canvas('bgCombineCanvas');
      _renderCanvas(params);
    }

  }

  // 渲染所有图层
  async function _renderCanvas(params) {
    const { size, backgroundImage, layerList, layerImage } = params;
    const queue = [];
    await _setCanvasSize({ canvas: _canvasPreview, size, scale: _scale });
    _setBackgroundAndOverlay(_canvasPreview, queue, backgroundImage, _scale);
    if (layerList && layerList.length > 0) {
      _addLayerList({ canvas: _canvasPreview, list: layerList, url: layerImage, scale: _scale })
    }
  }

  // 操作
  function handleLayer(action) {
    const layer = _canvasPreview.getObjects()[0];
    if (!layer) {
      return;
    }
    switch (action) {
      case 'zoomUp':
        layer.scale(layer.scaleX + 0.05);
        break;

      case 'zoomDown':
        layer.scale(layer.scaleX - 0.05);
        break;

      case 'rotateLeft':
        layer.set({
          angle: layer.angle - 45
        });
        break;

      case 'rotateRight':
        layer.set({
          angle: layer.angle + 45
        });
        break;

      default:
        break;
    }

    _canvasPreview.renderAll();
  }

  // 获取预览图
  async function getPreviewURL() {
    const { size, backgroundImage, layerImage } = _params;
    const items = _canvasPreview.getObjects();

    await _setCanvasSize({ canvas: _canvasOriginal, size, scale: 1 });

    const queue = [];

    _setBackgroundAndOverlay(_canvasOriginal, queue, backgroundImage, 1);

    const layerList = items.map(item => {
      const { top, left, scaleX, width, angle } = item;
      return {
        angle,
        top: top / _scale,
        left: left / _scale,
        width: width * scaleX / _scale
      }
    })
    if (layerList && layerList.length > 0) {
      queue.push(_addLayerList({ canvas: _canvasOriginal, list: layerList, url: layerImage, scale: 1 }));
    }

    return new Promise((resolve) => {
      Promise.all(queue).then(() => {
        setTimeout(() => {
          const url = _canvasOriginal.toDataURL({
            format: 'png',
            quality: 1
          });
          resolve(url);
        }, 300);
      });
    })
  }

  // 设置预览canvas尺寸
  function _setCanvasSize({ canvas, size, scale = 1 }) {
    canvas.setWidth(size.width * scale);
    canvas.setHeight(size.height * scale);
    canvas.clear();
  }

  // 添加图层集合
  function _addLayerList({ canvas, list, url, scale = 1 }) {
    return new Promise((reolve, reject) => {
      const queue = [];
      for (const item of list) {
        queue.push(_addLayer({ canvas, item, url, scale }));
      }

      Promise.all(queue).then(() => {
        reolve();
      });
    });
  }

  // 添加图层
  function _addLayer({ canvas, item, url, scale = 1 }) {
    const { angle, left, top, width } = item;
    return new Promise((resolve) => {
      fabric.Image.fromURL(url, (img) => {
        img.scale(scale * (width / img.width)).set({
          left: left * scale,
          top: top * scale,
          angle,
          selectable: state.hasHandler,
          originX: 'center',
          originY: 'center',
          centeredScaling: true
        });
        canvas.add(img);
        resolve();
      }, {
        crossOrigin: 'Anonymous'
      });
    });
  }

  // 设置遮盖图和背景图
  function _setBackgroundAndOverlay(canvas, queue, image, scale) {
    // 如果有遮盖图
    if (_overlayImage) {
      queue.push(_setCoverImage({ canvas, url: _overlayImage, scale, type: 'overlay' }));
      queue.push(_setCoverImage({ canvas, url: image, scale, type: 'background' }));
    } else if (_backgroundImage) {
      queue.push(_setCoverImage({ canvas, url: image, scale, type: 'overlay' }));
      queue.push(_setCoverImage({ canvas, url: _backgroundImage, scale, type: 'background' }));
    } else {
      queue.push(_setCoverImage({ canvas, url: image, scale, type: 'background' }));
    }
  }

  // 设置封面类型图片
  function _setCoverImage({ canvas, url, scale = 1, type = 'background' }) {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(url, (img) => {
        img.scale(scale);
        if (type === 'background') {
          canvas.setBackgroundImage(
            img,
            canvas.renderAll.bind(canvas)
          );
        } else {
          canvas.setOverlayImage(
            img,
            canvas.renderAll.bind(canvas)
          );
        }
        resolve();
      }, {
        crossOrigin: 'Anonymous'
      });
    });
  }

  return {
    ...toRefs(state),
    renderPreview,
    getPreviewURL,
    handleLayer
  }
}