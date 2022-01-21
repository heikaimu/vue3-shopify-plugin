<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-21 10:28:50
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

      <!-- <base-button-radio :options="list" v-model:value="curValue" @change="handleSelect"></base-button-radio> -->

      <div class="bottom-button">
        <base-confirm-button-group
          :confirmText="confirmText"
          :cancelText="cancelText"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        ></base-confirm-button-group>
        <!-- <base-button
          type="primary"
          size="large"
          @click="handleNext"
          id="button_add_to_cart_1"
          >{{ pluginText.add_cart }}</base-button
        > -->
      </div>
    </div>
  </base-glass-dialog>
</template>

<script>
import {
  reactive,
  toRefs,
  inject,
  onMounted,
  watch,
  computed,
  nextTick,
} from "vue";

import BaseButtonRadio from "../../../base/BaseButtonRadio.vue";
import BaseButton from "../../../base/BaseButton.vue";
import BaseGlassDialog from "../../../base/BaseGlassDialog.vue";
import BaseConfirmButtonGroup from "../../../base/BaseConfirmButtonGroup.vue";

export default {
  components: {
    BaseButtonRadio,
    BaseGlassDialog,
    BaseButton,
    BaseConfirmButtonGroup,
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
      curValue: "",
    });

    watch(
      () => props.value,
      (val) => {
        state.curValue = val;
      },
      {
        immediate: true,
      }
    );

    onMounted(() => {
      state.list = getList();
    });

    // 选择面
    // function handleSelect(val) {
    //   context.emit("change", val);
    // }

    // 获取列表
    function getList() {
      return props.data.map((item) => {
        return {
          label: item.title,
          value: item.value,
          price: item.price ? `+${props.dollarSign}${item.price}` : "",
        };
      });
    }

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 前往下一步
    // function handleNext() {
    //   context.emit("next");
    // }

    const confirmText = computed(() => {
      return state.list[0] ? state.list[0].label : "Yes";
    });

    const cancelText = computed(() => {
      return state.list[1] ? state.list[1].label : "No";
    });

    async function handleConfirm() {
      const val = state.list[0] ? state.list[0].value : "";
      context.emit("change", val);
      await nextTick();
      context.emit("next");
    }

    async function handleCancel() {
      const val = state.list[1] ? state.list[1].value : "";
      context.emit("change", val);
      await nextTick();
      context.emit("next");
    }

    return {
      ...toRefs(state),
      pluginText,
      confirmText,
      cancelText,
      // handleSelect,
      handleClose,
      // handleNext,
      handleConfirm,
      handleCancel,
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

  .bottom-button {
  }
}
</style>