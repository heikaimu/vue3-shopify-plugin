/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-05 16:38:05
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-08 16:32:42
 */

import { reactive, onMounted, computed, toRefs, toRaw } from "vue";

import { CombineImage } from "../utils/combineImage";

export default function useIncrement(config, previewBody) {

  const combineImage = new CombineImage();
  
  const state = reactive({
    productOptionsValue: {},
    previewWidthBackground: null,
    textRenderParams: null,
    queue: [],
    index: -1,
    sizeList: [],
    publishLoading: false
  })

  // 设置初始化值
  onMounted(() => {
    // 初始化商品选项
    state.productOptionsValue = config.productOptionsValue || {};
    // 增量
    const { slides, publish, background, text, relatedProduct, vip } = config.currentProductTypeConfig;
    // 单双面
    initSlides(slides);
    // 背景
    initBackground(background);
    // 推荐
    initPublish(publish);
    // 文字
    initText(text);
    // 关联产品
    initRelatedProduct(relatedProduct);
    // VIP
    initVip(vip);
  })

  // 是否有增量
  const hasIncrement = computed(() => {
    return state.queue.length > 0;
  })

  // 当前的增量服务
  const currentIncrement = computed(() => {
    if (state.queue.length === 0) {
      return null;
    }
    if (state.index === -1) {
      return null;
    }
    return state.queue[state.index];
  })

  // 当前增量数据
  const incrementData = computed(() => {
    return currentIncrement.value && currentIncrement.value;
  })

  // ===============单双面===============
  function initSlides(slides) {
    if (slides && slides.visible) {
      const initSlide = 'double'
      state.queue.push({
        name: "slides",
        data: toRaw(slides.data),
        value: initSlide
      });
      changeSlides(initSlide);
    }
  }
  const slidesVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'slides';
  })
  function changeSlides(val) {
    _changeValue('slides', val);
    const typeVal = val === 'double' ? "Double Side" : "Single Side";
    _changeProductOptionsValue('Type', typeVal);
  }
  // ===============单双面 END===============

  // ===============推荐===============
  function initPublish(publish) {
    console.log('publish',publish)
    if (publish && publish.visible) {
      state.queue.push({
        name: "publish",
        data: toRaw(publish.data),
        value: {}
      });
    }
  }
  const publishVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'publish';
  })
  // 修改推荐值如果是尺寸，并且插件内有可选尺寸，需要重新渲染预览图
  function changePublish(data) {
    if (data.key === 'Size') {
      const currentSize = config.sizeList.find(item => {
        return item.label === data.sku.title;
      })

      if (currentSize) {
        renderPreview(currentSize);
      }
    }

    _changeProductOptionsValue(data.key, data.sku.title);
  }
  // ===============推荐 END===============

  // ===============渲染带背景的预览图===============
  const layerImage = computed(() => {
    return previewBody.value;
  })
  
  async function renderPreview(size) {
    // TODO
    const background = state.queue.find(item => item.name === 'background');
    if (background) {
      const params = {
        size: toRaw(size.value),
        backgroundImage: getBackground(background, size),
        layerList: getComposing(background, size),
        layerImage: layerImage.value,
      }
      state.publishLoading = true;
      const { url, id } = await combineImage.getURL(params, 'renderAgain');
      state.publishLoading = false;
      setPreviewWidthBackground(url);
    }
  }

  function getBackground(data, size) {
    const item = (data.backgroundList || [])[data.value.background.index];
    if (!item) {
      return [];
    }
    
    const background = item.list.find(item => item.size === size.label);
    return background ? background.url : '';
  }

  function getComposing(data, size) {
    const item = (data.composingList || [])[data.value.composing.index];
    if (!item) {
      return [];
    }
    
    const composing = item.list.find(item => item.name === size.label);
    return composing ? composing.position : [];
  }
  // ===============渲染带背景的预览图 END===============

  // ===============背景===============
  function initBackground(background) {
    if (background && background.visible) {
      state.queue.push({
        name: "background",
        backgroundList: toRaw(background.data),
        composingList: toRaw(background.composingList),
        sizeList: toRaw(background.size),
        overlayImage: background.overlayImage,
        backgroundImage: background.backgroundImage,
        value: {}
      });
      state.sizeList = background.size;
    }
  }
  const backgroundVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'background';
  })
  function changeBackground(val) {
    setPreviewWidthBackground(val.preview);

    state.textRenderParams = val.textRenderParams;
    
    // 修改背景
    _changeValue('background', val.params);

    // 修改颜色
    _changeProductOptionsValue('Color', val.params.background.title);

    // 只有当尺寸属于SKU中的一个的情况才能修改SKU
    const sizeIndex = config.skuList.findIndex(item => item.options.Size === val.params.size.title);
    if (sizeIndex > -1) {
      _changeProductOptionsValue('Size', val.params.size.title)
    };
  }
  function setPreviewWidthBackground(url) {
    state.previewWidthBackground = url;
  }
  // ===============背景 END===============

  // ===============文字===============
  function initText(text) {
    if (text && text.visible) {
      state.queue.push({
        name: "text",
        data: toRaw(text.data),
        value: {}
      });
    }
  }
  const textVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'text';
  })
  function changeText(val) {
    _changeValue('text', val);
  }
  // ===============文字 END===============

  // ===============关联产品===============
  function initRelatedProduct(relatedProduct) {
    if (relatedProduct && relatedProduct.visible) {
      state.queue.push({
        name: "relatedProduct",
        data: toRaw(relatedProduct.data),
        value: []
      });
    }
  }
  const relatedProductVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'relatedProduct';
  })
  function changeRelatedProduct(val) {
    _changeValue('relatedProduct', val);
  }
  // ===============关联产品 END===============

  // ===============VIP===============
  function initVip(vip) {
    if (vip && vip.visible) {
      state.queue.push({
        name: "vip",
        data: toRaw(vip.data),
        value: false
      });
    }
  }
  const vipVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'vip';
  })
  function changeVip(val) {
    _changeValue('vip', val);
  }
  // ===============VIP END===============

  // 判断是否是最后一个增量
  const isLastIncrement = computed(() => {
    return state.index === state.queue.length - 1;
  })

  // 设置index
  function setIncrementIndex(index) {
    state.index = index;
  }

  // 下一个增量
  function next() {
    state.index += 1;
  }

  // 通用修改值
  function _changeValue(name, val) {
    const currentItem = state.queue.find(item => item.name === name);
    currentItem.value = val;
  }

  // 修改默认商品属性值
  function _changeProductOptionsValue(key, val) {
    if (!state.productOptionsValue[key]) {
      return;
    }

    state.productOptionsValue[key] = val;
  }

  return {
    ...toRefs(state),
    hasIncrement,
    incrementData,
    slidesVisible,
    publishVisible,
    backgroundVisible,
    textVisible,
    relatedProductVisible,
    vipVisible,
    isLastIncrement,
    changeSlides,
    changeVip,
    changeRelatedProduct,
    changeBackground,
    setPreviewWidthBackground,
    changeText,
    changePublish,
    setIncrementIndex,
    next
  }
}