<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 17:23:05
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-21 17:36:11
-->
<template>
  <div class="brightness-bar">
dwad
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  setup () {
    const state = reactive({
      count: 0,
    })
  
    return {
      ...toRefs(state),
    }
  }
}
</script>

<style lang="scss" scoped>
.brightness-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  height: 80px;
  background-color: #f2f2f2;
}
</style>