<!--
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-05-07 13:04:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-16 16:39:40
-->
<template>
  <div class="file-select">
    <div class="file-select--top border-bottom">
      <base-header
        mainText="文件选择"
        subText="File Select"
        @close="closePlugin"
      />
    </div>

    <div class="file-select--medium">
      <ul class="file-select__list">
        <li class="file-select__item">
          <label class="file-select__card">
            <input
              type="file"
              class="hide-input"
              accept="image/*"
              @change="fileSelect"
            />
            <span class="text">File Select</span>
            <svg viewBox="0 0 30 30">
              <path
                d="M12.2908253,14.0142199 L17.66,18.2328549 L16,21 L20.5857864,16.4142136 C21.366835,15.633165 22.633165,15.633165 23.4142136,16.4142136 L26,18.9998549 L26,21 C26,22.6568542 24.6568542,24 23,24 L7,24 C5.34314575,24 4,22.6568542 4,21 L4,19 L9.75359944,14.0683433 C10.478128,13.4473189 11.5404728,13.4246572 12.2908253,14.0142199 Z"
              />
              <path
                d="M23,6 C24.6568542,6 26,7.34314575 26,9 L26,17 L23.4142136,14.4142136 C22.6742728,13.6742728 21.4987886,13.6353285 20.7130012,14.2973808 L20.5857864,14.4142136 L18.2894897,16.7105103 L17.66,16.2328549 L12.2908253,12.0142199 C11.5873698,11.4615049 10.6097024,11.4468777 9.89324868,11.9589167 L9.75359944,12.0683433 L4,17 L4,9 C4,7.34314575 5.34314575,6 7,6 L23,6 Z M19.3235343,8.67688204 L19.3693019,8.78734891 C19.4537484,9.00872559 19.5,9.24896148 19.5,9.5 C19.5,10.6045695 18.6045695,11.5 17.5,11.5 C17.206478,11.5 16.9277244,11.4367694 16.676882,11.3235343 C16.990763,12.0173023 17.6890114,12.5 18.5,12.5 C19.6045695,12.5 20.5,11.6045695 20.5,10.5 C20.5,9.68901143 20.0173023,8.99076295 19.3235343,8.67688204 L19.3235343,8.67688204 Z"
                fill-opacity="0.3"
              />
            </svg>
          </label>
        </li>
        <li class="file-select__item">
          <label class="file-select__card">
            <input
              type="file"
              class="hide-input"
              accept="image/*"
              capture="camera"
              @change="fileSelect"
            />
            <span class="text">Take A Photo</span>
            <svg viewBox="0 0 30 30" class="red">
              <path
                d="M26,14.4996803 L26,21 C26,22.1045695 25.1045695,23 24,23 L6,23 C4.8954305,23 4,22.1045695 4,21 L4,14.4996803 L10.1002017,14.4990961 C10.0344945,14.8224862 10,15.1572148 10,15.5 C10,18.2614237 12.2385763,20.5 15,20.5 C17.7614237,20.5 20,18.2614237 20,15.5 C20,15.1572148 19.9655055,14.8224862 19.8997983,14.4990961 L26,14.4996803 Z"
              />
              <path
                d="M17.1715729,6 C17.7020059,6 18.2107137,6.21071368 18.5857864,6.58578644 L20,8 L24,8 C25.1045695,8 26,8.8954305 26,10 L26,13 L19.3309172,12.9997031 C18.4663514,11.5053634 16.8505833,10.5 15,10.5 C13.1494167,10.5 11.5336486,11.5053634 10.6690828,12.9997031 L4,13 L4,10 C4,8.8954305 4.8954305,8 6,8 L10,8 L11.4142136,6.58578644 C11.7892863,6.21071368 12.2979941,6 12.8284271,6 L17.1715729,6 Z M21.5,10 L20.5,10 C20.2238576,10 20,10.2238576 20,10.5 C20,10.7454599 20.1768752,10.9496084 20.4101244,10.9919443 L20.5,11 L21.5,11 C21.7761424,11 22,10.7761424 22,10.5 C22,10.2545401 21.8231248,10.0503916 21.5898756,10.0080557 L21.5,10 Z"
                fill-opacity="0.3"
              />
              <circle cx="15" cy="15.5" r="3.5" />
            </svg>
          </label>
        </li>
      </ul>
      <ul class="file-select__list">
        <li class="file-select__item">
          <label class="file-select__card">
            <input type="file" class="hide-input" accept="image/*" />
            <span class="text">第三方</span>
            <svg viewBox="0 0 30 30">
              <path
                d="M12.2908253,14.0142199 L17.66,18.2328549 L16,21 L20.5857864,16.4142136 C21.366835,15.633165 22.633165,15.633165 23.4142136,16.4142136 L26,18.9998549 L26,21 C26,22.6568542 24.6568542,24 23,24 L7,24 C5.34314575,24 4,22.6568542 4,21 L4,19 L9.75359944,14.0683433 C10.478128,13.4473189 11.5404728,13.4246572 12.2908253,14.0142199 Z"
              />
              <path
                d="M23,6 C24.6568542,6 26,7.34314575 26,9 L26,17 L23.4142136,14.4142136 C22.6742728,13.6742728 21.4987886,13.6353285 20.7130012,14.2973808 L20.5857864,14.4142136 L18.2894897,16.7105103 L17.66,16.2328549 L12.2908253,12.0142199 C11.5873698,11.4615049 10.6097024,11.4468777 9.89324868,11.9589167 L9.75359944,12.0683433 L4,17 L4,9 C4,7.34314575 5.34314575,6 7,6 L23,6 Z M19.3235343,8.67688204 L19.3693019,8.78734891 C19.4537484,9.00872559 19.5,9.24896148 19.5,9.5 C19.5,10.6045695 18.6045695,11.5 17.5,11.5 C17.206478,11.5 16.9277244,11.4367694 16.676882,11.3235343 C16.990763,12.0173023 17.6890114,12.5 18.5,12.5 C19.6045695,12.5 20.5,11.6045695 20.5,10.5 C20.5,9.68901143 20.0173023,8.99076295 19.3235343,8.67688204 L19.3235343,8.67688204 Z"
                fill-opacity="0.3"
              />
            </svg>
          </label>
        </li>
      </ul>
    </div>

    <div class="file-select--bottom border-top">
      <base-button type="info" plain>Cancel</base-button>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";

