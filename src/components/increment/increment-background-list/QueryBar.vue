<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-27 13:25:49
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-18 15:57:14
-->
<template>
  <transition name="slide-right-fade">
    <div class="query-bar" v-if="visible">
      <base-header
        :center="false"
        mainText="Background Query Bar"
        icon="arrowLeft"
        @close="handleClose"
      >
      </base-header>

      <div class="query-content">
        <query-item
          :data="sizeList.map(item => item.label)"
          :activeIndex="sizeIndex"
          :title="pluginText.size"
          @change="changeSizeIndex"
        ></query-item>

        <query-item
          :data="composingList"
          :activeIndex="composingIndex"
          :title="pluginText.composing"
          selector="title"
          @change="changeComposingIndex"
        ></query-item>

        <!-- <query-item
          :data="backgroundGroupList"
          :activeIndex="groupIndex"
          :title="pluginText.background_group"
          selector="name"
          @change="changeGroup"
        ></query-item> -->
      </div>
    </div>
  </transition>
</template>

<script>
import { inject, watch } from "vue";
import QueryItem from "./QueryItem.vue";
import BaseHeader from "../../../base/BaseHeader.vue";

export default {
  components: {
    QueryItem,
    BaseHeader,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    sizeList: {
      type: Array,
      default: () => [],
    },
    sizeIndex: {
      type: Number,
      default: -1,
    },
    changeSizeIndex: {
      type: Function,
    },
    composingList: {
      type: Array,
      default: () => [],
    },
    composingIndex: {
      type: Number,
      default: -1,
    },
    changeComposingIndex: {
      type: Function,
    },
    backgroundGroupList: {
      type: Array,
      default: () => [],
    },
    groupIndex: {
      type: Number,
      default: -1,
    },
    changeGroup: {
      type: Function,
    },
  },

  emits: {
    close: null,
    "update:visible": null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    watch(() => [props.sizeIndex, props.composingIndex], () => {
      handleClose();
    })

    function handleClose() {
      context.emit("update:visible", false);
    }

    return {
      pluginText,
      handleClose,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";
.query-bar {
  @include pos-absolute(0, 0, 0, 0, 999);
  background-color: #ffffff;

  .query-content {
    padding: 0 10px;
  }
}

// 左方
.slide-right-fade-enter-from,
.slide-right-fade-leave-to {
  transform: translate3d(30px, 0, 0);
  opacity: 0;
}
.slide-right-fade-leave-from,
.slide-right-fade-enter-to {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.slide-right-fade-enter-active {
  transition: all 0.3s ease-in-out;
}
.slide-right-fade-leave-active {
  transition: all 0.1s ease;
}
</style>