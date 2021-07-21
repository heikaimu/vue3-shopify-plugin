<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 15:49:33
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-21 17:21:11
-->
<template>
  <div class="body-custom-wrapper">
    <custom-list
      :avatar="avatar"
      :config="config"
      @back="backToFileSelect"
      @select="selectCard"
    />
    <custom-board
      v-if="customBoardVisible"
      :avatar="avatar"
      :config="currentCardConfig"
      @back="customBoardVisible = false"
      @selectFile="backToFileSelect"
    ></custom-board>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from "vue";

import CustomList from "./custom-list/CustomList.vue";
import CustomBoard from "./custom-board/CustomBoard.vue";

export default {
  components: {
    CustomList,
    CustomBoard,
  },

  props: {
    avatar: {
      type: Object,
      deafult: () => {},
    },
    config: {
      type: Object,
      deafult: () => {},
    }
  },

  emits: {
    setStep: null,
  },

  setup(props, context) {
    const state = reactive({
      customBoardVisible: false,
      currentCardConfig: {},
    });

    // 返回文件选择
    function backToFileSelect() {
      context.emit("setStep", "fileSelect");
    }

    // 卡片选择
    function selectCard(item) {
      state.customBoardVisible = true;
      state.currentCardConfig = item;
    }

    return {
      ...toRefs(state),
      selectCard,
      backToFileSelect,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.body-custom-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>