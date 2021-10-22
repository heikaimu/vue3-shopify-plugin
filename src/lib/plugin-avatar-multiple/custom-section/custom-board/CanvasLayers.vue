<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-26 09:47:20
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-20 15:29:10
-->
<template>
  <div class="canvas-layer">
    <div
      v-for="(item, index) in list"
      class="layer-img"
      :class="{active:activeID===item.id}"
      :key="index"
      @click="handleClick(item, index)"
    >
      <img :src="item.url" alt="" />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

export default {

  props: {
    list: {
      type: Array,
      deafult: () => []
    },
    activeID: {
      type: String,
      deafult: ""
    }
  },

  emits: {
    change: null
  },

  setup(props, context) {
    const state = reactive({
      count: 0,
    });

    function handleClick(item, index) {
      context.emit('change', item, index);
    }

    return {
      ...toRefs(state),
      handleClick
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.canvas-layer {
  @include flex-row-center;
  width: 100%;
  height: 60px;
  position: relative;
  top: -20px;
  .layer-img {
    width: 60px;
    height: 60px;
    padding: 5px;
    background-color: #ffffff;
    border-radius: 4px;
    border: 2px solid #e7e7e7;
    margin: 0 5px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    &.active {
      border: 2px solid $theme-color;
    }
  }
}
</style>