<!--
 * @Description: 关联产品
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-25 16:36:22
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-28 17:19:59
-->
<template>
  <base-glass-dialog :visible="true" @close="handleClose">
    <div class="increment-related-product">
      <!-- 单个产品 -->
      <product-single
        v-if="data.length === 1"
        :data="data[0]"
        :checkedList="checkedList"
        :dollarSign="dollarSign"
        @next="handleNext"
      ></product-single>

      <!-- 多个产品 -->
      <product-multiple
        v-else-if="data.length > 1"
        :list="data"
        :checkedList="checkedList"
        :dollarSign="dollarSign"
        @next="handleNext"
      ></product-multiple>

      <!-- 没有产品 -->
      <p v-else>empty</p>
    </div>
  </base-glass-dialog>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import ProductSingle from "./ProductSingle.vue";
import ProductMultiple from "./ProductMultiple.vue";
import BaseIcon from "../../../base/BaseIcon.vue";
import BaseGlassDialog from "../../../base/BaseGlassDialog.vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  dollarSign: {
    type: String,
  },
});

const emit = defineEmits(["change", "close", "next"]);

// 已选产品
const checkedList = ref(
  props.data && props.data.length > 1 ? [props.data[0].id] : []
);

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
  emit("change", checkedList.value);
  emit("next");
}
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";
</style>