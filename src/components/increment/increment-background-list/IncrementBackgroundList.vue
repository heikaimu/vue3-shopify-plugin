<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-27 14:17:41
-->
<template>
  <div class="background-wrapper">
    <div class="background-top">
      <base-header
        :center="false"
        mainText="Background Chose"
        icon="arrowLeft"
        @close="handleClose"
      >
        <filter-button
          v-if="isExistQueryBar"
          :active="queryVisible"
          @click="handleOpenToggle"
        ></filter-button>
      </base-header>
    </div>

    <div class="background-medium">

      <!-- 分组 -->
      <div class="side-navigation-box">
        <SideNavigation :list="backgroundGroupList" :value="groupIndex" @change="changeGroup"/>
      </div>

      <!-- 背景 -->
      <div class="list-box">
        <div ref="listBox">
          <background-list
            :data="backgroundList"
            :backgroundImage="data.backgroundImage"
            :overlayImage="data.overlayImage"
            :size="currentSize"
            :composingList="composingList"
            :composingIndex="composingIndex"
            :activeIndex="backgroundIndex"
            :customBodyPreviewURL="customBodyPreviewURL"
            @change="changeBackgroundIndex"
            @cardSelect="handleCardSelect"
          ></background-list>
        </div>
      </div>
    </div>

    <!-- loading -->
    <div class="loading-box" v-if="loadingVisible">
      <BaseLoadingDot />
    </div>

    <!-- 搜索条件 -->
    <query-bar
      v-model:visible="queryVisible"
      :sizeList="sizeList"
      :sizeIndex="sizeIndex"
      :changeSizeIndex="changeSizeIndex"
      :composingList="composingList"
      :composingIndex="composingIndex"
      :changeComposingIndex="changeComposingIndex"
      :backgroundGroupList="backgroundGroupList"
      :groupIndex="groupIndex"
      :changeGroup="changeGroup"
    ></query-bar>
  </div>
</template>

<script>
import { inject, ref, watch, computed } from "vue";
import BaseHeader from "../../../base/BaseHeader.vue";
import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";
import BaseNotice from "../../../base/BaseNotice.vue";
import BaseLoadingDot from "../../../base/BaseLoadingDot.vue";

import BackgroundList from "./BackgroundList.vue";
import QueryBar from "./QueryBar.vue";
import FilterButton from "./FilterButton.vue";
import SideNavigation from "./SideNavigation.vue";

import useBackground from "../../../composables/useBackground";
import useComposing from "../../../composables/useComposing";
import useSize from "../../../composables/useSize";

import ImageAndTextRenderer from "../../../utils/ImageAndTextRenderer";

export default {
  components: {
    BaseHeader,
    BaseButton,
    BaseIcon,
    BaseNotice,
    BaseLoadingDot,
    BackgroundList,
    QueryBar,
    FilterButton,
    SideNavigation
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
    saveBgRenderParams: null,
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
      changeGroup,
    } = useBackground(props);

    const listBox = ref(null);
    watch(
      () => groupIndex.value,
      () => {
        listBox &&
          listBox.value.scrollIntoView({ block: "start", inline: "nearest" });
      }
    );

    // 排版
    const {
      composingList,
      composingIndex,
      composingName,
      changeComposingIndex,
    } = useComposing(props);

    // 尺寸
    const { sizeList, sizeIndex, sizeName, currentSize, changeSizeIndex } =
      useSize(props);

    // 图片文字渲染器
    const imageAndTextRenderer = new ImageAndTextRenderer("virtualCanvas");

    // 加载层
    const loadingVisible = ref(false);

    // 选择卡片
    async function handleCardSelect(params) {
      // 设置背景渲染参数
      context.emit("saveBgRenderParams", params);

      // 获取渲染好的背景信息
      loadingVisible.value = true;
      const bgInfo = await getBackgroundInfo(params);
      context.emit("change", bgInfo);
      loadingVisible.value = false;

      // 前往下一步
      context.emit("next");
    }

    // 渲染带背景的预览图
    function getBackgroundInfo(params) {
      return new Promise((resolve, reject) => {
        imageAndTextRenderer.init(params).then(() => {
          const url = imageAndTextRenderer.toDataURL();
          resolve({
            preview: url,
            params: {
              size: {
                index: sizeIndex.value,
                title: sizeName.value,
              },
              background: {
                index: backgroundIndex.value,
                title: backgroundName.value,
              },
              composing: {
                index: composingIndex.value,
                title: composingName.value,
              },
            },
          });
        });
      });
    }

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 显示隐藏搜索条件
    const queryVisible = ref(false);
    function handleOpenToggle() {
      queryVisible.value = !queryVisible.value;
    }

    // 是否有搜索条件
    const isExistQueryBar = computed(() => {
      return sizeList.value.length > 1 || composingList.value.length > 1;
    })

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
      loadingVisible,
      handleCardSelect,
      listBox,
      queryVisible,
      handleOpenToggle,
      isExistQueryBar
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

  .loading-box {
    @include pos-absolute(0, 0, 0, 0, 1001);
    @include flex-row-center;
    background-color: rgba(255, 255, 255, 0.9);
  }

  .background-top {
    width: 100%;
  }

  .background-medium {
    width: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;

    .side-navigation-box {
      flex: 0 0 86px;
      height: 100%;
    }

    .list-box {
      flex: 1;
      width: 100%;
      background-color: #f9f9f9;
      box-sizing: border-box;
      padding: 10px;
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