<!--
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-16 14:28:55
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-28 16:38:46
-->
<template>
  <div class="base-header">
    <div
      class="base-header__close"
      @click="$emit('close')"
      id="icon_header_close"
    >
      <base-icon :icon="icon" />
    </div>
    <div class="base-header__title" :class="{ center: center }">
      <p class="main-text">{{ mainText }}</p>
      <p class="sub-text">{{ subText }}</p>
    </div>
    <div class="slot-wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup>
import BaseIcon from "./BaseIcon.vue";

const props = defineProps({
  mainText: {
    type: String,
    default: "",
  },
  subText: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "close",
  },
  center: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.base-header {
  height: 50px;
  background-color: #ffffff;
  position: relative;
  border-bottom: 1px solid #f2f2f2;
}

.base-header__close {
  @include flex-row-center;
  @include pos-absolute(0, auto, 0, 10px);
  width: 40px;
  color: #666666;
  cursor: pointer;
  transition: 0.3s;
}

.base-header__title {
  @include pos-absolute(0, 0, 0, 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;

  &.center {
    @include pos-absolute(0, 60px, 0, 60px);
    align-items: center;
  }

  .main-text {
    @include omits(1);
    font-size: 16px;
    font-weight: 700;
    color: #333333;
    line-height: 1.3;
    margin-bottom: 0;
  }

  .sub-text {
    @include omits(1);
    font-size: 12px;
    color: #a1a1a1;
    line-height: 1.3;
  }
}

.slot-wrapper {
  position: absolute;
  left: 50px;
  top: 0;
  right: 10px;
  bottom: 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
</style>
