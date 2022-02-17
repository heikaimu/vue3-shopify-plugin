<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-28 13:53:52
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-13 14:42:16
-->
<template>
  <transition name="slide-bottom-fade">
    <div class="glass-dialog" v-if="visible">
      <div class="dialog__blank" @click="handleClose"></div>
      <div class="dialog__content">
        <div class="close-wrapper" v-if="closeable">
          <div class="button--close" @click="handleClose">
            <base-icon icon="close" ></base-icon>
          </div>
        </div>
        <div class="content-wrapper">
          <p v-if="title" class="title">{{title}}</p>
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {watch} from "vue";
import BaseIcon from "./BaseIcon.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  closeable: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: ""
  }
});

const emits = defineEmits({
  close: null,
  "opened": null,
  "update:visible": null,
});

watch(() => props.visible, (val) => {
  if (val) {
    setTimeout(() => {
      emits('opened');
    }, 400);
  } else {
    setTimeout(() => {
      emits('closed');
    }, 200);
  }
});

// 关闭
function handleClose() {
  emits("close");
  emits("update:visible", false);
}
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.glass-dialog {
  @include pos-absolute(0, 0, 0, 0, 9996);
  .dialog__blank {
    @include pos-absolute(0, 0, 0, 0, 9997);
    @include glass;
  }
  .dialog__content {
    @include pos-absolute(auto, 0, 0, 0, 9998);
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;
    .close-wrapper {
      padding: 20px 20px 0 20px;
      .button--close {
        @include flex-row-center;
        width: 30px;
        height: 30px;
        cursor: pointer;
      }
    }
    .content-wrapper {
      .title {
        padding: 10px;
        font-size: 14px;
        text-align: center;
      }
    }
  }
}

.slide-bottom-fade-enter-from,
.slide-bottom-fade-leave-to {
  transform: translate3d(0, -30px, 0);
  opacity: 0;
}
.slide-bottom-fade-leave-from,
.slide-bottom-fade-enter-to {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.slide-bottom-fade-enter-active {
  transition: all 0.3s ease-in-out;
}
.slide-bottom-fade-leave-active {
  transition: all 0.1s ease;
}
</style>