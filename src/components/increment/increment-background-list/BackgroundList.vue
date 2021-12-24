<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-29 14:15:45
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-24 09:58:26
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
    change: null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    return {
      pluginText,
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