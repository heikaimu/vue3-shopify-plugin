<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-11-01 10:45:12
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-21 10:32:41
-->
<template>
  <div>
    <div class="product-wrapper">
      <div class="single-product-card">
        <img class="single-product__img" :src="data.url" alt="" srcset="" />
        <p class="single-product__title">
          {{ data.title }}
        </p>
        <p class="single-product__price">+ {{ dollarSign }}{{ data.price }}</p>
      </div>
    </div>

    <div class="add-to-cart">
      <base-confirm-button-group
        :confirmText="pluginText.yes_add_cart"
        :cancelText="pluginText.no_add_cart"
        @confirm="handleSave(true)"
        @cancel="handleSave(false)"
      ></base-confirm-button-group>
    </div>
  </div>
</template>

<script setup>
import { nextTick, inject } from "vue";
import BaseConfirmButtonGroup from "../../../base/BaseConfirmButtonGroup.vue";
import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  checkedList: {
    type: Array,
    default: () => [],
  },
  dollarSign: {
    type: String,
  },
});

const emit = defineEmits(["next", "change"]);

// 国际化
const pluginText = inject("pluginText");

async function handleSave(flag) {
  if (flag) {
    addID(props.data.id);
  } else {
    removeID(props.data.id);
  }
  await nextTick();
  emit("next");
}

// 是否有该ID
function hasID(newID) {
  return props.checkedList.find((id) => id === newID);
}

// 添加ID
function addID(newID) {
  if (hasID(newID)) {
    return;
  }

  props.checkedList.push(newID);
}

// 删除ID
function removeID(newID) {
  const index = props.checkedList.findIndex((id) => id === newID);
  if (index === -1) {
    return;
  }

  props.checkedList.splice(index, 1);
}
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.product-wrapper {
  .single-product-card {
    width: 100%;
    @include flex-col-center;
    .single-product__img {
      @include card-shadow-lg;
      display: block;
      width: 240px;
      height: 240px;
      padding: 2px;
      background: #fff;
      border-radius: 10px;
    }
    .single-product__title {
      padding: 20px 20px 10px 20px;
      font-size: 16px;
      line-height: 1.6;
      color: $title-color;
      text-align: center;
      margin-bottom: 0;
    }
    .single-product__price {
      font-size: 16px;
      color: $theme-color;
      font-weight: 600;
    }
  }
}
.add-to-cart {
  padding: 20px;
}
</style>