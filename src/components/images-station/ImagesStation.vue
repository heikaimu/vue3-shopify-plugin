<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-22 16:26:22
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-11 10:49:01
-->
<template>
  <draggable
    :list="list"
    :disabled="!enabled"
    item-key="id"
    class="custom-files__list"
    tag="ul"
    :move="checkMove"
    @start="dragging = true"
    @end="dragging = false"
  >
    <template #item="{ element }">
      <li class="custom-files__item">
        <div class="custom-files__card">
          <div class="custom-files__box">
            <img :src="getSrc(element)" alt="" srcset="" />
          </div>
          <div class="close-icon" v-if="list.length > 1" @click="handleRemove(element)">
            <base-icon icon="close" :size="12" color="#ffffff"></base-icon>
          </div>
        </div>
      </li>
    </template>
    <template #footer>
      <li class="custom-files__item" v-if="list.length < max">
        <div class="custom-files__card" @click="handleOpen">
          <div class="custom-files__box add">
            <span class="plus-icon"></span>
          </div>
        </div>
      </li>
    </template>
  </draggable>
</template>

<script>
import { reactive, toRefs } from "vue";

import draggable from "vuedraggable";
import BaseIcon from "../../base/BaseIcon.vue";

import {getValue} from '../../utils/object';

export default {
  name: "ImagesStation",

  components: {
    draggable,
    BaseIcon,
  },

  props: {
    list: {
      type: Array,
      default: () => [],
    },
    // 最大数量
    max: {
      type: Number,
      default: 5,
    },
    // 图片地址的选择字段
    srcSelector: {
      type: String,
      default: ""
    }
  },

  emits: {
    open: null,
  },

  setup(props, context) {
    const state = reactive({
      enabled: true,
      dragging: false,
    });

    // 获取显示的图片
    function getSrc(form) {
      const res = getValue(form, props.srcSelector);
      return res[0];
    }

    // 删除
    function handleRemove(row) {
      const index = props.list.findIndex(item => item.id === row.id);
      props.list.splice(index, 1);
    }

    // 打开
    function handleOpen() {
      context.emit("open");
    }

    // 移动
    function checkMove() {}

    return {
      ...toRefs(state),
      handleOpen,
      handleRemove,
      checkMove,
      getSrc
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.custom-files__list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .custom-files__item {
    width: 20%;
    position: relative;
    box-sizing: border-box;
    padding: 3px;
    .custom-files__card {
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      position: relative;
      background-color: #ffffff;
      border-radius: 4px;
      overflow: hidden;
      .close-icon {
        @include pos-absolute(0, 0, auto, auto);
        @include flex-row-center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: $sub-theme-color;
        cursor: pointer;
      }
      .custom-files__box {
        @include pos-absolute;
        &.add {
          cursor: pointer;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .plus-icon::after {
          @include pos-absolute(50%, auto, auto, 50%);
          content: "";
          display: block;
          width: 30px;
          height: 4px;
          border-radius: 2px;
          background-color: #e7e7e7;
          transform: translate3d(-50%, -50%, 0);
        }
        .plus-icon::before {
          @include pos-absolute(50%, auto, auto, 50%);
          content: "";
          display: block;
          width: 4px;
          height: 30px;
          border-radius: 2px;
          background-color: #e7e7e7;
          transform: translate3d(-50%, -50%, 0);
        }
      }
    }
  }
}
</style>