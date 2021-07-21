<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 10:15:02
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-19 10:38:05
-->
<template>
  <div class="base-col" :style="colStyle">
    <slot />
  </div>
</template>

<script>
import { inject, computed } from "vue";

export default {
  name: "BaseCol",

  props: {
    span: {
      type: Number,
      deafult: 24,
    },
  },

  setup(props) {
    const gutter = inject("gutter");
    const colStyle = computed(() => {
      return {
        paddingLeft: `${gutter / 2}px`,
        paddingRight: `${gutter / 2}px`,
        width: `${(props.span / 24) * 100}%`,
      };
    });

    return {
      colStyle,
    };
  },
};
</script>

<style lang="scss" scoped>
.base-col {
  box-sizing: border-box;
}
</style>