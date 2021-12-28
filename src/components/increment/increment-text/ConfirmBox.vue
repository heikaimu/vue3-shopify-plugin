<!--
 * @Description: 文字定制咨询
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-27 10:13:14
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-27 16:44:24
-->
<template>
  <div class="text-confirm-box">
    <h2 class="title">Add Text?</h2>

    <p class="desc">
      {{
        data.desc ||
        "80% of customers prefer adding personalised text to make perfect gifts!"
      }}
    </p>

    <div class="button-wrapper">
      <base-button
        v-for="(item, index) in list"
        :id="`button_add_text_${item.value}`"
        :key="index"
        class="switch__text"
        type="primary"
        size="large"
        @click="handleSwitch(item.value)"
      >
        {{ index === 0 ? `${item.label} +${dollarSign}${price}` : item.label }}
      </base-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watch, inject } from "vue";
import BaseButton from "../../../base/BaseButton.vue";
export default {
  components: {
    BaseButton,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    price: {
      type: [Number, String],
    },
    dollarSign: {
      type: String,
    },
  },

  emits: {
    custom: null,
    next: null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    const state = reactive({
      list: [
        {
          label: pluginText.yes_please,
          value: "yes",
        },
        {
          label: pluginText.no_thanks,
          value: "no",
        },
      ],
      value: "no",
    });

    function handleSwitch(val) {
      if (val ==='yes') {
        context.emit('custom', true);
      } else {
        context.emit('custom', false);
      }
    }

    return {
      ...toRefs(state),
      handleSwitch
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";
.text-confirm-box {
  padding: 50px 20px 20px 20px;
  .switch__text {
    margin-top: 15px;
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    color: #333333;
    text-align: center;
  }
  .desc {
    font-size: 16px;
    color: #666666;
    text-align: center;
  }
}
</style>