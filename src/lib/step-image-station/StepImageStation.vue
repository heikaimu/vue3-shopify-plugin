<template>
  <div class="image-station">
    <image-view
      :fileURL="viewFile"
      v-if="currentState === 'view'"
      @rotate="rotateViewFile"
      @crop="goToCrop"
      @cartoonize="cartoonizeImage"
      @normalize="normalizeImage"
      @setAvatar="setAvatar"
      @back="backToFileSelect"
      @close="closePlugin"
    />
    <image-crop
      :fileURL="rawFile"
      v-else-if="currentState === 'crop'"
      @crop="cropViewFile"
      @back="currentState = 'view'"
    />
    <avatar-select
      v-else-if="currentState === 'avatar'"
      :data="avatarList"
      @select="selectAvatar"
      @back="currentState = 'view'"
    ></avatar-select>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";

import ImageView from "./ImageView.vue";
import ImageCrop from "./ImageCrop.vue";
import AvatarSelect from "./AvatarSelect.vue";

import localforage from "localforage";

export default {
  components: {
    ImageView,
    ImageCrop,
    AvatarSelect,
  },

  props: {
    // 原始文件
    rawFile: {
      type: String,
      default: "",
    },
  },

  emits: {
    setStep: null,
    setAvatar: null,
    close: null,
  },

  setup(props, context) {
    const { rawFile } = props;

    const state = reactive({
      //当前展示的图片
      viewFile: "",
      // 当前状态,view：预览，crop：裁剪，avatar：多头选择
      currentState: "view",
      // 头像列表
      avatarList: [],
    });

    onMounted(() => {
      // 进入组件时候，设置展示图片为原图
      state.viewFile = rawFile;
    });

    // 旋转预览图
    function rotateViewFile(url) {
      state.viewFile = url;
    }

    // 卡通画图片
    function cartoonizeImage(url) {
      state.viewFile = url;
    }

    // 卡通画图片
    function normalizeImage(url) {
      state.viewFile = url;
    }

    // 去裁剪原图
    function goToCrop() {
      state.currentState = "crop";
    }

    // 裁剪完成
    function cropViewFile(url) {
      state.viewFile = url;
      state.currentState = "view";
    }

    // 设置AI头像
    function setAvatar(data) {
      if (data.length === 1) {
        const avatar = data[0];
        saveAndUseAvatar(avatar);
      } else if (data.length > 1) {
        state.currentState = "avatar";
        state.avatarList = data;
      }
    }

    // 选择多头中的一个
    function selectAvatar(avatar) {
      saveAndUseAvatar(avatar);
    }

    // 保存并使用头像
    function saveAndUseAvatar(avatar) {
      const image = new Image();
      image.src = avatar.url;
      image.onload = () => {
        const data = {
          ...avatar,
          width: image.width,
          height: image.height
        }
        context.emit("setAvatar", data);
        cacheAvatar({
          ...data,
          rawFile
        });
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

    // 回到文件选择
    function backToFileSelect() {
      context.emit("setStep", "fileSelect");
    }

    // 关闭插件
    function closePlugin() {
      context.emit("close");
    }

    return {
      ...toRefs(state),
      rotateViewFile,
      goToCrop,
      cropViewFile,
      cartoonizeImage,
      normalizeImage,
      setAvatar,
      backToFileSelect,
      selectAvatar,
      closePlugin,
    };
  },
};
</script>

<style lang="scss" scoped>
.image-station {
  height: 100%;
}
</style>