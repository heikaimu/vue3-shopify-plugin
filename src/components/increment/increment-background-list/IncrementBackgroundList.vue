<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-06 17:19:25
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
        <SideNavigation
          :list="backgroundGroupList"
          :value="groupIndex"
          @change="changeGroup"
        />
      </div>

      <!-- 背景 -->
      <div class="list-box">
        <div ref="listBox">
          <background-list
            :data="backgroundList"
            :backgroundImage="data.backgroundImage"
            :overlayImage="data.overlayImage"
            :size="sizeName"
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

    <!-- 文字确认弹窗 -->
    <text-confirm-box
      v-model:visible="textConfirmVisible"
      :data="textData"
      :dollarSign="dollarSign"
      @custom="handleCustom"
    ></text-confirm-box>
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
import TextConfirmBox from "./TextConfirmBox.vue";

import useBackground from "../../../composables/useBackground";

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
    SideNavigation,
    TextConfirmBox,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    textData: {
      type: Object,
      default: () => {},
    },
    customBodyPreviewURL: {
      type: String,
      default: "",
    },
    dollarSign: {
      type: String,
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

    // 切换分组的时候滚动到顶部
    const listBox = ref(null);
    watch(
      () => groupIndex.value,
      () => {
        listBox &&
          listBox.value.scrollIntoView({ block: "start", inline: "nearest" });
      }
    );

    // ================== Composing =================
    // composing list
    const composingList = computed(() => {
      return props.data.composingList;
    });
    // composing index
    const composingIndex = ref(0);
    // composing name
    const composingName = computed(() => {
      if (composingList.value.length === 0) {
        return "";
      }
      return composingList.value[composingIndex.value];
    });
    // change composing
    function changeComposingIndex(index) {
      composingIndex.value = index;
    }
    // ================== Composing End =================

    // ================== Size =================
    // size list
    const sizeList = computed(() => {
      return props.data.sizeList;
    });
    // size index
    const sizeIndex = ref(0);
    // size name
    const sizeName = computed(() => {
      if (sizeList.value.length === 0) {
        return "";
      }
      return sizeList.value[sizeIndex.value];
    });
    // change size
    function changeSizeIndex(index) {
      sizeIndex.value = index;
    }
    // ================== Size End =================

    // 是否有搜索条件
    const isExistQueryBar = computed(() => {
      return sizeList.value.length > 1 || composingList.value.length > 1;
    });

    // 加载层
    const loadingVisible = ref(false);

    // 文字确认弹窗
    const textConfirmVisible = ref(false);

    // 卡片信息
    let cardInfo = null;

    // 选择卡片
    async function handleCardSelect(params) {
      // 设置背景渲染参数
      cardInfo = params;

      // 获取渲染好的背景信息
      loadingVisible.value = true;
      const bgInfo = await getBackgroundInfo(params);
      context.emit("change", bgInfo);
      loadingVisible.value = false;

      // 如果有文字则出现文字弹窗
      if (props.textData) {
        textConfirmVisible.value = true;
      } else {
        toNextStep(false);
      }
    }

    // 定制
    function handleCustom(flag) {
      toNextStep(flag);
    }

    // 下一步
    function toNextStep(flag) {
      context.emit("saveBgRenderParams", {
        ...cardInfo,
        customTextVisible: flag,
      });
      context.emit("next");
    }
    // 图片文字渲染器
    const imageAndTextRenderer = new ImageAndTextRenderer("virtualCanvas");

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
      sizeName,
      changeSizeIndex,
      composingList,
      composingIndex,
      changeComposingIndex,
      loadingVisible,
      handleCardSelect,
      listBox,
      queryVisible,
      handleOpenToggle,
      isExistQueryBar,
      textConfirmVisible,
      handleCustom,
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