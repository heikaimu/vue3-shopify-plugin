<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-24 13:15:20
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-27 13:36:05
-->
<template>
  <div class="query-operations">
    <div class="query-open">
      <svg
        v-if="!active"
        viewBox="0 0 24 24"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
        class="style-scope yt-icon"
        style="pointer-events: none; display: block; width: 100%; height: 100%"
      >
        <g class="style-scope yt-icon">
          <path
            d="M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z"
            class="style-scope yt-icon"
          ></path>
        </g>
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
        class="style-scope yt-icon"
        style="pointer-events: none; display: block; width: 100%; height: 100%"
      >
        <g class="style-scope yt-icon">
          <path
            d="M15,17h6v2h-6V17z M11,17H3v2h8v2h2v-6h-2V17z M14,9h2V3h-2v2H3v2h11V9z M18,5v2h3V5H18z M6,15h2V9H6v2H3v2h3V15z M10,13h11 v-2H10V13z"
            class="style-scope yt-icon"
          ></path>
        </g>
      </svg>
    </div>
    <!-- <p class="text">Filter</p> -->
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";
.query-operations {
  @include flex-row-center;
  cursor: pointer;
  .query-open {
    width: 30px;
    height: 30px;
  }
  .text {
    font-size: 14px;
    color: #333333;
    font-weight: 600;
  }
}
</style>