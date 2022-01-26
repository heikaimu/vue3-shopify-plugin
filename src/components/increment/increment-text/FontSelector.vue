<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-28 10:13:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-01-26 14:47:19
-->
<template>
  <ul class="font__list">
    <li v-for="(item, index) in list" :key="index" class="font__item">
      <p
        class="font__text"
        :class="{ active: item.value === value }"
        :style="{ fontFamily: item.value }"
        @click="handleClick(item.value)"
      >
        Font
      </p>
    </li>
  </ul>
</template>

<script>
import { reactive, toRefs, watch } from "vue";

export default {
  props: {
    fontFamily: {
      type: String,
      default: "",
    },
  },

  setup(props, context) {
    const state = reactive({
      list: [
        // {
        //   value: "Black Ops One",
        //   label: "Black Ops One",
        // },
        {
          value: "Ceviche One",
          label: "Ceviche One",
        },
        // {
        //   value: "Creepster",
        //   label: "Creepster",
        // },
        {
          value: "Lobster",
          label: "Lobster",
        },
        {
          value: "Satisfy",
          label: "Satisfy",
        },
        {
          value: "Kaushan Script",
          label: "Kaushan Script",
        },
        {
          value: "Dancing Script",
          label: "Dancing Script",
        },
      ],
      value: "",
    });

    watch(
      () => props.fontFamily,
      (val) => {
        state.value = val;
      },
      { immediate: true }
    );

    function handleClick(val) {
      state.value = val;
      context.emit("update:fontFamily", val);
    }

    return {
      ...toRefs(state),
      handleClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.font__list {
  display: flex;
  flex-wrap: wrap;
  margin-left: -4px;
  margin-right: -4px;
  .font__item {
    flex: 1;
    box-sizing: border-box;
    padding: 4px;
    .font__text {
      padding: 5px 0;
      border-radius: 4px;
      border: 1px solid #f2f2f2;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #ff533a;
        border: 1px solid #ff533a;
      }
    }
  }
}
</style>