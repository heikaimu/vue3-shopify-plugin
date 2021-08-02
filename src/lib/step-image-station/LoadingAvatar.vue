<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 09:42:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-30 15:35:07
-->
<template>
  <div class="ai-loading" v-if="visible">
    <div class="ai-loading__img">
      <img
        v-if="state === 'pending'"
        src="https://cdn.shopify.com/s/files/1/0510/1423/8379/files/loading.gif?v=1622543525"
      />
      <img
        v-else-if="state === 'success'"
        src="https://cdn.shopify.com/s/files/1/0510/1423/8379/files/success.gif?v=1622543501"
      />
      <img
        v-else-if="state === 'error'"
        src="https://cdn.shopify.com/s/files/1/0510/1423/8379/files/fail.gif?v=1622543513"
      />
    </div>
    <div class="loading-text" :style="loadingStyle">{{ loadingText }}</div>
  </div>
</template>

<script>
import { computed, toRefs } from "vue";

export default {
  props: {
    state: {
      type: String,
      deafult: "wait",
    },
    visible: {
      type: Boolean,
      deafult: false,
    },
    loadingPendingText: {
      type: String,
      deafult: "",
    },
  },

  setup(props) {
    const loadingStyle = computed(() => {
      if (props.state === "pending") {
        return {
          backgroundColor: "#c0c4cc",
          color: "#ffffff",
        };
      } else if (props.state === "error") {
        return {
          backgroundColor: "#F56C6C",
          color: "#ffffff",
        };
      } else if (props.state === "success") {
        return {
          backgroundColor: "#67C23A",
          color: "#ffffff",
        };
      } else {
        return {};
      }
    });

    const loadingText = computed(() => {
      if (props.state === "pending") {
        return props.loadingPendingText;
      } else if (props.state === "error") {
        return "Failed. Please Try Another Photo.";
      } else if (props.state === "success") {
        return "Success";
      } else {
        return "";
      }
    });

    return {
      loadingStyle,
      loadingText,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.ai-loading {
  @include pos-absolute;
  @include flex-col-center;
  background-color: #ffffff;

  .ai-loading__img {
    width: 100px;
    height: 100px;
  }

  .loading-text {
    @include flex-row-center;
    padding: 0 20px;
    height: 30px;
    border-radius: 15px;
    background-color: #f3f2f2f2;
    font-size: 12px;
    font-weight: 600;
    margin-top: 10px;
  }
}
</style>