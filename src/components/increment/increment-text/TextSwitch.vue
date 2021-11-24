<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-28 10:26:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-11-24 10:22:06
-->
<template>
  <!-- 开关 -->
  <div class="text-switch">
    <p
      v-for="(item,index) in list"
      :id="`button_add_text_${item.value}`"
      :key="index"
      class="switch__text"
      :class="{ active: item.value === value }"
      @click="handleSwitch(item.value)"
    >
      {{ index === 0 ? `${item.label} +${dollarSign}${price}` : item.label }}
    </p>
  </div>
</template>

<script>
import { reactive, toRefs, watch, inject } from "vue";

export default {
  props: {
    activeValue: {
      type: String,
      default: "",
    },
    price: {
      type: [Number, String]
    },
    dollarSign: {
      type: String
    }
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");
    
    const state = reactive({
      list: [
        {
          label: pluginText.yes_please,
          value: "yes",
        },
        {
          label: pluginText.no_thanks,
          value: "no",
        },
      ],
      value: "no",
    });

    watch(
      () => props.activeValue,
      (val) => {
        state.value = val;
      },
      { immediate: true }
    );

    function handleSwitch(val) {
      state.value = val;
      context.emit("update:activeValue", val);
    }

    return {
      ...toRefs(state),
      pluginText,
      handleSwitch,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.text-switch {
  display: flex;
  .switch__text {
    @include flex-row-center;
    padding: 0 10px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid #cccccc;
    margin-bottom: 0;
    font-size: 12px;
    color: $context-color;
    margin-right: 10px;
    cursor: pointer;
    &.active {
      font-weight: 600;
      color: $theme-color;
      border: 1px solid $theme-color;
    }
  }
}
</style>