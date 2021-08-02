<template>
  <div class="multiple-avatar">
    <div class="multiple-avatar__top">
      <base-header mainText="Choose A Source" icon="arrowLeft" @close="backToView" />
    </div>
    <div class="multiple-avatar__medium">
      <ul class="avatar-list">
        <li
          class="avatar-item"
          v-for="(item, index) in data"
          :key="index"
          @click="selectAvatar(item)"
        >
          <img class="avatar-img" :src="item.url" alt="" srcset="" />
        </li>
      </ul>
      <div class="multiple-avatar__notice">
        <base-notice
          >AI image cropping is mainly for preview.NOT FINAL DESIGN! Our
          designer will finalize the perfect fit!</base-notice
        >
      </div>
    </div>
  </div>
</template>

<script>
import { toRaw } from "vue";

import BaseHeader from "../../components/BaseHeader.vue";
import BaseNotice from "../../components/BaseNotice.vue";

export default {
  components: {
    BaseHeader,
    BaseNotice,
  },

  props: {
    data: {
      type: Array,
      deafult: () => [],
    },
  },

  emits: {
    select: null,
    back: null,
  },

  setup(props, context) {
    // 选择一个头像
    function selectAvatar(avatar) {
      context.emit("select", toRaw(avatar));
    }

    // 回到预览
    function backToView() {
      context.emit("back");
    }

    return {
      selectAvatar,
      backToView,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.multiple-avatar {
  @include flex-col-sb;
  height: 100%;
}
.multiple-avatar__top {
  width: 100%;
}
.multiple-avatar__medium {
  @include flex-col-sb;
  width: 100%;
  flex: 1;
  background-color: #f2f2f2;
  .avatar-list {
    @include flex-row-center;
    width: 100%;
    padding: 20px;
    .avatar-item {
      @include flex-row-center;
      width: 33.33%;
      padding: 10px;
      .avatar-img {
        width: 100px;
        height: 100px;
        object-fit: contain;
        cursor: pointer;
      }
    }
  }
  .multiple-avatar__notice {
    padding: 10px;
  }
}
</style>