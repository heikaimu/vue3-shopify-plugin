<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 10:49:23
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-20 14:02:31
-->
<template>
  <div class="base-card" @click.stop="handleClick">
    <div class="base-card__img-box">
      <div class="base-card__img">
        <img :src="src" alt="" srcset="" width="100" />
      </div>
    </div>
    <p class="base-card__title">{{ title }}</p>
    <div class="base-card__close" @click.stop="handleClose">
      <span class="icon">x</span>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    src: {
      type: String,
      deafult: "",
    },
    title: {
      type: String,
      deafult: "",
    },
    closeable: {
      type: Boolean,
      deafult: false
    }
  },

  emits: {
    click: null,
    close: null,
  },

  setup(props, context) {
    function handleClick() {
      context.emit("click");
    }

    function handleClose() {
      context.emit("close");
    }

    return {
      handleClick,
      handleClose,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.base-card {
  cursor: pointer;
  position: relative;
  &:active {
    .base-card__img-box {
      box-shadow: 0 0 5px #e7e7e7;
    }
  }
}
.base-card__img-box {
  box-sizing: content-box;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 6px;
  position: relative;
  background-color: #ffffff;
  .base-card__img {
    box-sizing: border-box;
    padding: 10px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
.base-card__title {
  padding: 0.6em 0;
  font-size: 0.8em;
  color: #333333;
  text-align: center;
}
.base-card__close {
  padding: 6px;
  position: absolute;
  right: -5px;
  top: -5px;

  &:hover {
    .icon {
      opacity: 1;
    }
  }

  .icon {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #e02433;
    opacity: 0.6;
    font-size: 12px;
    color: #ffffff;
    text-align: center;
    line-height: 14px;
    transition: 0.3s;
  }
}
</style>