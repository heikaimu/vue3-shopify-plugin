<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-28 10:13:55
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-30 10:33:24
-->
<template>
  <ul class="color__list">
    <li v-for="(item, index) in list" :key="index" class="color__item">
      <p
        class="color__text"
        :class="{ active: item.value === value }"
        :style="{ backgroundColor: item.value }"
        @click="handleClick(item.value)"
      >
        <base-icon
          v-if="item.value === value"
          icon="check"
          color="#ff533a"
          :size="14"
        ></base-icon>
      </p>
    </li>
  </ul>
</template>

<script>
import { reactive, toRefs, watch } from "vue";

import BaseIcon from "../../../base/BaseIcon.vue";

export default {
  components: {
    BaseIcon,
  },

  props: {
    color: {
      type: String,
      default: "",
    },
  },

  setup(props, context) {
    const state = reactive({
      list: [
        { label: "White", value: "#ffffff" },
        { label: "Black", value: "#111111" },
        { label: "Pink", value: "#D92FBB" },
        { label: "Green", value: "#0FDA16" },
        { label: "Purple", value: "#760360" },
        { label: "Golden", value: "#5D4A0C" },
        { label: "Silver", value: "#606060" },
        { label: "Red", value: "#B51506" },
        { label: "Blue", value: "#057ABC" },
        { label: "Lakeblue", value: "#067D97" },
      ],
      value: "",
    });

    watch(
      () => props.color,
      (val) => {
        state.value = val;
      },
      { immediate: true }
    );

    function handleClick(val) {
      state.value = val;
      context.emit("update:color", val);
    }

    return {
      ...toRefs(state),
      handleClick,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.color__list {
  display: flex;
  flex-wrap: wrap;
  margin-left: -4px;
  margin-right: -4px;
  .color__item {
    flex: 1;
    box-sizing: border-box;
    padding: 4px;
    .color__text {
      @include flex-row-center;
      height: 30px;
      border-radius: 4px;
      border: 1px solid #f2f2f2;
      cursor: pointer;
      &.active {
        border: 1px solid #ff533a;
      }
    }
  }
}
</style>