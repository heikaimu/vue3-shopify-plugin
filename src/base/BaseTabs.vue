<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-29 13:44:58
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-30 10:41:47
-->
<template>
  <div class="base-tabs">
    <slot />
  </div>
</template>

<script>
import { ref, provide, onMounted } from "vue";

export default {
  name: "BaseTabs",

  props: {
    activeName: {
      type: String,
      default: "",
    },
  },

  setup(props, context) {
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
        "state-icon"
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
      context.emit("update:activeName", val);
    }

    // function calcPaneInstances() {
    //   const defaultSlots = context.slots.default();
    //   if (defaultSlots) {
    //     const paneSlots = defaultSlots.filter(
    //       (vnode) => vnode.type.name === "BaseTabPane"
    //     );
    //     const panes = paneSlots.map(({ type }) => type);
    //     state.panes = panes;
    //   } else {
    //     state.panes = [];
    //   }
    // }

    return {
      currentName,
    };
  },
};
</script>

<style lang="scss" scoped>
.base-tabs {
  width: 100%;
  position: relative;
  display: flex;
  margin-top: 10px;
}
</style>