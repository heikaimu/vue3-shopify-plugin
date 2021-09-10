<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 09:42:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-30 15:23:32
-->
<template>
  <div class="avatar-cache">
    <div class="avatar-cache-header">
      <p class="avatar-cache-header__title">Avatar Records（Click To Use）</p>
      <span class="avatar-cache-header__clear-button" @click="handleClearAll">Clear All</span>
    </div>
    <div class="cache-list-wrapper">
      <base-row :gutter="20" v-if="list.length > 0">
        <base-col :span="8" v-for="(item, index) in list" :key="index">
          <base-card
            :src="item.url"
            closeable
            @click="selectFile(item)"
            @close="removeFile(item, index)"
          ></base-card>
        </base-col>
      </base-row>
      <p v-else class="avatar-cache__empty-text">Three is no cache files</p>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, toRaw } from "vue";

import BaseRow from "../../base/BaseRow.vue";
import BaseCol from "../../base/BaseCol.vue";
import BaseCard from "../../base/BaseCard.vue";

import localforage from "localforage";

export default {
  components: {
    BaseRow,
    BaseCol,
    BaseCard,
  },

  emits: {
    select: null,
  },

  setup(props, context) {
    const state = reactive({
      list: [],
    });

    onMounted(() => {
      localforage.getItem("avatarList").then((res) => {
        state.list = res || [];
      });
    });

    // 选择文件
    function selectFile(item) {
      context.emit("select", toRaw(item));
    }

    // 删除文件
    function removeFile(item, index) {
      state.list.splice(index, 1);
      localforage.setItem("avatarList", toRaw(state.list));
    }

    // 清空文件
    function handleClearAll() {
      state.list = [];
      localforage.setItem("avatarList", []);
    }

    return {
      ...toRefs(state),
      selectFile,
      removeFile,
      handleClearAll,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.avatar-cache {
}

.avatar-cache-header {
  @include flex-row-sb;
  padding: 20px 0 10px 0;
}

.avatar-cache-header__title {
  font-size: 16px;
  font-weight: 600;
  color: $context-color;
  margin-bottom: 0;
}

.avatar-cache-header__clear-button {
  font-size: 14px;
  font-weight: 600;
  color: $sub-theme-color;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.3s;

  &:hover {
    opacity: 1;
  }
}

.avatar-cache__empty-text {
  text-align: center;
  font-size: 16px;
  color: #cccccc;
  padding-top: 100px;
}
</style>