<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-20 10:41:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-20 11:06:26
-->
<template>
  <div class="color-selector-wrapper">
    <p class="color-title">Skin Color:</p>
    <nav class="color-selector">
      <p
        v-for="(item, index) in list"
        class="color-item"
        :class="{ active: item.name === skin }"
        :key="index"
        :style="{ backgroundColor: `${item.color}` }"
        @click="handleChangeColor(item)"
      >
        <base-icon icon="check" :size="16" color="#ff533a"></base-icon>
      </p>
    </nav>
  </div>
</template>

<script>
import BaseIcon from "../../components/BaseIcon.vue";

export default {
  components: {
    BaseIcon,
  },

  props: {
    list: {
      type: Array,
      deafult: () => [],
    },
    skin: {
      type: String,
      deafult: ''
    }
  },

  emits: {
    change: null,
  },

  setup(props, context) {

    // 修改肤色
    function handleChangeColor(item) {
      context.emit('change', item.name);
    }
    
    return {
      handleChangeColor
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