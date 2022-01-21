<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-20 10:41:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-21 10:57:01
-->
<template>
  <div class="color-selector-wrapper">
    <p class="color-title" @click="visible = !visible">
      {{ pluginText.skin_color }}
      <base-icon
        :icon="visible ? 'arrowUp' : 'arrowDown'"
        :size="10"
        color="#ffffff"
      ></base-icon>
    </p>

    <div class="color-selector" v-if="visible">
      <div class="color-selector__item">
        <p class="gender">male:</p>
        <nav class="color-selector__nav">
          <p
            v-for="(item, index) in skinList"
            :id="`menu_skin_${item.name}`"
            class="color-item"
            :class="{ active: item.name === maleSkin }"
            :key="index"
            :style="{ backgroundColor: `${item.color}` }"
            @click="handleChangeSkin('male', item)"
          >
            <base-icon icon="check" :size="16" color="#ff533a"></base-icon>
          </p>
        </nav>
      </div>

      <div class="color-selector__item">
        <p class="gender">female:</p>
        <nav class="color-selector__nav">
          <p
            v-for="(item, index) in skinList"
            :id="`menu_skin_${item.name}`"
            class="color-item"
            :class="{ active: item.name === femaleSkin }"
            :key="index"
            :style="{ backgroundColor: `${item.color}` }"
            @click="handleChangeSkin('female', item)"
          >
            <base-icon icon="check" :size="16" color="#ff533a"></base-icon>
          </p>
        </nav>
      </div>

      <div class="color-selector__item">
        <base-button type="primary" @click="handleConfirm">Confirm</base-button>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref, onMounted, watch } from "vue";
import BaseIcon from "../base/BaseIcon.vue";
import BaseButton from "../base/BaseButton.vue";

const SKIN_OPTIONS = [
  {
    name: "white",
    color: "#faebd5",
  },
  {
    name: "black",
    color: "#986e59",
  },
  {
    name: "yellow",
    color: "#f7d8aa",
  },
];

export default {
  components: {
    BaseIcon,
    BaseButton,
  },

  props: {
    skin: {
      type: String,
      deafult: "",
    },
  },

  emits: {
    change: null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");
    const skinList = ref(SKIN_OPTIONS);
    const maleSkin = ref("");
    const femaleSkin = ref("");
    const visible = ref(false);

    watch(() => props.skin, fullbackSkin, { immediate: true });

    function fullbackSkin() {
      switch (props.skin) {
        case "yellow":
          maleSkin.value = "yellow";
          femaleSkin.value = "yellow";
          break;

        case "white":
          maleSkin.value = "white";
          femaleSkin.value = "white";
          break;

        case "black":
          maleSkin.value = "black";
          femaleSkin.value = "black";
          break;

        case "yellow-male-white-female":
          maleSkin.value = "yellow";
          femaleSkin.value = "white";
          break;

        case "yellow-male-black-female":
          maleSkin.value = "yellow";
          femaleSkin.value = "black";
          break;

        case "white-male-yellow-female":
          maleSkin.value = "white";
          femaleSkin.value = "yellow";
          break;

        case "white-male-black-female":
          maleSkin.value = "white";
          femaleSkin.value = "black";
          break;

        case "black-male-yellow-female":
          maleSkin.value = "black";
          femaleSkin.value = "yellow";
          break;

        case "black-male-white-female":
          maleSkin.value = "black";
          femaleSkin.value = "white";
          break;

        default:
          break;
      }
    }

    // 修改肤色
    function handleChangeSkin(gender, item) {
      if (gender === "male") {
        maleSkin.value = item.name;
      } else if (gender === "female") {
        femaleSkin.value = item.name;
      }
    }

    function handleConfirm() {
      const skin = newSkin();
      context.emit("change", skin);
      visible.value = false;
    }

    function newSkin() {
      if (maleSkin.value === femaleSkin.value) {
        return maleSkin.value;
      } else {
        return `${maleSkin.value}-male-${femaleSkin.value}-female`;
      }
    }

    return {
      pluginText,
      skinList,
      maleSkin,
      femaleSkin,
      visible,
      handleChangeSkin,
      handleConfirm,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.color-selector-wrapper {
  @include flex-row-center;
  padding-left: 10px;
  padding-right: 5px;
  height: 50px;
  background-color: #ffffff;
  margin-right: -5px;
}

.color-selector-wrapper .color-title {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 0;
  padding: 8px 6px;
  border-radius: 4px;
  background-color: $theme-color;
  cursor: pointer;
}

.color-selector-wrapper .color-selector {
  @include pos-absolute(50px, 0, auto, auto, 999);
  display: block;
  padding: 10px;
  border-radius: 0 0 4px 6px;
  background-color: #ffffff;
}

.color-selector-wrapper .color-selector__item {
  @include flex-row-center;
  padding: 4px 0;
  width: 100%;
}

.color-selector-wrapper .color-selector__item .gender {
  font-size: 14px;
  color: #666666;
  width: 50px;
  margin-bottom: 0;
  text-align: right;
}

.color-selector-wrapper .color-selector__nav {
  display: flex;
  padding-left: 4px;
}

.color-selector-wrapper .color-selector .color-item {
  width: 60px;
  height: 40px;
  border-radius: 4px;
  border: 2px solid #fff;
  font-size: 12px;
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  margin-bottom: 0;
  margin-right: 5px;
}

.color-selector-wrapper .color-selector .color-item svg {
  fill: $theme-color;
  display: none;
}

.color-selector-wrapper .color-selector .color-item.active {
  border: 2px solid $theme-color;
}

.color-selector-wrapper .color-selector .color-item.active svg {
  display: block;
}
</style>