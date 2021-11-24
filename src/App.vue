<template>
  <div class="wrapper">
    <div class="left">
      <ul class="nav__list">
        <li class="nav__item" v-for="item in products" :key="item.id">
          <p
            class="text"
            :class="{ active: item.product.type === activeType }"
            @click="openProductPlugin(item)"
          >
            {{ item.product.type }}
          </p>
        </li>
      </ul>

      <BaseImages :list="images" />
    </div>
    <div class="right">
      <MinimePillow
        :config="config"
        language="de"
        :isManagementUse="false"
        :sizeActiveName="sizeActiveName"
        :backgroundActiveName="backgroundActiveName"
        v-if="visible"
        @close="visible = false"
        @complete="complete"
      />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";

// import MinimePillow from "./lib";
import MinimePillow from "minime-pillow";
import "minime-pillow/dist/style.css";

import BaseImages from "./base/BaseImages.vue";
import axios from "axios";
import { configMock } from "./mock/config";

const PLUGIN_TYPE = "PLUG_BODY_CUSTOM";
const WEBSITE = "FT";

import products from "../products/index";

import { getList } from "./api/images";

export default {
  components: {
    MinimePillow,
    BaseImages,
  },

  setup() {
    const state = reactive({
      config: {},
      visible: false,
      backgroundActiveIndex: 0,
      composingActiveIndex: 0,
      sizeActiveName: "",
      backgroundActiveName: "Green",
      products: products,
      activeType: "",
      images: [],
    });

    onMounted(() => {
      state.images = getList(3);
    });

    function complete(data) {
      console.log(data);
      window.open(data.files.Preview);
    }

    async function openProductPlugin(item) {
      state.activeType = item.product.type;
      state.config = await getConfig(item.product, item.publishSize);
      state.visible = true;
    }

    return {
      ...toRefs(state),
      complete,
      openProductPlugin,
    };
  },
};

// 获取配置参数
function getConfig(product, publishSize) {
  // return new Promise((resolve, reject) => {
  //        let config = JSON.parse(configMock[0].configure);
  //       config.website = WEBSITE;
  //       config.defaultSkin = "yellow";
  //       config.skuList = getSKUlist(product);
  //       config.productOptionsValue = {
  //         Size: publishSize,
  //       };

  //       getProductConfig(config, product.type);
  //       topBodyCard(config);

  //       resolve(config);
  // })

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
          Size: publishSize,
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

  // 文字
  config.currentProductTypeConfig.text.value = {
    color: "#111111",
    fontFamily: "Black Ops One",
    text: "wow,wow",
  };
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
.nav__list {
}
.nav__item {
}
.nav__item .text {
  cursor: pointer;
}
.nav__item .text.active {
  color: red;
}
</style>
