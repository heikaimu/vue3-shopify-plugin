<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-23 17:32:31
-->
<template>
  <div class="background-wrapper">
    <div class="background-top">
      <base-header
        :center="false"
        mainText="Background Chose"
        icon="arrowLeft"
        @close="handleClose"
      />
    </div>

    <div class="background-medium">
      <div class="query-box">
        <div class="query-operations" @click="handleOpenToggle">
          <div class="query-open">
            <svg v-if="!queryVisible" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z" class="style-scope yt-icon"></path></g></svg>
            <svg v-else viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M15,17h6v2h-6V17z M11,17H3v2h8v2h2v-6h-2V17z M14,9h2V3h-2v2H3v2h11V9z M18,5v2h3V5H18z M6,15h2V9H6v2H3v2h3V15z M10,13h11 v-2H10V13z" class="style-scope yt-icon"></path></g></svg>
          </div>
          <p class="text">Filter</p>
        </div>

        <div class="query-content" v-show="queryVisible">
          <query-item
            :data="sizeList"
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

          <query-item
            :data="backgroundGroupList"
            :activeIndex="groupIndex"
            :title="pluginText.background_group"
            selector="name"
            @change="changeGroup"
          ></query-item>
        </div>
      </div>

      <!-- 背景 -->
      <div class="list-box" >
        <div ref="listBox">
          <background-list
            :data="backgroundList"
            :size="currentSize"
            :composingList="composingList"
            :composingIndex="composingIndex"
            :activeIndex="backgroundIndex"
            :customBodyPreviewURL="customBodyPreviewURL"
            @change="changeBackgroundIndex"
          ></background-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref, watch } from "vue";
import BaseHeader from "../../../base/BaseHeader.vue";
import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";
import BaseNotice from "../../../base/BaseNotice.vue";
import BaseLoadingDot from "../../../base/BaseLoadingDot.vue";

import QueryItem from "./QueryItem.vue";

import BackgroundList from "./BackgroundList.vue";

import useBackground from "../../../composables/useBackground";
import useComposing from "../../../composables/useComposing";
import useSize from "../../../composables/useSize";

export default {
  components: {
    BaseHeader,
    BaseButton,
    BaseIcon,
    BaseNotice,
    BaseLoadingDot,
    BackgroundList,
    QueryItem,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    customBodyPreviewURL: {
      type: String,
      default: "",
    },
    backgroundActiveName: {
      type: String,
      default: "",
    },
    composingActiveName: {
      type: String,
      default: "",
    },
    sizeActiveName: {
      type: String,
      default: "",
    },
    sizeList: {
      type: Array,
      default: 0,
    },
  },

  emits: {
    change: null,
    close: null,
    next: null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    // 背景
    const {
      groupIndex,
      backgroundGroupList,
      backgroundList,
      backgroundIndex,
      backgroundName,
      changeBackgroundIndex,
      getBackgroundImage,
      changeGroup,
    } = useBackground(props);

    const listBox = ref(null);
    watch(() => groupIndex.value, () => {
      listBox && listBox.value.scrollIntoView({ block: "start", inline: "nearest" });
    })

    // 排版
    const {
      composingList,
      composingIndex,
      composingName,
      changeComposingIndex,
      getComposing,
    } = useComposing(props);

    // 尺寸
    const { sizeList, sizeIndex, sizeName, currentSize, changeSizeIndex } =
      useSize(props);

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 显示隐藏搜索条件
    const queryVisible = ref(false);
    function handleOpenToggle() {
      queryVisible.value = !queryVisible.value;
    }

    return {
      pluginText,
      handleClose,
      backgroundGroupList,
      groupIndex,
      backgroundList,
      backgroundIndex,
      changeGroup,
      changeBackgroundIndex,
      sizeList,
      sizeIndex,
      currentSize,
      changeSizeIndex,
      composingList,
      composingIndex,
      changeComposingIndex,
      queryVisible,
      handleOpenToggle,
      listBox
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.background-wrapper {
  @include pos-absolute(0, 0, 0, 0, 1000);
  @include flex-col-sb;
  background-color: #ffffff;
  -webkit-user-select: none; 
  -moz-user-select: none; 

  .background-top {
    width: 100%;
  }

  .background-medium {
    @include flex-col-sb;
    width: 100%;
    flex: 1;
    overflow: hidden;
    .query-box {
      width: 100%;
      padding: 10px;
      border-bottom: 10px solid #f2f2f2;

      .query-operations {
        @include flex-row-center;
        cursor: pointer;

        .text {
          font-size: 14px;
          color: #333333;
          font-weight: 600;
        }
      }
      .query-open {
        width: 30px;
        height: 30px;
      }
    }

    .list-box {
      flex: 1;
      width: 100%;
      background-color: #f9f9f9;
      box-sizing: border-box;
      padding: 0 11px;
      overflow-x: hidden;
      overflow: auto;

      /*解决ios上滑动不流畅*/
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        // 滚动条
        // display: none;
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 2px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #535353;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 2px;
        background: #ededed;
      }
    }
  }
}
</style>