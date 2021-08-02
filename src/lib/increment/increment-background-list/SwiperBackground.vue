<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-29 14:15:45
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-30 12:32:01
-->
<template>
  <div class="background-selector">
    <p class="background-title">{{ title }}</p>
    <swiper
      :slides-per-view="5"
      :space-between="2"
      :centered-slides="true"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      @click="onSlideClick"
    >
      <swiper-slide v-for="(item, index) in data" :key="index">
        <div class="background-card">
          <img class="background-img" :src="item.url" alt="" />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from "vue";

import { Swiper, SwiperSlide } from "swiper/swiper-vue.esm";
// Import Swiper styles
import "swiper/swiper.scss";

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
    backgroundActiveIndex: {
      type: Number,
      default: 0,
    },
  },

  emits: {
    change: null,
  },

  setup(props, context) {
    const state = reactive({
      swiper: null,
    });

    const title = computed(() => {
      const total = props.data.length;
      const currentIndex = state.swiper ? state.swiper.activeIndex : 0;
      return `Background (${currentIndex + 1} / ${total})`;
    });

    onMounted(() => {
      state.swiper.slideTo(props.backgroundActiveIndex);
    });

    // 初始化
    function onSwiper(swiper) {
      state.swiper = swiper;
    }

    // onSlideChange
    function onSlideChange(swiper) {
      context.emit("change", swiper.activeIndex);
    }

    function onSlideClick(swiper) {
      state.swiper.slideTo(swiper.clickedIndex);
    }

    return {
      ...toRefs(state),
      title,
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

.background-selector {
  padding: 0 10px 10px 10px;
  // background-color: #f9f9f9;
  .background-title {
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

  .background-card {
    border: 4px solid #ffffff;
    cursor: pointer;
    .background-img {
      display: block;
      width: 100%;
    }
  }
  .swiper-slide-active {
    .background-card {
      border: 4px solid $theme-color;
    }
  }
}
</style>