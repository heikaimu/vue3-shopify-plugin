/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-05 16:38:05
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-07 17:39:53
 */

import { reactive, onMounted, computed, toRefs, toRaw } from "vue";

const CLOSE_RESET = true;

export default function useIncrement(props) {

  const { config, isManagementUse, language } = props;

  const state = reactive({
    originalProductOptionsValue: {},
    productOptionsValue: {},
    previewWidthBackground: null,
    bgRenderParams: null,
    queue: [],
    index: -1,
    textData: null
  })

  // 设置初始化值
  onMounted(() => {
    initProductOptions();

    if (!isManagementUse) {
      addFrontEndQueue();
    } else {
      addManagementQueue();
    }
  })

  // 初始化商品选项
  function initProductOptions() {
    state.originalProductOptionsValue = { ...config.productOptionsValue || {} };
    state.productOptionsValue = config.productOptionsValue || {};
  }

  // 前端的队列
  function addFrontEndQueue() {
    const { slides, nightLight, publish, background, text, relatedProduct, vip } = config.currentProductTypeConfig;
    // 夜灯底座
    initNightLight(nightLight);
    // 背景
    initBackground(background);
    // 文字
    initText(text, background);
    // 单双面
    initSlides(slides);
    // 推荐
    initPublish(publish);
    // 关联产品
    initRelatedProduct(relatedProduct);
    // VIP
    initVip(vip);
  }

  // 管理端的队列
  function addManagementQueue() {
    const { background, text } = config.currentProductTypeConfig;
    // 背景
    initBackground(background);
    // 文字
    initText(text, background);
  }

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
  let slidesKeyName = '';

  const slidesVisible = computed(() => {
    return _isActiveItem('slides');
  })

  function initSlides(slides) {
    if (!_shouldEnqueue(slides)) {
      return;
    }

    // keyName
    slidesKeyName = slides.keyName || 'Type';

    const initValue = slides.data[0].value;
    console.log(initValue, 'initValue')
    _enqueue({
      data: toRaw(slides.data),
      initValue,
      name: 'slides'
    })

    changeSlides(initValue);
  }

  function changeSlides(val) {
    _changeValue('slides', val);
    _changeProductOptionsValue(slidesKeyName, val);
  }
  // ===============单双面 END===============

  // ===============推荐===============
  const publishVisible = computed(() => {
    return _isActiveItem('publish');
  })

  function initPublish(publish) {
    if (!_shouldEnqueue(publish)) {
      return;
    }

    _enqueue({
      data: toRaw(publish.data),
      initValue: {},
      name: 'publish'
    })
  }

  // 修改推荐值如果是尺寸，并且插件内有可选尺寸，需要重新渲染预览图
  function changePublish(data) {
    _changeProductOptionsValue(data.key, data.sku.title);
  }
  // ===============推荐 END===============

  // ===============夜灯底座===============
  let nightLightKeyName = '';

  const nightLightVisible = computed(() => {
    return _isActiveItem('nightLight');
  })

  function initNightLight(nightLight) {
    if (!_shouldEnqueue(nightLight)) {
      return;
    }

    // keyName
    nightLightKeyName = nightLight.keyName || 'Style';
    const initValue = nightLight.data[0].key;
    _enqueue({
      data: toRaw(nightLight.data),
      initValue,
      name: 'nightLight'
    })

    changeNightLight(initValue);
  }

  function changeNightLight(val) {
    _changeValue('nightLight', val);
    _changeProductOptionsValue(nightLightKeyName, val);
  }
  // ===============夜灯底座 END===============

  // ===============背景===============
  const backgroundVisible = computed(() => {
    return _isActiveItem('background');
  })

  function initBackground(background) {
    if (!_shouldEnqueue(background)) {
      return;
    }

    const data = {
      backgroundList: toRaw(background.data),
      composingList: toRaw(background.composingList),
      sizeList: toRaw(background.size),
      overlayImage: background.overlayImage,
      backgroundImage: background.backgroundImage,
    }

    _enqueue({
      data: data,
      initValue: {},
      name: 'background'
    })
  }

  function changeBackground(val) {
    setPreviewWidthBackground(val.preview);

    // 修改背景
    _changeValue('background', val.params);

    // 修改颜色
    _changeProductOptionsValue('Color', val.params.background.title);

    // 只有当尺寸属于SKU中的一个的情况才能修改SKU
    const sizeIndex = (config.skuList || []).findIndex(item => item.options.Size === val.params.size.title);
    sizeIndex > -1 && _changeProductOptionsValue('Size', val.params.size.title)
  }
  // 设置带背景的预览图
  function setPreviewWidthBackground(url) {
    state.previewWidthBackground = url;
  }
  // 背景渲染参数
  function saveBgRenderParams(val) {
    state.bgRenderParams = val;
  }
  // ===============背景 END===============

  // ===============文字===============
  const textVisible = computed(() => {
    return _isActiveItem('text');
  })

  function initText(text, background) {
    // 如果有背景，添加虚拟文字产品，方便进入背景定制步骤
    if (!text) {
      return;
    }

    const { visible, data, value } = text;
    if (visible) {
      // 如果设置了文字
      const initValue = {
        color: value ? value.color : '',
        fontFamily: value ? value.fontFamily : '',
        text: value ? value.text : ''
      }
      _enqueue({
        data: toRaw(data),
        initValue,
        name: 'text'
      })
      state.textData = data;

    } else {
      // 如果没有设置文字，但是设置了背景，也需要进入定制步骤调整图像位置，所以设置一个空的文字对象
      if (background && background.visible) {
        const virtualData = {
          desc: '',
          id: '',
          price: '',
          url: ''
        }
        const initValue = {
          color: '',
          fontFamily: '',
          text: ''
        }
        _enqueue({
          data: virtualData,
          initValue,
          name: 'text'
        })
      }
    }
  }

  function changeText(val) {
    _changeValue('text', val);
  }
  // ===============文字 END===============

  // ===============关联产品===============
  const relatedProductVisible = computed(() => {
    return _isActiveItem('relatedProduct');
  })

  function initRelatedProduct(relatedProduct) {
    if (!_shouldEnqueue(relatedProduct)) {
      return;
    }

    _enqueue({
      data: toRaw(relatedProduct.data),
      initValue: [],
      name: 'relatedProduct'
    })
  }

  function changeRelatedProduct(val) {
    _changeValue('relatedProduct', val);
  }
  // ===============关联产品 END===============

  // ===============VIP===============
  const vipVisible = computed(() => {
    return _isActiveItem('vip');
  })

  function initVip(vip) {
    if (!_shouldEnqueue(vip)) {
      return;
    }

    _enqueue({
      visible: vip.visible,
      data: toRaw(vip.data),
      initValue: false,
      name: 'vip'
    })
  }

  function changeVip(val) {
    _changeValue('vip', val);
  }
  // ===============VIP END===============

  // 判断是否是最后一个增量
  const isLastIncrement = computed(() => {
    return state.index === state.queue.length - 1;
  })

  const isFirstIncrement = computed(() => {
    return state.index === 0;
  })

  // 设置index
  function setIncrementIndex(index) {
    state.index = index;
    if (index === -1 && CLOSE_RESET) {
      resetProductOptionsValue();
    }
  }

  // 重置所有的商品选项
  function resetProductOptionsValue() {
    state.productOptionsValue = { ...state.originalProductOptionsValue };
  }

  // 下一个增量
  function next() {
    state.index += 1;
  }

  // 上一个增量
  function back() {
    state.index -= 1;
  }

  // 通用修改值
  function _changeValue(name, val) {
    const currentItem = state.queue.find(item => item.name === name);
    currentItem.value = val;
  }

  // 修改商品属性值
  function _changeProductOptionsValue(key, val) {
    if (!state.originalProductOptionsValue[key]) {
      return;
    }

    state.productOptionsValue[key] = val;
  }

  // 是否是激活状态
  function _isActiveItem(name) {
    return currentIncrement.value && currentIncrement.value.name === name;
  }

  // 是否可以加入队列
  function _shouldEnqueue(data) {
    if (!data) {
      return false;
    }

    if (!data.visible) {
      return false;
    }

    return true;
  }

  // 入队列
  function _enqueue({ data, initValue, name }) {
    state.queue.push({
      name: name,
      data: data,
      value: initValue
    });
  }

  return {
    ...toRefs(state),
    hasIncrement,
    incrementData,
    slidesVisible,
    nightLightVisible,
    publishVisible,
    backgroundVisible,
    textVisible,
    relatedProductVisible,
    vipVisible,
    isFirstIncrement,
    isLastIncrement,
    changeSlides,
    changeNightLight,
    changeVip,
    changeRelatedProduct,
    changeBackground,
    saveBgRenderParams,
    setPreviewWidthBackground,
    changeText,
    changePublish,
    setIncrementIndex,
    next,
    back
  }
}