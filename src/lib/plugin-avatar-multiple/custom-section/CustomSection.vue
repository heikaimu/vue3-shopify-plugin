<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-08 17:35:23
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-18 17:28:29
-->
<template>
  <div class="body-custom-wrapper">
    <custom-list
      :config="config"
      :showSkin="false"
      :selectFiles="selectFiles"
      v-bind="$attrs"
      @back="closePlugin"
      @select="selectCard"
    />
    <transition name="slide-up-fade" mode="out-in">
      <custom-board
        v-if="customBoardVisible"
        :config="currentCardConfig"
        :selectFiles="selectFiles"
        :skin="config.defaultSkin"
        :title="config.productTitle"
        :price="config.productPrice"
        @close="handleCloseBoard"
        @save="handleSave"
      />
    </transition>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

import CustomList from "../../plugin-minime/custom-section/custom-list/CustomList.vue";
import CustomBoard from "./custom-board/CustomBoard.vue";

export default {
  components: {
    CustomList,
    CustomBoard,
  },

  props: {
    config: {
      type: Object,
      deafult: () => {},
    },
    selectFiles: {
      type: Array,
      deafult: () => [],
    },
  },

  emits: {
    close: null,
    save: null,
    selectBody: null
  },

  setup(props, context) {
    const state = reactive({
      customBoardVisible: false,
      currentCardConfig: {},
    });

    // 关闭插件
    function closePlugin() {
      context.emit("close");
    }

    // 保存定制
    function handleSave(url) {
      context.emit("save", url);
    }

    // 卡片选择
    function selectCard(item) {
      state.customBoardVisible = true;
      state.currentCardConfig = item;
      context.emit("selectBody", item);
    }

    function handleCloseBoard() {
      state.customBoardVisible = false;
    }

    return {
      ...toRefs(state),
      closePlugin,
      handleSave,
      selectCard,
      handleCloseBoard
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