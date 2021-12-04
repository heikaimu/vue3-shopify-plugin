<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-08 10:35:48
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-11-24 11:05:24
-->
<template>
  <!-- 增量服务 -->
  <transition name="slide-bottom-fade" mode="out-in">
    <!-- 单双面 -->
    <increment-slides
      v-if="slidesVisible"
      :data="incrementData.data"
      :value="incrementData.value"
      :customBodyPreviewURL="previewBody"
      :dollarSign="dollarSign"
      @change="changeSlides"
      @close="handleClose"
      @next="nextIncrement"
    />

    <!-- 背景图 -->
    <increment-background-list
      v-else-if="backgroundVisible"
      :data="incrementData"
      :customBodyPreviewURL="previewBody"
      :sizeList="config.sizeList"
      :dollarSign="dollarSign"
      v-bind="$attrs"
      @change="changeBackground"
      @close="handleClose"
      @next="nextIncrement"
    />

    <!-- 文字 -->
    <increment-text
      v-else-if="textVisible"
      :data="incrementData.data"
      :value="incrementData.value"
      :previewWidthBackground="previewWidthBackground"
      :textRenderParams="textRenderParams"
      :dollarSign="dollarSign"
      @change="changeText"
      @close="handleClose"
      @next="nextIncrement"
      @render="setPreviewWidthBackground"
    />

    <!-- 推荐 -->
    <increment-publish
      v-else-if="publishVisible"
      :data="incrementData.data"
      :value="incrementData.value"
      :productOptionsValue="productOptionsValue"
      :skuList="config.skuList"
      :dollarSign="dollarSign"
      @change="changePublish"
      @close="handleClose"
      @next="nextIncrement"
    />

    <!-- 关联产品 -->
    <increment-related-product
      v-else-if="relatedProductVisible"
      :data="incrementData.data"
      :value="incrementData.value"
      :dollarSign="dollarSign"
      @change="changeRelatedProduct"
      @close="handleClose"
      @next="nextIncrement"
    />

    <!-- vip -->
    <increment-vip
      v-else-if="vipVisible"
      :data="incrementData.data"
      :value="incrementData.value"
      :dollarSign="dollarSign"
      @change="changeVip"
      @close="handleClose"
      @next="nextIncrement"
    />
  </transition>
</template>

<script>
import { watch, toRaw } from "vue";

import IncrementSlides from "./increment-slides/IncrementSlides.vue";
import IncrementBackgroundList from "./increment-background-list/IncrementBackgroundList.vue";
import IncrementRelatedProduct from "./increment-related-product/IncrementRelatedProduct.vue";
import IncrementVip from "./increment-vip/IncrementVip.vue";
import IncrementText from "./increment-text/IncrementText.vue";
import IncrementPublish from "./increment-publish/IncrementPublish.vue";

import useIncrement from "../../composables/useIncrement";

export default {
  components: {
    IncrementSlides,
    IncrementBackgroundList,
    IncrementRelatedProduct,
    IncrementVip,
    IncrementText,
    IncrementPublish,
  },

  props: {
    // 配置
    config: {
      type: Object,
      default: () => {},
    },
    // 身体预览图
    previewBody: {
      type: String,
      default: "",
    },
    // 定制状态
    customState: {
      type: Boolean,
      default: false,
    },
    // 货币符号
    dollarSign: {
      type: String,
    },
    // 是否是后台使用
    isManagementUse: {
      type: Boolean,
      default: false,
    },
    // 语言
    language: {
      type: String,
      default: 'us'
    }
  },

  emits: {
    save: null,
    close: null,
  },

  setup(props, context) {
    // 增量
    const {
      productOptionsValue,
      previewWidthBackground,
      textRenderParams,
      queue,
      hasIncrement,
      incrementData,
      slidesVisible,
      publishVisible,
      backgroundVisible,
      textVisible,
      relatedProductVisible,
      vipVisible,
      isLastIncrement,
      changeSlides,
      changeVip,
      changeRelatedProduct,
      setIncrementIndex,
      changeBackground,
      setPreviewWidthBackground,
      changeText,
      changePublish,
      next,
    } = useIncrement(props);

    /* 
    监听主定制流程的完成状态
    完成：如果有增量则开始增量服务
         如果没有增量则开始文件上传
    未完成：则关闭
    */
    watch(
      () => props.customState,
      (flag) => {
        if (flag) {
          if (hasIncrement.value) {
            setIncrementIndex(0);
          } else {
            handleSave();
          }
        } else {
          setIncrementIndex(-1);
        }
      }
    );

    /*
    最后一个增量则直接走保存
    不是最后一个则走下一个增量
    */
    function nextIncrement() {
      if (isLastIncrement.value) {
        handleSave();
      } else {
        next();
      }
    }

    // 关闭
    function handleClose() {
      context.emit("close", false);
    }

    // 开始上传
    function handleSave() {
      context.emit("save", {
        preview: previewWidthBackground.value || props.previewBody,
        increment: queue.value,
        productOptionsValue: productOptionsValue.value,
      });
    }

    return {
      productOptionsValue,
      previewWidthBackground,
      textRenderParams,
      queue,
      hasIncrement,
      incrementData,
      slidesVisible,
      publishVisible,
      backgroundVisible,
      textVisible,
      relatedProductVisible,
      vipVisible,
      isLastIncrement,
      changeSlides,
      changeVip,
      changeRelatedProduct,
      setIncrementIndex,
      handleClose,
      changeBackground,
      setPreviewWidthBackground,
      changeText,
      changePublish,
      next,
      nextIncrement,
    };
  },
};
</script>

<style lang="scss" scoped>
// 下方
.slide-bottom-fade-enter-from,
.slide-bottom-fade-leave-to {
  transform: translate3d(0, -30px, 0);
  opacity: 0;
}
.slide-bottom-fade-leave-from,
.slide-bottom-fade-enter-to {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.slide-bottom-fade-enter-active {
  transition: all 0.3s ease-in-out;
}
.slide-bottom-fade-leave-active {
  transition: all 0.1s ease;
}
</style>