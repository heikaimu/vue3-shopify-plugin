<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-29 14:15:45
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-19 12:15:13
-->
<template>
  <base-row :gutter="10">
    <base-col
      :span="12"
      v-for="(item, index) in data"
      :key="index"
      class="body-card-row"
    >
      <background-card
        :data="item"
        :active="index === activeIndex"
        v-bind="$attrs"
        @cardSelect="data => handleCardSelect(data, index, item)"
      ></background-card>
    </base-col>
  </base-row>
</template>

<script>
import { inject, computed } from "vue";
import BackgroundCard from "./BackgroundCard.vue";
import BaseRow from "../../../base/BaseRow.vue";
import BaseCol from "../../../base/BaseCol.vue";

export default {
  components: {
    BackgroundCard,
    BaseRow,
    BaseCol,
  },

  props: {
    data: {
      type: Array,
      default: () => [],
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
  },

  emits: {
    cardSelect: null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    function handleCardSelect(data, index, item) {
      context.emit("cardSelect", data, index, item);
    }

    return {
      pluginText,
      handleCardSelect,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";
.body-card-row {
  margin-bottom: 10px;
}
</style>