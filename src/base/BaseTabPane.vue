<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-29 17:15:39
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-28 16:41:16
-->
<template>
  <div class="base-tab-pane">
    <div class="base-tab-pane__title" @click="handleClick">
      {{ label }}
      <div class="state-icon" :class="{ active: active }">
        <base-icon icon="arrowLeft" :size="12"></base-icon>
      </div>
    </div>
    <div class="base-tab-pane__content" v-if="active">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from "vue";

import BaseIcon from "./BaseIcon.vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
});

const rootTabs = inject("rootTabs");

const index = ref(null);

const active = computed(() => {
  const active = rootTabs.currentName.value === (props.name || index.value);
  return active;
});

const changeTabName = inject("changeTabName");

function handleClick() {
  if (active.value) {
    changeTabName("");
  } else {
    changeTabName(props.name || index.value);
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.base-tab-pane + .base-tab-pane {
  margin-left: 15px;
}
.state-icon {
  @include flex-row-center;
  transform: rotate(-90deg);
  margin-left: 5px;
  position: relative;
  &.active {
    transform: rotate(90deg);
  }
  &::after {
    @include pos-absolute;
    content: "";
    display: block;
  }
}
.base-tab-pane__title {
  @include flex-row-center;
  height: 34px;
  font-size: 14px;
  font-weight: 600;
  color: $title-color;
  cursor: pointer;
}
.base-tab-pane__content {
  @include pos-absolute(auto, 0, 40px, 0);
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 0 12px hsl(0, 0%, 0%, 0.1);
  padding: 6px 12px;
}
</style>