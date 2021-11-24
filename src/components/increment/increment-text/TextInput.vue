<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-28 10:16:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-11-24 14:04:30
-->
<template>
  <!-- 输入框 -->
  <div class="input-wrapper">
    <p class="text-length">
      {{ pluginText.text_title }} {{ text.length }} | {{ size }}
    </p>
    <input
      type="text"
      class="text-input"
      :maxlength="size"
      placeholder="custom text"
      v-model="value"
      @input="handleInput"
    />
  </div>
</template>

<script>
import { reactive, toRefs, watch, inject } from "vue";

export default {
  props: {
    text: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "15",
    },
  },

  setup(props, context) {
    const state = reactive({
      value: "",
    });

    // 国际化
    const pluginText = inject("pluginText");

    watch(
      () => props.text,
      (val) => {
        state.value = val;
      },
      { immediate: true }
    );

    // 输入
    function handleInput() {
      context.emit("update:text", state.value);
    }

    return {
      ...toRefs(state),
      pluginText,
      handleInput,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.input-wrapper {
  // @include flex-row-sb;
  position: relative;
  margin-top: 20px;
  .text-input {
    padding: 0 10px;
    width: 100%;
    height: 40px;
    border: 1px solid #cccccc;
    border-radius: 4px;
    font-size: 14px;
    color: $context-color;
    outline: none;
    -webkit-appearance: none;
  }
  .text-length {
    @include pos-absolute(50%, 10px, auto, auto);
    transform: translate3d(0, -50%, 0);
    font-size: 12px;
    color: $sub-theme-color;
    font-weight: 600;
  }
  .clear {
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-align: right;
    &:hover {
      color: $sub-theme-color;
    }
  }
}
</style>