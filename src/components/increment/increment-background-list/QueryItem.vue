<template>
  <div class="query-item-container" v-if="data.length > 1">
    <p class="query-title">{{ title }}</p>
    <ul class="query-key-list">
      <li class="item" v-for="(item, index) in data" :key="index">
        <div
          class="card"
          :class="{ active: index === activeIndex }"
          @click="handleClick(index)"
        >
          {{ cardLabel(item) }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getValue } from "../../../utils/object";
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    activeIndex: {
      type: Number,
      default: -1,
    },
    title: {
      type: String,
      default: "",
    },
    selector: {
      type: String,
      default: null,
    },
  },

  emits: {
    change: null,
  },

  setup(props, context) {
    function handleClick(index) {
      context.emit("change", index);
    }

    function cardLabel(item) {
      if (!props.selector) {
        return item;
      }

      return getValue(item, props.selector)[0];
    }

    return {
      cardLabel,
      handleClick,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.query-item-container {
  padding: 10px 0;
  border-bottom: 1px dashed #e7e7e7;
  .query-title {
    margin-bottom: 0;
    padding-bottom: 10px;
    line-height: 2;
    font-weight: 600;
    font-size: 14px;
    color: #666666;
    @include flex-row-center;
    &::after {
      content: "";
      display: block;
      flex: 1;
      height: 1px;
      border-bottom: 1px solid currentColor;
      margin-left: 10px;
      opacity: 0.3;
    }
    &::before {
      content: "";
      display: block;
      flex: 1;
      height: 1px;
      border-bottom: 1px solid currentColor;
      margin-right: 10px;
      opacity: 0.3;
    }
  }

  .query-key-list {
    display: flex;
    flex-wrap: wrap;
    .item {
      margin-right: 10px;
      margin-bottom: 10px;
      .card {
        padding: 0 20px;
        border-radius: 17px;
        background-color: #f2f2f2;
        cursor: pointer;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        color: $context-color;
        font-weight: 600;
        &.active {
          background-color: $theme-color;
          color: #ffffff;
        }
      }
    }
  }
}
</style>