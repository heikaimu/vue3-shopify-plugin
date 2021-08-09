/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-05 16:38:05
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-06 16:23:49
 */

import { reactive, onMounted, computed, toRefs, toRaw } from "vue";

export default function useIncrement(props) {
  const state = reactive({
    previewWidthBackground: null,
    queue: [],
    index: -1
  })

  // 设置初始化值
  onMounted(() => {
    const { slides, publish, background, relatedProduct, vip } = props.config.currentProductTypeConfig;
    // 单双面
    if (slides && slides.visible) {
      state.queue.push({
        name: "slides",
        data: toRaw(slides.data),
        value: 'double'
      });
    }
    // 关联产品
    if (relatedProduct && relatedProduct.visible) {
      state.queue.push({
        name: "relatedProduct",
        data: toRaw(relatedProduct.data),
        value: []
      });
    }
    // 背景
    if (background && background.visible) {
      state.queue.push({
        name: "background",
        backgroundList: toRaw(background.data),
        composingList: toRaw(background.composingList),
        value: {}
      });
    }
    // VIP
    if (vip && vip.visible) {
      state.queue.push({
        name: "vip",
        data: toRaw(vip.data),
        value: false
      });
    }
  })

  // 是否有增量
  const hasIncrement = computed(() => {
    return state.queue > 0;
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

  // 增量数据
  const incrementData = computed(() => {
    return currentIncrement.value && currentIncrement.value;
  })

  // 单双面
  const slidesVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'slides';
  })
  function changeSlides(val) {
    _changeValue('slides', val);
  }

  // 推荐
  const publishVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'publish';
  })

  // 背景
  const backgroundVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'background';
  })
  function changeBackground(val) {
    _changeValue('background', val.params);
    state.previewWidthBackground = val.preview;
  }

  // 关联产品
  const relatedProductVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'relatedProduct';
  })
  function changeRelatedProduct(val) {
    _changeValue('relatedProduct', val);
  }

  // VIP
  const vipVisible = computed(() => {
    return currentIncrement.value && currentIncrement.value.name === 'vip';
  })
  function changeVip(val) {
    _changeValue('vip', val);
  }

  // 是否是最后一个增量
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

  return {
    ...toRefs(state),
    hasIncrement,
    incrementData,
    slidesVisible,
    publishVisible,
    backgroundVisible,
    relatedProductVisible,
    vipVisible,
    isLastIncrement,
    changeSlides,
    changeVip,
    changeRelatedProduct,
    changeBackground,
    setIncrementIndex,
    closeIncrement,
    next
  }
}