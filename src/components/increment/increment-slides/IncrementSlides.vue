<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-30 15:00:16
-->
<template>
  <base-glass-dialog :visible="true" @close="handleClose">
    <div class="increment-slides">
      <div class="preview-image">
        <img :src="customBodyPreviewURL" alt="" />
      </div>
      <p class="custom-title">
        {{ pluginText.slide_text1 }}<br />{{ pluginText.slide_text2 }}
        <strong>+{{ dollarSign }}5.00</strong>
      </p>
      
      <base-button-radio :options="list" v-model:value="curValue" @change="handleSelect"></base-button-radio>

      <div class="bottom-button">
        <base-button
          type="primary"
          size="large"
          @click="handleNext"
          id="button_add_to_cart_1"
          >{{ pluginText.add_cart }}</base-button
        >
      </div>
    </div>
  </base-glass-dialog>
</template>

<script>
import { reactive, toRefs, inject, onMounted, watch } from "vue";

import BaseButtonRadio from "../../../base/BaseButtonRadio.vue";
import BaseButton from "../../../base/BaseButton.vue";
import BaseGlassDialog from "../../../base/BaseGlassDialog.vue";

export default {
  components: {
    BaseButtonRadio,
    BaseGlassDialog,
    BaseButton,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    customBodyPreviewURL: {
      type: String,
      default: "",
    },
    data: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: "",
    },
    dollarSign: {
      type: String,
    },
  },

  emits: {
    change: null,
    close: null,
    next: null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    const state = reactive({
      list: [],
      curValue: ''
    })


    watch(() => props.value, (val) => {
      state.curValue = val;
    }, {
      immediate: true
    })

    onMounted(() => {
      state.list = getList();
    })

    // 选择面
    function handleSelect(val) {
      context.emit("change", val);
    }

    // 获取列表
    function getList() {
      return props.data.map(item => {
        return {
          label: item.title,
          value: item.value,
          price: item.price ? `+${props.dollarSign}${item.price}` : "",
        }
      });
    }

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 前往下一步
    function handleNext() {
      context.emit("next");
    }

    return {
      ...toRefs(state),
      pluginText,
      handleSelect,
      handleClose,
      handleNext,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.increment-slides {
  padding: 0 20px 20px 20px;
  .preview-image {
    @include flex-row-center;
    width: 100%;
    height: 200px;
    img {
      width: 180px;
      height: 180px;
      object-fit: contain;
    }
  }

  .custom-title {
    padding: 0 10px 10px 10px;
    text-align: center;
    font-size: 15px;
    color: $title-color;
    strong {
      font-weight: 600;
      color: $theme-color;
    }
  }

  .slides-selector {
    padding: 20px;
    .slides-selector__item {
      width: 100%;
      padding: 20px 0;
      border-radius: 6px;
      box-shadow: 0 0 0 1px $theme-color;
      text-align: center;
      cursor: pointer;
      position: relative;
      & + .slides-selector__item {
        margin-top: 15px;
      }

      .text {
        font-size: 16px;
        color: $theme-color;
      }
      .price {
        @include pos-absolute(-13px, auto, auto, 50%);
        transform: translateX(-50%);
        font-size: 12px;
        font-weight: 700;
        padding: 5px 10px;
        color: $theme-color;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 0 0 1px $theme-color;
      }
      .icon {
        @include pos-absolute(50%, 20px, auto, auto);
        transform: translate3d(0, -50%, 0);
      }

      &.active {
        background-color: rgba(255, 83, 58, 0.1);
        box-shadow: 0 0 0 2px $theme-color;
        .text {
          font-weight: 600;
        }
      }
    }
  }
}
</style>