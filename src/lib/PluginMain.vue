<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-12 16:20:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-01-27 09:56:35
-->
<template>
  <component
    v-bind="$attrs"
    :config="config"
    :dollarSign="dollarSign"
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
    provide("language", props.language);
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