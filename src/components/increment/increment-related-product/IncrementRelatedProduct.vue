<!--
 * @Description: 关联产品
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-25 16:36:22
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-11-01 16:14:57
-->
<template>
  <div class="increment-wrapper">
    <div class="increment-blank" @click="handleClose"></div>

    <div class="increment-related-product">
      
      <span class="close-icon">
        <base-icon icon="close" @click="handleClose" />
      </span>
      
      <!-- 单个产品 -->
      <product-single
        v-if="data.length === 1"
        :data="data[0]"
        :checkedList="checkedList"
        @next="handleNext"
      ></product-single>

      <!-- 多个产品 -->
      <product-multiple
        v-else-if="data.length > 1"
        :list="data"
        :checkedList="checkedList"
        @next="handleNext"
      ></product-multiple>

      <!-- 没有产品 -->
      <p v-else>empty</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import ProductSingle from "./ProductSingle.vue";
import ProductMultiple from "./ProductMultiple.vue";
import BaseIcon from "../../../base/BaseIcon.vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["change", "close", "next"]);

// 已选产品
const checkedList = ref(props.data && props.data.length > 1 ? [props.data[0].id] : []);

// 勾选内容变化时出发修改函数
watch(
  checkedList,
  (val) => {
    emit("change", val);
  },
  { deep: true }
);

// 关闭
function handleClose() {
  emit("close");
}

// 前往下一步
function handleNext() {
  emit("next");
}
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.increment-wrapper {
  @include pos-absolute(0, 0, 0, 0, 1000);
  .increment-blank {
    @include glass;
    @include pos-absolute(0, 0, 0, 0, 1001);
    cursor: pointer;
  }

  .increment-related-product {
    @include pos-absolute(auto, 0, 0, 0, 1002);
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;

    .close-icon {
      @include pos-absolute(20px, auto, auto, 20px, 1004);
      cursor: pointer;
    }
  }
}
</style>