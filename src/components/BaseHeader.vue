<!--
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-16 14:28:55
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-20 10:47:11
-->
<template>
  <div class="base-header">
    <div class="base-header__close" @click="$emit('close')">
      <base-icon :icon="icon" />
    </div>
    <div class="base-header__title center">
      <h2 class="main-text">{{ mainText }}</h2>
      <p class="sub-text">{{ subText }}</p>
    </div>
    <div class="slot-wrapper">
      <slot />
    </div>
  </div>
</template>

<script>
import BaseIcon from "./BaseIcon.vue";

export default {
  name: "BaseHeader",

  components: {
    BaseIcon,
  },

  props: {
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
  },
};
</script>

<style lang="scss" scoped>
.base-header {
  height: 50px;
  background-color: #ffffff;
  position: relative;
  border-bottom: 1px solid #f2f2f2;
}

.base-header__close {
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666666;
  cursor: pointer;
  transition: 0.3s;
}

.base-header__title {
  position: absolute;
  left: 50px;
  top: 0;
  right: 50px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &.center {
    align-items: center;
  }

  .main-text {
    font-size: 16px;
    color: #333333;
    line-height: 1.3;
  }

  .sub-text {
    font-size: 12px;
    color: #666666;
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
