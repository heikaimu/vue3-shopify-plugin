<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-29 13:44:58
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-28 16:46:26
-->
<template>
  <div class="base-tabs">
    <slot />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from "vue";

const props = defineProps({
  activeName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:activeName"]);

const currentName = ref(props.activeName || "0");

provide("changeTabName", changeTabName);

provide("rootTabs", {
  props,
  currentName,
});

onMounted(() => {
  document.addEventListener("click", calcVisible);
});

function calcVisible(e) {
  const activeClassNames = [
    "font__text",
    "font__list",
    "base-tab-pane__title",
    "color__text",
    "color__item",
    "color__list",
    "state-icon",
  ];
  const classList =
    typeof e.target.className === "string"
      ? e.target.className.split(/\s+/)
      : [];
  const isExist = activeClassNames.some((activeName) => {
    return classList.includes(activeName);
  });
  if (isExist) {
    return;
  }
  currentName.value = "";
}

function changeTabName(val) {
  currentName.value = val;
  emit("update:activeName", val);
}
</script>

<style lang="scss" scoped>
.base-tabs {
  width: 100%;
  position: relative;
  display: flex;
  margin-top: 10px;
}
</style>