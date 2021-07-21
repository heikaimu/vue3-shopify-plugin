<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 17:23:05
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-21 17:59:14
-->
<template>
  <div class="brightness-bar">
    <div class="brightness-button brightness-open">x</div>
    <div class="brightness-button brightness-close">1</div>
    <div class="brightness-wrapper">
      <div class="item">
        <div class="brightness-slider" _key="brightness">
          <span class="brightness-slider-icon">x</span>
          <span class="brightness-slider-text"></span>
          <input type="range" min="0" max="100" step="1" data-rangeslider />
        </div>
      </div>
      <div class="item">
        <div class="brightness-slider" _key="contrast">
          <span class="brightness-slider-icon">2</span>
          <span class="brightness-slider-text"></span>
          <input type="range" min="0" max="100" step="1" data-rangeslider />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

export default {
  setup() {
    const state = reactive({
      count: 0,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.brightness-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  height: 80px;
  background-color: #f2f2f2;
}

.brightness-button {
  @include flex-row-center;
  width: 40px;
  height: 72px;
  background-color: #ffffff;
  box-shadow: 0 0 15px #e7e7e7;
  border-radius: 10px;
  transition: 0.3s;
  cursor: pointer;
  position: absolute;
  right: 0;
  bottom: 0;
}

.brightness-open {
  width: 50px;
  height: 50px;
  right: auto;
  left: -5px;
  bottom: 11px;
  border-radius: 0 25px 25px 0;
  transition: 0.3s;
  transform: translate3d(-100px, 0, 0);
  opacity: 0;
}

.brightness-open.active {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}

.brightness-open svg {
  width: 30px;
  height: 30px;
  fill: goldenrod;
}

.brightness-close {
}

.brightness-close svg {
  width: 16px;
  height: 16px;
  fill: $theme-color;
}

.brightness-open:hover {
  box-shadow: 0 0 10px #cccccc;
}

.brightness-wrapper {
  border-radius: 10px;
  box-sizing: border-box;
  /* border             : 1px solid #e7e7e7; */
  z-index: 3;
  background-color: #ffffff;
  box-shadow: 0 0 15px #e7e7e7;
  /* display            : flex;
    justify-content       : center; */
  transform: translate3d(-400px, 0, 0);
  opacity: 0;
  transition: 0.3s cubic-bezier(0.42, 0, 0.58, 1.4);

  position: absolute;
  left: 0;
  bottom: 0;
  right: 45px;
}

.brightness-wrapper.active {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}

.brightness-wrapper .item {
  /* flex           : 1;
    display        : flex;
    flex-direction : column;
    justify-content: center;
    align-items    : center; */
}

.brightness-wrapper .item .title {
  font-size: 12px;
  color: #333333;
  margin-bottom: 0;
}

/* .brightness-wrapper .operation {}

.brightness-wrapper .operation-menu {
    display         : inline-block;
    padding         : 0 15px;
    height          : 20px;
    border-radius   : 4px;
    text-align      : center;
    line-height     : 20px;
    background-color: var(--theme-color);
    color           : #ffffff;
    margin          : 0 5px;
    cursor          : pointer;
    font-size       : 12px;
} */

.brightness-slider {
  box-sizing: border-box;
  padding: 13px 40px;
  line-height: 1;
  position: relative;
}

.brightness-slider-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
}

.brightness-slider-text {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  font-size: 12px;
  color: #666666;
}
</style>