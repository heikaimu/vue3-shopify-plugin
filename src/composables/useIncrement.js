/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-05 16:38:05
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-16 13:07:26
 */

import { reactive, onMounted, computed, toRefs, toRaw } from "vue";

export default function useIncrement(props) {
  const state = reactive({
    productOptionsValue: {},
    previewWidthBackground: null,
    queue: [],
    index: -1
  })

  // 设置初始化值
  onMounted(() => {
    // 初始化商品选项
    state.productOptionsValue = props.config.productOptionsValue || {};
    // 增量
    const { slides, publish, background, text, relatedProduct, vip } = props.config.currentProductTypeConfig;
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
  function changePublish(data) {
    _changeProductOptionsValue(data.key, data.sku.title);
  }
  // ===============推荐 END===============

  // ===============背景===============
  function initBackground(background) {
    if (background && background.visible) {
      state.queue.push({
        name: "background",
        backgroundList: toRaw(background.data),
        composingList: toRaw(background.composingList),
        sizeList: toRaw(background.size),
        value: {}
      });
    }
  }
  const backgroundVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'background';
  })
  function changeBackground(val) {
    _changeValue('background', val.params);
    state.previewWidthBackground = val.preview;
    _changeProductOptionsValue('Size', val.params.size.title);
    _changeProductOptionsValue('Color', val.params.background.title);
  }
  // ===============背景 END===============

  // ===============文字===============
  function initText(text) {
    if (text && text.visible) {
      state.queue.push({
        name: "text",
        data: toRaw(text.data),
        value: ''
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

  // 关闭增量
  function closeIncrement() {
    state.index = -1;
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
    changeText,
    changePublish,
    setIncrementIndex,
    closeIncrement,
    next
  }
}