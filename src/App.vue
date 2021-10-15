<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 09:42:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-13 11:07:36
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

    <input
      type="file"
      class="hide-input"
      accept="image/*"
      @change="handleSelectFile"
    />
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import MinimePillow from "./lib";
import axios from "axios";

const PLUGIN_TYPE = "PLUG_BODY_CUSTOM";
const WEBSITE = "M";
import { product } from "../shopifyPuzzleConfig";

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
      backgroundActiveName: "Green",
    });

    onMounted(async () => {
      state.config = await getConfig();
    });

    function complete(data) {
      console.log(data)
      window.open(data.files.Preview);
    }

    async function handleOpen() {
      state.visible = true;
    }

    function handleChangeColor() {
      state.config.defaultSkin = "black";
    }

    function handleSelectFile(e) {
      const input = e.target;
      const files = input.files;
      const file = files ? files[0] : null;

      const url =
        "https://faceonboxer.s3.us-west-1.amazonaws.com/customerpics/11111.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210818T023607Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1799&X-Amz-Credential=AKIAW6ATM4SRCICTIFIS%2F20210818%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=d0c6de575898c1f3d31b56145ba5fa27a69517297de1fd154ecdb1007f9a9ee3";

      const header = {
        headers: {
          "Content-Type": file.type,
          // "X-Amz-Acl": "public-read",
          "X-Amz-Server-Side-Encryption": "AES256",
        },
      };

      axios
        .put(url, file, header)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return {
      ...toRefs(state),
      complete,
      handleOpen,
      handleChangeColor,
      handleSelectFile,
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
          Size: '30" x 40"',
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
    console.error(`当前产品分类${type}不正确，请填写正确的分类后重试`);
    return;
  }

  config.currentProductTypeConfig = currentConfig;

  // body
  const { custom, list: bodyList } = config.currentProductTypeConfig.body;
  if (custom) {
    for (let i = config.miniMeData.length - 1; i >= 0; i--) {
      const group = config.miniMeData[i];
      for (let j = group.images.length - 1; j >= 0; j--) {
        const item = group.images[j];
        if (!bodyList.includes(item.index)) {
          group.images.splice(j, 1);
        }
      }
      if (group.images.length === 0) {
        config.miniMeData.splice(i, 1);
      }
    }
  } else {
    config.miniMeData = [];
  }

  // 便利所有身体配置，创建faceList
  for (const group of config.miniMeData) {
    for (const item of group.images) {
      item.faceList = item.faceList ? item.faceList : [item.face];
    }
  }

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
  if (config.miniMeData.length === 0) {
    return;
  }

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
