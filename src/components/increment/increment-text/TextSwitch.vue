<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-28 10:26:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-29 11:02:48
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
      {{ index === 0 ? `${item.label} +$${price}` : item.label }}
    </p>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from "vue";

export default {
  props: {
    activeValue: {
      type: String,
      default: "",
    },
    price: {
      type: [Number, String]
    }
  },

  setup(props, context) {
    const state = reactive({
      list: [
        {
          label: "Yes, please",
          value: "yes",
        },
        {
          label: "No, thanks",
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