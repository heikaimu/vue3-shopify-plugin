<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 15:49:33
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-28 17:50:49
-->
<template>
  <div class="body-custom-wrapper">
    <custom-list
      :avatar="avatar"
      :config="config"
      @back="backToFileSelect"
      @select="selectCard"
    />
    <transition name="slide-up-fade" mode="out-in">
      <custom-board
        v-if="customBoardVisible"
        :avatar="avatar"
        :config="currentCardConfig"
        :title="config.productTitle"
        :price="config.productPrice"
        @back="customBoardVisible = false"
        @selectFile="backToFileSelect"
        @confirm="confirmCustom"
      ></custom-board>
    </transition>
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
    },
  },

  emits: {
    selectBody: null,
    setStep: null,
    confirm: null,
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
      context.emit("selectBody", item);
    }

    // 确认定制
    function confirmCustom(url) {
      context.emit("confirm", url);
    }

    return {
      ...toRefs(state),
      selectCard,
      backToFileSelect,
      confirmCustom,
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

// 下方
.slide-up-fade-enter-from,
.slide-up-fade-leave-to {
  transform: translate3d(0, 50px, 0);
  opacity: 0;
}
.slide-up-fade-leave-from,
.slide-up-fade-enter-to {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.slide-up-fade-enter-active {
  transition: all 0.3s ease-in-out;
}
.slide-up-fade-leave-active {
  transition: all 0.1s ease;
}
</style>