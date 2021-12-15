<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-08 17:35:23
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-10 16:11:19
-->
<template>
  <div>
    <custom-board
      v-if="currentConfig"
      :config="currentConfig"
      :selectFiles="selectFiles"
      :skin="config.defaultSkin"
      :title="config.productTitle"
      :price="config.productPrice"
      @close="closePlugin"
      @save="handleSave"
    />
  </div>
</template>

<script>
import { reactive, ref, toRefs, onMounted, watch } from "vue";

import CustomBoard from "./custom-board/CustomBoard.vue";

import { cloneDeep } from "lodash";

export default {
  components: {
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
  },

  setup(props, context) {
    const state = reactive({
      currentIndex: 0,
      currentConfig: null,
      faceList: []
    });

    onMounted(() => {
      setCurrentConfig();
    });

    watch(
      () => state.currentIndex,
      () => {
        setCurrentConfig();
      }
    );

    // 获取当前的配置
    function setCurrentConfig() {
      const groupList = props.config.miniMeData;
      if (groupList && groupList.length > 0) {
        let firstConfig = groupList[0].images[state.currentIndex];
        if (!firstConfig.id) {
          firstConfig = groupList[0].images[state.currentIndex + 1];
        }
        state.currentConfig = firstConfig;
        state.faceList = cloneDeep(state.currentConfig.faceList);
      }
    }

    // 关闭插件
    function closePlugin() {
      context.emit("close");
    }

    // 保存定制
    function handleSave(url) {
      context.emit("save", url);
    }

    return {
      ...toRefs(state),
      closePlugin,
      handleSave,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>