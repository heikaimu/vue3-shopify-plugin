<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-20 10:41:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-21 10:56:46
-->
<template>
  <div class="color-selector-wrapper">
    <p class="color-title">{{ pluginText.skin_color }}:</p>
    <nav class="color-selector">
      <p
        v-for="(item, index) in skinList"
        :id="`menu_skin_${item.name}`"
        class="color-item"
        :class="{ active: item.name === skin }"
        :key="index"
        :style="{ backgroundColor: `${item.color}` }"
        @click="handleChangeSkin(item)"
      >
        <base-icon icon="check" :size="16" color="#ff533a"></base-icon>
      </p>
    </nav>
  </div>
</template>

<script>
import { ref, inject } from "vue";

import BaseIcon from "../../../../base/BaseIcon.vue";
const SKIN_OPTIONS = [
  {
    name: "white",
    color: "#faebd5",
  },
  {
    name: "black",
    color: "#986e59",
  },
  {
    name: "yellow",
    color: "#f7d8aa",
  },
];
export default {
  components: {
    BaseIcon,
  },

  props: {
    skin: {
      type: String,
      deafult: "",
    },
  },

  emits: {
    change: null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    const skinList = ref(SKIN_OPTIONS);

    // 修改肤色
    function handleChangeSkin(item) {
      context.emit("change", item.name);
    }

    return {
      pluginText,
      skinList,
      handleChangeSkin,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.color-selector-wrapper {
  @include flex-row-center;
  height: 50px;
}

.color-selector-wrapper .color-title {
  font-size: 12px;
  font-weight: 600;
  color: $title-color;
  line-height: 1.2;
  margin-bottom: 0;
  padding-right: 10px;
}

.color-selector-wrapper .color-selector {
  display: flex;
  flex-wrap: wrap;
}

.color-selector-wrapper .color-selector .color-item {
  width: 50px;
  height: 30px;
  border-radius: 4px;
  border: 2px solid #fff;
  font-size: 12px;
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  margin-bottom: 0;
  margin-right: 5px;
}

.color-selector-wrapper .color-selector .color-item svg {
  fill: $theme-color;
  display: none;
}

.color-selector-wrapper .color-selector .color-item.active {
  border: 2px solid $theme-color;
}

.color-selector-wrapper .color-selector .color-item.active svg {
  display: block;
}
</style>