import BaseHeader from "../../components/BaseHeader.vue";
import BaseButton from "../../components/BaseButton.vue";

import localforage from "localforage";

export default {
  components: {
    BaseHeader,
    BaseButton,
  },

  emits: {
    change: null,
    close: null,
  },

  setup(props, context) {
    onMounted(() => {
      localforage.getItem("avatarList").then((res) => {
        console.log(res);
      });
    });

    // 选择文件
    function fileSelect(e) {
      const input = e.target;
      const files = input.files;
      const file = files ? files[0] : null;
      context.emit("change", file);
    }

    // 关闭插件
    function closePlugin() {
      context.emit("close");
    }

    return {
      fileSelect,
      closePlugin,
    };
  },
};
</script>

<style lang="scss" scope>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.file-select {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .file-select--top {
  }
  .file-select--medium {
    padding: 20px;
    flex: 1;
    overflow-y: auto;
    background-color: #f2f2f2;

    .file-select__list {
      @include card-shadow;
      overflow: hidden;
      border-radius: 6px;
      margin-bottom: 0;

      & + .file-select__list {
        margin-top: 10px;
      }
    }

    .file-select__item:last-child .file-select__card {
      border-bottom: none;
    }

    .file-select__card {
      @include flex-row-sb;
      height: 60px;
      padding: 0 15px;
      border-bottom: 1px solid #e7e7e7;
      background-color: #fff;
      cursor: pointer;
      margin-bottom: 0;
      position: relative;

      .hide-input {
        @include pos-absolute;
        visibility: hidden;
      }

      .text {
        font-size: 16px;
        color: $title-color;
      }

      svg {
        width: 30px;
        height: 24px;
        fill: #626ab3;

        &.red {
          fill: $sub-theme-color;
        }
      }
    }
  }
  .file-select--bottom {
    padding: 10px;
  }
}
</style>
