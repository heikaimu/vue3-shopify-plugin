<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-29 14:15:45
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-13 14:14:26
-->
<template>
  <div class="background-selector">
    <p class="background-title">{{pluginText.background}} {{ pagination }}</p>
    <swiper
      :slides-per-view="5"
      :space-between="5"
      :centered-slides="true"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      @click="onSlideClick"
    >
      <swiper-slide v-for="(item, index) in list" :key="index">
        <div class="background-card">
          <!-- <div
            class="background-img"
            :style="{ backgroundImage: `url(${item.url})` }"
          ></div> -->
          <img class="background-img" :src="item.url" alt="" />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { inject, watch, computed } from "vue";

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
    size: {
      type: String,
      default: "100x100",
    },
  },

  emits: {
    change: null,
  },

  setup(props, context) {

    // 国际化
    const pluginText = inject("pluginText");

    let { mySwiper, pagination } = useSwiper(props);

    const list = computed(() => {
      return props.data.map((group) => {
        return {
          title: group.title,
          url:
            (group.list.find((item) => item.size === props.size) || {}).url ||
            "",
        };
      });
    });

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
      pluginText,
      pagination,
      list,
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
    border-radius: 6px;
    border: 3px solid #f2f2f2;
    background-color: #f2f2f2;
    cursor: pointer;
    .background-img {
      display: block;
      width: 100%;
      height: 70px;
      object-fit: contain;
      // background-size: contain;
      // background-repeat: no-repeat;
      // background-position: center center;
      // transition: 0.3s;
    }
  }
  .swiper-slide-active {
    .background-card {
      border: 3px solid $theme-color;
    }
  }
}
</style>