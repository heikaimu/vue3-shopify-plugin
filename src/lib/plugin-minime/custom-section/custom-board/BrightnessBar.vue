<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 17:23:05
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-11 14:14:45
-->
<template>
  <div class="brightness-bar" :class="{ active: active }">
    <div class="brightness-button open" @click="active = true" id="icon_brightness_open">
      <base-icon icon="brightness" color="goldenrod"></base-icon>
    </div>
    <div class="brightness-button close" @click="active = false" id="icon_brightness_close">
      <base-icon icon="arrowLeft" color="goldenrod"></base-icon>
    </div>
    <div class="brightness-wrapper">
      <div class="item">
        <div class="brightness-slider">
          <span class="brightness-slider-icon">
            <base-icon icon="brightness" color="goldenrod"></base-icon>
          </span>
          <span class="brightness-slider-text">{{ rateBrightness }}</span>
          <el-slider
            v-model="valueBrightness"
            :min="0"
            :max="100"
            :showTooltip="false"
            @change="handleChange"
          ></el-slider>
        </div>
      </div>
      <div class="item">
        <div class="brightness-slider">
          <span class="brightness-slider-icon">
            <base-icon icon="contrast" color="goldenrod"></base-icon>
          </span>
          <span class="brightness-slider-text">{{ rateContrast }}</span>
          <el-slider
            v-model="valueContrast"
            :min="0"
            :max="100"
            :showTooltip="false"
            @change="handleChange"
          ></el-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed } from "vue";

import BaseIcon from "../../../../base/BaseIcon.vue";
import "element-plus/lib/theme-chalk/index.css";
import { ElSlider } from "element-plus";

import { colorMatrix } from "../../../../utils/image";

export default {
  components: {
    BaseIcon,
    ElSlider,
  },

  props: {
    url: "",
  },

  emits: {
    change: null,
  },

  setup(props, context) {
    const state = reactive({
      active: false,
      valueBrightness: 50,
      valueContrast: 50,
    });

    const rateBrightness = computed(() => {
      return `${(state.valueBrightness - 50) * 2}%`;
    });

    const rateContrast = computed(() => {
      return `${(state.valueContrast - 50) * 2}%`;
    });

    // 滑块滑动结束后执行
    function handleChange() {
      const params = {
        brightness: (state.valueBrightness - 50) * 2.5,
        contrast: (state.valueContrast - 50) / 100 + 1,
      };
      colorMatrix(props.url, params).then((url) => {
        context.emit("change", url);
      });
    }

    return {
      ...toRefs(state),
      rateBrightness,
      rateContrast,
      handleChange,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.brightness-bar {
  @include pos-absolute(auto, auto, 10px, 0, 99);
  height: 80px;

  &.active {
    @include pos-absolute(auto, 0, 10px, 0, 99);
    .brightness-button {
      &.open {
        opacity: 0;
        transform: translate3d(-100px, 0, 0);
      }
      &.close {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    .brightness-wrapper {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
}

.brightness-button {
  @include flex-row-center;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 0 15px #e7e7e7;
  transition: 0.3s;
  cursor: pointer;

  &.open {
    @include pos-absolute(15px, auto, auto, 0, 99);
    width: 50px;
    height: 50px;
    border-radius: 0 25px 25px 0;
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: 0.3s;
  }

  &.close {
    @include pos-absolute(auto, 10px, auto, auto, 99);
    width: 40px;
    height: 100%;
    opacity: 0;
    transform: translate3d(100px, 0, 0);
    transition: 0.3s;
  }
}

.brightness-open:hover {
  box-shadow: 0 0 10px #cccccc;
}

.brightness-wrapper {
  @include pos-absolute(0, 55px, 0, 10px, 98);
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 0 15px #e7e7e7;
  transform: translate3d(-200px, 0, 0);
  opacity: 0;
  transition: 0.5s cubic-bezier(0.42, 0, 0.58, 1.4);
}

.brightness-slider {
  box-sizing: border-box;
  padding: 2px 55px 2px 50px;
  line-height: 1;
  position: relative;
}

.brightness-slider-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
}

.brightness-slider-text {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  font-size: 12px;
  color: #666666;
}
</style>