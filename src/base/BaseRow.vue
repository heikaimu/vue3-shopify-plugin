<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 10:15:02
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-28 16:40:59
-->
<template>
  <div class="base-row" :style="rowStyle">
    <slot />
  </div>
</template>

<script setup>
import { computed, provide } from "vue";

const props = defineProps({
  gutter: {
    type: Number,
    default: 0,
  },
});

const { gutter } = props;

provide("gutter", gutter);

const rowStyle = computed(() => {
  return {
    marginLeft: `${-gutter / 2}px`,
    marginRight: `${-gutter / 2}px`,
  };
});
</script>

<style lang="scss" scoped>
.base-row {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
}
</style>