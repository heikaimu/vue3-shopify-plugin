<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 09:42:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-05 18:00:31
-->
<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 09:42:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-29 10:40:45
-->
<template>
  <MinimePillow
    :config="config"
    :backgroundActiveIndex="backgroundActiveIndex"
    :composingActiveIndex="composingActiveIndex"
    v-if="visible"
    @close="visible = false"
    @complete="complete"
  />
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import MinimePillow from "./lib";
import axios from "axios";

const PLUGIN_TYPE = "PLUG_INTERCEPTION_HEAD_NEW";
const WEBSITE = "TEST";
import { product } from "../shopifyPageConfig";

export default {
  components: {
    MinimePillow,
  },

  setup() {
    const state = reactive({
      config: {},
      visible: false,
      backgroundActiveIndex: 0,
      composingActiveIndex: 0,
    });

    onMounted(async () => {
      state.config = await getConfig();
      state.visible = true;
    });

    function complete(data) {
      console.log(data);
    }

    return {
      ...toRefs(state),
      complete,
    };
  },
};

// 获取配置参数
function getConfig() {
  let config = {};
  const url = `https://sc.globaladput.com/plugins/api/v1/configure?webSite=${WEBSITE}&plugType=${PLUGIN_TYPE}`;

  return new Promise((resolve, reject) => {
    axios.get(url).then((res) => {
      const { status, data } = res.data;
      if (status === "0") {
        const configItem = data[0] || {};
        if (!configItem) {
          return;
        }
        config = JSON.parse(configItem.configure);
        config.website = WEBSITE;
        if (config.sizeList) {
          delete config.sizeList;
        }
        
        getProductConfig(config, product.type);
        topBodyCard(config);

        resolve(config);
      }
    });
  });
}

// 获取当前增量
function getProductConfig(config, type) {
  const currentConfig = config.productTypeConfigList.find(item => item.type === type);
  if (currentConfig) {
    delete config.productTypeConfigList;
  }
  config.currentProductTypeConfig = currentConfig;
  
  const backgroundData = config.currentProductTypeConfig.background.data
  config.currentProductTypeConfig.background.data = backgroundData.map(title => {
    return config.backgroundList.find(item => item.title === title);
  })
  delete config.backgroundList;
  config.currentProductTypeConfig.background.composingList = config.composingList;
  delete config.composingList;
  console.log(config)
}

// 置顶当前身体
function topBodyCard(config) {
  let currentItem = {};
  for (let i = 0; i < config.miniMeData.length; i++) {
    const group = config.miniMeData[i];
    for (let j = 0; j < group.images.length; j++) {
      const image = group.images[j];
      if (String(image.id) === String(getTagID())) {
        currentItem = image;
      }
    }
  }
  const firstGroup = config.miniMeData[0];
  firstGroup.images.unshift(currentItem);
}

// 获取当前TagID
function getTagID() {
  var tags = "{{ product.tags | join:',' }}";
  var optionResult = tags.match(/mini-me-default-\d+/);
  var _number = optionResult && Number(optionResult[0].split("-").pop());
  return isNaN(_number) ? "" : _number;
}
</script>

<style>
</style>
