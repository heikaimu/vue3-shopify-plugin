<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-16 16:34:21
-->
<template>
  <div class="increment-wrapper">
    <div class="increment-blank" @click="handleClose"></div>
    <div class="increment-text">
      <span class="close-icon">
        <base-icon icon="close" @click="handleClose" />
      </span>

      <div class="text-wrapper">
        <div class="text__preview">
          <img class="img" :src="data.url" alt="" srcset="" />
        </div>
        <p class="desc">{{ data.desc }}</p>
        <div class="text-switch">
          <p
            v-for="item in switchTextList"
            :key="item.value"
            class="switch__text"
            :class="{ active: item.value === activeValue }"
            @click="handleSwitch(item.value)"
          >
            {{ item.label }}
          </p>
        </div>
        <div class="input-wrapper" v-if="activeValue === 'yes'">
          <p class="text-length">Text Title {{ text.length }} | 15</p>
          <input
            type="text"
            class="text-input"
            maxlength="15"
            placeholder="custom text"
            v-model="text"
          />
        </div>
      </div>

      <div class="add-to-cart">
        <base-button type="primary" size="large" @click="handleNext(true)">{{
          addToCartText
        }}</base-button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, toRaw, onMounted, watch } from "vue";

import BaseNotice from "../../../components/BaseNotice.vue";
import BaseButton from "../../../components/BaseButton.vue";
import BaseIcon from "../../../components/BaseIcon.vue";

export default {
  components: {
    BaseNotice,
    BaseButton,
    BaseIcon,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    value: {
      type: String,
      default: "",
    },
  },

  emits: {
    change: null,
    close: null,
    next: null,
  },

  setup(props, context) {
    const state = reactive({
      text: "",
      switchTextList: [
        {
          label: "Yes, please",
          value: "yes",
        },
        {
          label: "No, thanks",
          value: "no",
        },
      ],
      activeValue: "no",
    });

    const addToCartText = computed(() => {
      if (state.activeValue === "yes" && state.text !== "") {
        return `Add To Cart +$${props.data.price}`;
      } else {
        return `Add To Cart`;
      }
    });

    onMounted(() => {
      state.text = props.value;
    });

    watch(
      () => state.text,
      (val) => {
        context.emit("change", val);
      }
    );

    // 清空
    function handleClear() {
      state.text = "";
      context.emit("change", "");
    }

    // 选择
    function handleSwitch(val) {
      state.activeValue = val;
      if (val === "no") {
        handleClear();
      }
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
      addToCartText,
      handleSwitch,
      handleClear,
      handleClose,
      handleNext,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.increment-wrapper {
  @include pos-absolute(0, 0, 0, 0, 1000);
  .increment-blank {
    @include glass;
    @include pos-absolute(0, 0, 0, 0, 1001);
    cursor: pointer;
  }

  .increment-text {
    @include pos-absolute(auto, 0, 0, 0, 1002);
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;

    .close-icon {
      @include pos-absolute(20px, auto, auto, 20px, 1004);
      cursor: pointer;
    }

    .text-wrapper {
      padding: 140px 20px 20px 20px;
      .text__preview {
        @include flex-col-center;
        @include pos-absolute(-120px, auto, auto, 50%, 1003);
        transform: translate3d(-50%, 0, 0);
        width: 100%;
        height: 240px;
        .img {
          @include card-shadow-lg;
          display: block;
          width: 240px;
          height: 240px;
          object-fit: contain;
          padding: 2px;
          background: #fff;
          border-radius: 10px;
        }
      }
      .desc {
        font-size: 16px;
        color: $title-color;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .text-switch {
        display: flex;
        .switch__text {
          @include flex-row-center;
          width: 90px;
          height: 30px;
          border-radius: 4px;
          border: 1px solid #cccccc;
          margin-bottom: 0;
          font-size: 12px;
          color: $context-color;
          margin-right: 10px;
          cursor: pointer;
          &.active {
            font-weight: 600;
            color: $title-color;
            border: 1px solid $theme-color;
          }
        }
      }
      .input-wrapper {
        // @include flex-row-sb;
        .text-input {
          padding: 0 10px;
          width: 100%;
          height: 40px;
          border: 1px solid #cccccc;
          border-radius: 4px;
          font-size: 14px;
          color: $context-color;
        }
        .price {
          width: 100%;
          font-size: 14px;
          color: $sub-theme-color;
          font-weight: 600;
          text-align: left;
        }
        .text-length {
          padding-top: 20px;
          font-size: 12px;
          color: $sub-theme-color;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .clear {
          width: 100%;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-align: right;
          &:hover {
            color: $sub-theme-color;
          }
        }
      }
    }

    .add-to-cart {
      padding: 0 20px 20px 20px;
    }
  }
}
</style>