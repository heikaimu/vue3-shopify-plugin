<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 09:42:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-20 17:21:01
-->
<template>
  <MinimePillow :config="config" />
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import MinimePillow from "./lib";
import axios from "axios";

export default {
  components: {
    MinimePillow,
  },

  setup() {
    const state = reactive({
      config: {},
    });

    onMounted(() => {
      axios.get("https://tsback.witemedia.com/api/v1/configure").then((res) => {
        const item = res.data.data.find((item) => item.id === 12);
        if (item) {
          const config = JSON.parse(item.configure);
          config.increment.relatedProduct = [
            {
              id: 2,
              title: "Would You Like To Add A Same Design Doll Keychain?",
              price: 9.99,
              virtualId: 39797718581419,
              thumbnail:
                "https://cdn.shopifycdn.net/s/files/1/0510/1423/8379/files/dollkeychain.png?v=1620469152",
              sideCount: 1,
            },
          ];

          config.skin = "yellow";
          config.productId = 14;
          config.productPrice = 20;
          config.productTitle =
            "My Face Pillow, Custom Pillow, Personalized Photo Pillow Gift Pillow Toy, Hula Dress, Throw Pillow, MiniMe Pillow";

          // 沙滩巾
          // config.hasBg = true;
          // config.bgList = bgList;
          // config.activeBgIndex = 0;

          state.config = config;
        }
      });
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style>
</style>
