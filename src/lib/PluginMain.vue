<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-12 16:20:07
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-18 15:57:37
-->
<template>
  <component
    v-bind="$attrs"
    :config="config"
    :dollarSign="dollarSign"
    :language="language"
    :is="currentElementComponent"
  />
</template>

<script>
import { reactive, toRefs, onMounted, provide } from "vue";

import PluginAvatarMultiple from "./plugin-avatar-multiple/PluginAvatarMultiple.vue";
import PluginMinime from "./plugin-minime/MinimePillow.vue";
import { pluginText } from "../language";

export default {
  components: {
    PluginAvatarMultiple,
    PluginMinime,
  },

  props: {
    config: {
      type: Object,
      deafult: null,
    },
    dollarSign: {
      type: String,
      default: "$",
    },
    language: {
      type: String,
      default: "us",
    }
  },

  setup(props) {
    const state = reactive({
      currentElementComponent: "PluginMinime",
    });

    // 国际化
    provide("pluginText", pluginText(props.language));

    onMounted(() => {
      setComp();
    });

    function setComp() {
      const bodyList = props.config.mainData.body.list;
      if (bodyList.length === 0) {
        state.currentElementComponent = "PluginMinime";
      } else {
        const firstConfig = bodyList[0].images[1];
        if (firstConfig.faceList) {
          const faceLength = firstConfig.faceList.length;
          if (faceLength > 1) {
            state.currentElementComponent = "PluginAvatarMultiple";
          } else {
            state.currentElementComponent = "PluginMinime";
          }
        } else {
          state.currentElementComponent = "PluginMinime";
        }
      }
    }

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
</style>