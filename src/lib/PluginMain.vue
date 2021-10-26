<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-12 16:20:07
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-26 13:15:09
-->
<template>
  <component v-bind="$attrs" :config="config" :is="currentElementComponent" />
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";

import PluginAvatarMultiple from "./plugin-avatar-multiple/PluginAvatarMultiple.vue";
import PluginMinime from "./plugin-minime/MinimePillow.vue";

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
  },

  setup(props) {
    const state = reactive({
      currentElementComponent: "PluginMinime",
    });

    onMounted(() => {
      if (props.config.miniMeData.length === 0) {
        state.currentElementComponent = "PluginMinime";
      } else {
        const firstConfig = props.config.miniMeData[0].images[1];
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
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
</style>