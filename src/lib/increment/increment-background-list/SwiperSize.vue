<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-29 14:15:45
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-04 17:46:36
-->
<template>
  <div class="size-selector">
    <p class="size-title">Size {{ pagination }}</p>
    <swiper
      :slides-per-view="5"
      :space-between="5"
      :centered-slides="true"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      @click="onSlideClick"
    >
      <swiper-slide v-for="(item, index) in data" :key="index">
        <div class="size-card">{{ item }}</div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { reactive, toRefs, watch, computed } from "vue";

import { Swiper, SwiperSlide } from "swiper/swiper-vue.esm";
// Import Swiper styles
import "swiper/swiper.scss";

import useSwiper from "../../../composables/useSwiper";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },

  props: {
    data: {
      type: Array,
      default: () => [],
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
  },

  emits: {
    change: null,
  },

  setup(props, context) {
    let { mySwiper, pagination } = useSwiper(props);

    // 当索引改变的时候修改激活对象
    watch(
      () => props.activeIndex,
      (newIndex, oldIndex) => {
        if (newIndex !== oldIndex) {
          mySwiper.slideTo(newIndex);
        }
      }
    );

    // 初始化
    function onSwiper(swiper) {
      mySwiper = swiper;
    }

    // onSlideChange
    function onSlideChange(swiper) {
      context.emit("change", swiper.activeIndex);
    }

    // 点击
    function onSlideClick(swiper) {
      mySwiper.slideTo(swiper.clickedIndex);
    }

    return {
      pagination,
      onSwiper,
      onSlideChange,
      onSlideClick,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.size-selector {
  padding: 0 10px 0 10px;
  // background-color: #f9f9f9;
  margin-bottom: 5px;
  .size-title {
    @include flex-row-center;
    font-size: 12px;
    line-height: 2;
    font-weight: 600;
    color: $context-color;
    margin-bottom: 5px;
    &::after {
      content: "";
      display: block;
      flex: 1;
      height: 1px;
      border-bottom: 1px solid currentColor;
      margin-left: 10px;
      opacity: 0.3;
    }
    &::before {
      content: "";
      display: block;
      flex: 1;
      height: 1px;
      border-bottom: 1px solid currentColor;
      margin-right: 10px;
      opacity: 0.3;
    }
  }

  .size-card {
    border-radius: 17px;
    background-color: #ffffff;
    border: 1px solid #f1f2f2;
    cursor: pointer;
    text-align: center;
    line-height: 24px;
    font-size: 12px;
  }
  .swiper-slide-active {
    .size-card {
      border: 1px solid $theme-color;
    }
  }
}
</style>