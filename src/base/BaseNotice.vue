<!--
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-16 17:26:28
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-28 16:40:26
-->
<template>
  <p class="base-notice">
    <span class="base-notice__title">Note:&nbsp;</span>
    <slot />
  </p>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.base-notice {
  font-size: 14px;
  color: #333333;
  line-height: 1.2;
  margin-bottom: 0;
  position: relative;
  text-align: center;
}
.base-notice__title {
  color: #e02433;
  font-weight: 600;
}
</style>
