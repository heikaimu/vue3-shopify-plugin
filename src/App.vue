<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 09:42:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-16 13:07:35
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
  <div>
    <MinimePillow
      :config="config"
      :sizeActiveName="sizeActiveName"
      :backgroundActiveName="backgroundActiveName"
      v-if="visible"
      @close="visible = false"
      @complete="complete"
    />
    <el-button @click="handleOpen">打开</el-button>
    <el-button @click="handleChangeColor">变色</el-button>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import MinimePillow from "./lib";
import axios from "axios";

const PLUGIN_TYPE = "PLUG_BODY_CUSTOM";
const WEBSITE = "TEST";
import { product } from "../shopifyPillowConfig";

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
      sizeActiveName: '30" x 40"',
      backgroundActiveName: "Yellow",
    });

    onMounted(async () => {
      state.config = await getConfig();
    });

    function complete(data) {
      console.log(data);
    }

    async function handleOpen() {
      state.visible = true;
    }

    function handleChangeColor() {
      state.config.defaultSkin = "black";
    }

    return {
      ...toRefs(state),
      complete,
      handleOpen,
      handleChangeColor,
    };
  },
};

// 获取配置参数
function getConfig() {
  let config = {};
  const url = `https://sback.globalhot.shop/plugins/api/v1/configure?webSite=${WEBSITE}&plugType=${PLUGIN_TYPE}`;

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
        config.defaultSkin = "yellow";
        config.skuList = getSKUlist(product);
        config.productOptionsValue = {
          Type: 'Single Side',
          Size: '20cm-8\"',
        };
        
        getProductConfig(config, product.type);
        topBodyCard(config);

        resolve(config);
      }
    });
  });
}

// 获取当前增量
function getProductConfig(config, type) {
  const currentConfig = config.productTypeConfigList.find(
    (item) => item.type === type
  );

  if (!currentConfig) {
    config.currentProductTypeConfig = {};
    return;
  }

  config.currentProductTypeConfig = currentConfig;
  // background
  config.currentProductTypeConfig.background.data = (
    config.currentProductTypeConfig.background.data || []
  ).map((title) => {
    return config.backgroundList.find((item) => item.title === title);
  });
  // composing
  config.currentProductTypeConfig.background.composingList = (
    config.currentProductTypeConfig.background.composing || []
  ).map((title) => {
    return config.composingList.find((item) => item.title === title);
  });
}

// 获取SKU list
function getSKUlist(product) {
  const typeKeys = product.options.map((key) => {
    const arr = key.split(/[\:\?]/);
    return arr[0] ? arr[0] : "";
  });
  const list = [];
  for (const variant of product.variants) {
    const { price, options, id, sku } = variant;

    const obj = {
      price,
      id,
      sku,
      options: {},
    };

    for (let i = 0; i < typeKeys.length; i++) {
      const key = typeKeys[i];
      obj.options[key] = options[i];
    }

    list.push(obj);
  }
  return list;
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
