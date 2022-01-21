<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 15:49:33
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-21 10:51:04
-->
<template>
  <div class="custom-list">
    <div class="custom-list__top">
      <base-header
        icon="arrowLeft"
        :mediumText="!showSkin ? `${pluginText.choose_template}` : ''"
        @close="backToFileSelect"
        :center="false"
      >
        <skin-selector
          v-if="showSkin"
          :skin="config.defaultSkin"
          @change="changeSkin"
        ></skin-selector>
        <couple-skin-selector
          v-else
          :skin="config.defaultSkin"
          @change="changeSkin"
        ></couple-skin-selector>
      </base-header>
    </div>
    <div class="custom-list__medium">
      <div class="side-navigation-wrapper">
        <side-navigation
          :list="navigation"
          :value="currentGroupName"
          @change="changeGroupName"
        />
      </div>
      <div class="body-list-wrapper">
        <body-list
          :list="currentGrouplist"
          :skin="config.defaultSkin"
          v-bind="$attrs"
          @select="selectCard"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed, watch, inject } from "vue";

import BaseHeader from "../../../../base/BaseHeader.vue";
import SkinSelector from "./SkinSelector.vue";
import CoupleSkinSelector from "../../../../components/SkinSelector.vue";
import SideNavigation from "./SideNavigation.vue";
import BodyList from "./BodyList.vue";

import useBodyNavigation from "../../../../composables/useBodyNavigation";

export default {
  components: {
    BaseHeader,
    SkinSelector,
    SideNavigation,
    BodyList,
    CoupleSkinSelector,
  },

  props: {
    config: {
      type: Object,
      deafult: () => {},
    },
    showSkin: {
      type: Boolean,
      default: true,
    },
  },

  emits: {
    back: null,
    select: null,
    changeSkin: null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    const { config } = props;

    const { currentGroupName, navigation, changeGroupName } =
      useBodyNavigation(props);

    const state = reactive({
      // 全部列表
      list: [],
      // 当前使用的配置
      currentOption: {},
      // 定制显示
      customVisible: false,
    });

    // 列表
    onMounted(() => {
      state.list = config.mainData.body.list;
    });

    const currentGrouplist = computed(() => {
      const currentGroup = (state.list || []).find(
        (group) => group.name === currentGroupName.value
      );
      return currentGroup ? currentGroup.images : [];
    });

    function changeSkin(val) {
      context.emit("changeSkin", val);
    }

    // 卡片选择
    function selectCard(item) {
      context.emit("select", {
        groupName: currentGroupName.value,
        ...item,
      });
    }

    // 回到头像选择
    function backToFileSelect() {
      context.emit("back");
    }

    return {
      ...toRefs(state),
      pluginText,
      changeSkin,
      currentGroupName,
      navigation,
      changeGroupName,
      currentGrouplist,
      backToFileSelect,
      selectCard,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.custom-list {
  @include pos-absolute;
  @include flex-col-sb;
}
.custom-list__top {
  width: 100%;
}
.custom-list__medium {
  @include flex-row-sb;
  width: 100%;
  flex: 1;
  overflow: hidden;
  .side-navigation-wrapper {
    flex: 0 0 86px;
    height: 100%;
  }
  .body-list-wrapper {
    flex: 1;
    height: 100%;
    background-color: #f2f2f2;
    position: relative;
  }
}
</style>