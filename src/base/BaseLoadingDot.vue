<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-30 10:44:39
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-28 16:40:17
-->
<template>
  <div class="dot-loading">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.dot-loading {
  width: 100px;
  height: 10px;
  display: flex;
}

.dot-loading span {
  display: block;
  width: 10px;
  height: 100%;
  margin: 0 5px;
  border-radius: 50%;
  background: $theme-color;
  animation: load 1.04s ease infinite;
}

@-webkit-keyframes load {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.dot-loading span:nth-child(1) {
  -webkit-animation-delay: 0.13s;
}

.dot-loading span:nth-child(2) {
  -webkit-animation-delay: 0.26s;
}

.dot-loading span:nth-child(3) {
  -webkit-animation-delay: 0.39s;
}

.dot-loading span:nth-child(4) {
  -webkit-animation-delay: 0.52s;
}

.dot-loading span:nth-child(5) {
  -webkit-animation-delay: 0.65s;
}
</style>