<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 15:49:33
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-21 10:04:05
-->
<template>
  <div class="body-custom">
    <div class="body-custom__top">
      <base-header @close="backToFileSelect">
        <skin-selector
          :list="skinList"
          :skin="skin"
          @change="changeSkin"
        ></skin-selector>
      </base-header>
    </div>
    <div class="body-custom__medium">
      <div class="side-navigation-wrapper">
        <side-navigation
          :list="navigation"
          :value="currentGroupName"
          @change="changeGroupName"
        />
      </div>
      <div class="body-list-wrapper">
        <body-list :list="currentGrouplist" :skin="skin" :avatar="avatar" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onMounted,
  computed,
  watch,
  nextTick,
} from "vue";

import BaseHeader from "../../components/BaseHeader.vue";
import SkinSelector from "./SkinSelector.vue";
import SideNavigation from "./SideNavigation.vue";
import BodyList from "./BodyList.vue";

export default {
  components: {
    BaseHeader,
    SkinSelector,
    SideNavigation,
    BodyList,
  },

  props: {
    avatar: {
      type: Object,
      deafult: () => {},
    },
    config: {
      type: Object,
      deafult: () => {},
    },
  },

  emits: {
    setStep: null,
  },

  setup(props, context) {
    const { config } = props;

    const state = reactive({
      // 肤色
      skin: "",
      // 肤色列表
      skinList: [],
      // 全部列表
      list: [],
      // 导航
      navigation: [],
      // 当前分组
      currentGroupName: "",
      // 当前使用的配置
      currentOption: {},
      // 定制显示
      customVisible: false
    });

    // 列表
    onMounted(() => {
      state.list = config.miniMeData;
    });

    // 当前组列表数据，导航数据
    onMounted(() => {
      state.currentGroupName = config.miniMeData[0].name;
      state.navigation = config.miniMeData.map((item, index) => {
        return {
          name: item.name,
          count: item.images.length,
        };
      });
    });

    const currentGrouplist = computed(() => {
      const currentGroup = state.list.find(
        (group) => group.name === state.currentGroupName
      );
      return currentGroup ? currentGroup.images : [];
    });

    function changeGroupName(name) {
      state.currentGroupName = name;
    }

    // 肤色
    onMounted(() => {
      state.skinList = config.colors;
      state.skin = config.colors[0].name;
    });

    function changeSkin(skin) {
      state.skin = skin;
    }

    // 返回文件选择
    function backToFileSelect() {
      context.emit("setStep", "fileSelect");
    }

    return {
      ...toRefs(state),
      currentGrouplist,
      backToFileSelect,
      changeSkin,
      changeGroupName
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.body-custom {
  @include flex-col-sb;
  height: 100%;
}
.body-custom__top {
  width: 100%;
}
.body-custom__medium {
  @include flex-row-sb;
  width: 100%;
  flex: 1;
  overflow: hidden;
  .side-navigation-wrapper {
    flex: 0 0 70px;
    height: 100%;
  }
  .body-list-wrapper {
    flex: 1;
    height: 100%;
    background-color: #f2f2f2;
  }
}
</style>