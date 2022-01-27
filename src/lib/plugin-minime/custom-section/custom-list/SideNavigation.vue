<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 16:31:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-01-27 10:12:22
-->
<template>
  <div class="anchor">
    <ul class="anchor__list">
      <li
        :id="getID(item)"
        class="anchor__item"
        :class="{ active: item.name === value }"
        v-for="item in list"
        :key="item.name"
        @click="handleClick(item)"
      >
        <p class="anchor__text">
          {{ item.name }} <span class="anchor__num">{{ item.count }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      deafult: () => [],
    },
    value: {
      type: String,
      deafult: "",
    },
  },

  emits: {
    change: null,
  },

  setup(props, context) {
    function handleClick(item) {
      context.emit("change", item.name);
    }

    function getID(item) {
      const name = item.name.toLowerCase().replace(/\s+/g, '_');
      return `menu_group_${name}`;
    }

    return {
      handleClick,
      getID
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.anchor {
}

.anchor__list {
}

.anchor__item {
  border-bottom: 1px dashed #f2f2f2;
  position: relative;
  margin-bottom: 5px;

  &.active {
    .anchor__text {
      border-top: 1px solid $theme-color;
      border-right: 1px solid $theme-color;
      border-bottom: 1px solid $theme-color;
      box-shadow: 0 3px 3px -2px rgba(255, 83, 58, 0.6),
        3px 3px 4px rgba(255, 83, 58, 0.5), 0 1px 8px rgba(255, 83, 58, 0.4);
      color: $theme-color;
      font-weight: 600;
      .anchor__num {
        color: currentColor;
      }
    }
  }
}

.anchor__text {
  @include flex-row-center;
  text-align: center;
  padding: 8px 10px 20px 5px;
  border-radius: 0 4px 4px 0;
  background-color: #ffffff;
  border-top: 1px solid #ffffff;
  border-right: 1px solid #ffffff;
  border-bottom: 1px solid #ffffff;
  font-size: 12px;
  line-height: 1.2;
  color: $title-color;
  cursor: pointer;
  position: relative;
}

.anchor__num {
  @include flex-col-center;
  @include pos-absolute(auto, 10px, 4px, 4px);
  font-size: 12px;
  font-weight: 400;
  color: $context-color;
  opacity: 0.6;
  transform: scale(0.8);
}
</style>