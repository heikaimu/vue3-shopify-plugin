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
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

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
  },

  setup() {
    const state = reactive({
      count: 0,
    });

    return {
      ...toRefs(state),
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
}
</style>