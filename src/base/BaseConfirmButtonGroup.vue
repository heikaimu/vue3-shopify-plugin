<template>
  <div class="confirm-buttons">
    <div class="item">
      <base-button
        type="primary"
        size="large"
        @click="handleConfirm"
        id="button_add_to_cart_7"
        >{{ confirmText }}</base-button
      >
    </div>
    <div class="item">
      <div class="divider">
        <span class="text">{{ pluginText.or }}</span>
      </div>
    </div>
    <div class="item">
      <base-button
        type="primary"
        size="large"
        plain
        @click="handleCancel"
        id="button_add_to_cart_8"
        >{{ cancelText }}</base-button
      >
    </div>
  </div>
</template>

<script>
import { inject } from "vue";
import BaseButton from "./BaseButton.vue";

export default {
  name: "ConfirmButtons",

  components: {
    BaseButton,
  },

  props: {
    confirmText: {
      type: String,
      default: "",
    },
    cancelText: {
      type: String,
      default: "",
    },
  },

  emits: {
    confirm: null,
    cancel: null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    function handleConfirm() {
      context.emit("confirm");
    }

    function handleCancel() {
      context.emit("cancel");
    }

    return {
      pluginText,
      handleConfirm,
      handleCancel,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";
.confirm-buttons {
  .item {
    & + .item {
      margin-top: 10px;
    }
    .divider {
      @include flex-row-center;
      width: 100%;
      .text {
        @include flex-row-center;
        font-size: 14px;
        font-weight: 600;
        color: $context-color;
        &::after,
        &::before {
          display: block;
          content: "";
          width: 60px;
          height: 1px;
          background-color: currentColor;
          margin: 0 5px;
        }
      }
    }
  }
}
</style>