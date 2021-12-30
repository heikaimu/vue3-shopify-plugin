<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-30 14:05:13
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-30 14:37:50
-->
<template>
    <ul class="base-button-radio__list">
      <li class="base-button-radio__item" v-for="(item, index) in options" :key="index">
        <div class="base-button-radio__card" :class="{ active: item.value === value }" @click="handleChange(item.value)">

          <div class="img-box" v-if="item.url">
            <img class="img" :src="item.url" alt=""/>
          </div>

          <span class="text" :style="{textAlign:textAlign}">{{ item.label }}</span>

          <span class="price" v-if="item.price">{{ item.price }}</span>

          <span class="icon" v-if="item.value === value">
            <base-icon icon="check" color="#ff533a" />
          </span>
        </div>
      </li>
    </ul>
</template>

<script setup>
import BaseIcon from "./BaseIcon.vue";

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  value: {
    type: String,
    default: ''
  },
  textAlign: {
    type: String,
    default: 'center'
  }
});

const emits = defineEmits({
  'update:value': null,
  change: null
})

function handleChange(val) {
  emits('update:value', val);
  emits('change', val);
}
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";
.base-button-radio__list {
  padding-bottom: 10px;
  .base-button-radio__item {
    padding-bottom: 10px;
    .base-button-radio__card {
      @include flex-row-sb;
      width: 100%;
      padding: 5px;
      border-radius: 6px;
      box-shadow: 0 0 0 1px $theme-color;
      cursor: pointer;
      position: relative;
      & + .slides-selector__item {
        margin-top: 15px;
      }

      .img-box {
        width: 50px;
        height: 50px;
        flex: 0 0 50px;
        border-radius: 4px;
        overflow: hidden;
        .img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .text {
        flex: 1;
        box-sizing: border-box;
        padding-left: 10px;
        font-size: 16px;
        color: $theme-color;
        line-height: 50px;
      }
      .price {
        @include pos-absolute(-13px, auto, auto, 50%);
        transform: translateX(-50%);
        font-size: 12px;
        font-weight: 700;
        padding: 5px 10px;
        color: $theme-color;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 0 0 1px $theme-color;
      }
      .icon {
        @include pos-absolute(50%, 20px, auto, auto);
        transform: translate3d(0, -50%, 0);
      }

      &.active {
        background-color: rgba(255, 83, 58, 0.1);
        box-shadow: 0 0 0 2px $theme-color;
        .text {
          font-weight: 600;
        }
      }
    }
  }
}
</style>