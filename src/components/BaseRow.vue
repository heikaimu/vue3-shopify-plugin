<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 10:15:02
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-19 10:40:43
-->
<template>
  <div class="base-row" :style="rowStyle">
    <slot />
  </div>
</template>

<script>
import { computed, provide } from "vue";

export default {
  name: "BaseRow",

  props: {
    gutter: {
      type: Number,
      default: 0,
    },
  },

  setup(props) {
    const { gutter } = props;
    provide("gutter", gutter);

    const rowStyle = computed(() => {
      return {
        marginLeft: `${-gutter / 2}px`,
        marginRight: `${-gutter / 2}px`,
      };
    });

    return {
      rowStyle,
    };
  },
};
</script>

<style lang="scss" scoped>
.base-row {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
}
</style>