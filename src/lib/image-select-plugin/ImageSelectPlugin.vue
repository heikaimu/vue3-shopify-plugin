<!--
 * @Description: 图片选择插件，直选，调用AI扣头，从第三方选择，从缓存中选择
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-10 13:51:14
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-10 17:54:48
-->
<template>
  <div class="file-select">
    <!-- top -->
    <div class="file-select__top border-bottom">
      <base-header mainText="Choose Photos Source" @close="handleClosePlugin" />
    </div>
    <!-- medium -->
    <div class="file-select__medium">
      <!-- file-select -->
      <layer-image-select
        v-if="currentState === 'select'"
        @change="handleChangeFile"
        @selectCache="handleUseCache"
        @close="handleClosePlugin"
      ></layer-image-select>
      <!-- file-handler -->
      <layer-image-handler
        v-if="currentState === 'handler'"
        :fileURL="viewFile"
        :isCustomBody="isCustomBody"
        @back="handleChangeState"
        @rotate="handleRotateImage"
        @crop="handleChangeState"
        @save="handleSaveImage"
      ></layer-image-handler>
      <!-- file-crop -->
      <layer-image-crop
        v-if="currentState === 'crop'"
        :fileURL="rawFile"
        @back="handleChangeState"
        @complete="handleCompleteCrop"
      ></layer-image-crop>
      <!-- avatar-select -->
      <layer-avatar-select
        v-if="currentState === 'avatar'"
        :data="avatarList"
        @back="handleChangeState"
        @select="handleSelectOneAvatar"
      ></layer-avatar-select>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, toRaw } from "vue";

import BaseHeader from "../../base/BaseHeader.vue";
import LayerImageSelect from "./layer-image-select/LayerImageSelect.vue";
import LayerImageHandler from "./layer-image-handler/LayerImageHandler.vue";
import LayerImageCrop from "./layer-image-crop/LayerImageCrop.vue";
import LayerAvatarSelect from "./layer-avatar-select/LayerAvatarSelect.vue";

import localforage from "localforage";

export default {
  components: {
    BaseHeader,
    LayerImageSelect,
    LayerImageHandler,
    LayerImageCrop,
    LayerAvatarSelect
  },

  props: {
    // 是否定制
    isCustomBody: {
      type: Boolean,
      default: true,
    },
  },

  emits: {
    // 文件选择完成
    complete: null,
    // 关闭
    close: null,
  },

  setup(props, context) {
    const state = reactive({
      // 原始文件
      rawFile: "",
      //当前展示的图片
      viewFile: "",
      // 当前状态,select：文件选择，handler：预览，crop：裁剪，avatar：多头选择
      currentState: "select",
      // 头像列表
      avatarList: [],
      // 当前头部信息
      avatar: {
        chin: null,
        url: "",
      },
    });

    // ========================== 文件选择 ========================
    // 选择文件
    function handleChangeFile(url) {
      state.rawFile = url;
      state.viewFile = url;
      state.currentState = "handler";
    }

    // 使用缓存
    function handleUseCache(item) {
      const { rawFileURL, url, chin } = item;
      state.rawFile = rawFileURL;
      state.avatar = {
        chin,
        url,
      };
      completeSelect();
    }

    // 选择完成
    function completeSelect() {
      const data = {
        rawFile: toRaw(state.rawFile),
        avatar: toRaw(state.avatar),
      };
      context.emit("complete", data);
    }

    // =========================== 文件操作 ============================

    // 旋转文件
    function handleRotateImage(url) {
      state.viewFile = url;
    }

    // 保存图片
    function handleSaveImage(data) {
      if (data.length === 1) {
        state.avatar = data[0];
        saveAndUseAvatar(state.avatar);
      } else if (data.length > 1) {
        state.currentState = "avatar";
        state.avatarList = data;
      }
    }

    // 保存并使用头像
    function saveAndUseAvatar(avatar) {
      const { url, chin } = avatar;
      const image = new Image();
      image.src = url;
      image.onload = () => {
        const data = {
          chin: toRaw(chin),
          url: toRaw(url),
          width: image.width,
          height: image.height,
        };
        cacheAvatar({
          ...data,
          rawFileURL: toRaw(state.rawFile),
        });
        completeSelect();
      };
    }

    // 缓存头像到本地
    function cacheAvatar(item) {
      localforage.getItem("avatarList").then((res) => {
        let avatarList = [];
        if (res) {
          avatarList = res;
        }
        avatarList.unshift(item);
        localforage.setItem("avatarList", avatarList);
      });
    }

    // =========================== 裁剪 ============================
    // 完成裁剪
    function handleCompleteCrop(url) {
      state.viewFile = url;
      handleChangeState("handler");
    }

    // 多头
    function handleSelectOneAvatar(avatar) {
      saveAndUseAvatar(avatar);
    }

    // =========================== 其他 ============================
    // 关闭插件
    function handleClosePlugin() {
      context.emit("close");
    }

    // 修改状态
    function handleChangeState(flag) {
      state.currentState = flag;
    }

    return {
      ...toRefs(state),
      handleClosePlugin,
      completeSelect,
      handleChangeFile,
      handleUseCache,
      handleChangeState,
      handleRotateImage,
      handleSaveImage,
      handleCompleteCrop,
      handleSelectOneAvatar
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
