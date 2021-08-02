<!--
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-05-07 13:04:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-30 16:24:17
-->
<template>
  <div class="file-select">
    <div class="file-select__top border-bottom">
      <base-header
        mainText="Choose Photos Source"
        @close="closePlugin"
      />
    </div>

    <div class="file-select__medium">
      <ul class="file-select__list">
        <li class="file-select__item">
          <label class="file-select__card">
            <input
              type="file"
              class="hide-input"
              accept="image/*"
              @change="handleSelectFile"
            />
            <span class="text">Choose from your album</span>
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
        <li class="file-select__item" v-if="isMobile">
          <label class="file-select__card">
            <input
              type="file"
              class="hide-input"
              accept="image/*"
              capture="camera"
              @change="handleSelectFile"
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
          <label class="file-select__card" @click="handleOpenFilestack">
            <div class="third-card-wrapper">
              <div class="svg">
                <svg viewBox="0 0 20 20" fill="#3a559f">
                  <path
                    d="M0,0 L0,19.9881579 L10.6449123,19.9881579 L10.6449123,12.2671491 L8.0427193,12.2671491 L8.0427193,9.1152193 L10.6449123,9.1152193 L10.6449123,6.46815789 C10.6449123,4.54302632 12.2055263,2.98241228 14.1306579,2.98241228 L16.8510526,2.98241228 L16.8510526,5.81671053 L14.9044737,5.81671053 C14.2927632,5.81671053 13.7968421,6.31263158 13.7968421,6.92434211 L13.7968421,9.11526316 L16.8021491,9.11526316 L16.3867982,12.267193 L13.7968421,12.267193 L13.7968421,19.9881579 L19.9881579,19.9881579 L19.9881579,0 L0,0 Z"
                  ></path></svg
                ><svg viewBox="0 0 20 20">
                  <defs>
                    <linearGradient
                      x1="6.71416922%"
                      y1="93.4850191%"
                      x2="93.6081727%"
                      y2="6.61873642%"
                      id="linearGradient"
                    >
                      <stop stop-color="#FFDD55" offset="0%"></stop>
                      <stop stop-color="#FF543E" offset="50%"></stop>
                      <stop stop-color="#C837AB" offset="100%"></stop>
                    </linearGradient>
                  </defs>
                  <g
                    transform="translate(-157.000000, -13.000000)"
                    fill="url(#linearGradient)"
                  >
                    <g transform="translate(127.500000, 13.000000)">
                      <g transform="translate(30.000000, 0.000000)">
                        <path
                          d="M1.30459402,1.38853951 C2.91575695,-0.281700506 4.69986957,0.0129405025 12.4412887,0.0310898193 L13.2784278,0.0318822438 C15.6615614,0.036036124 15.7546266,0.0559747488 16.2191216,0.123267607 C18.2457823,0.414869995 19.7838507,1.85460486 19.9799524,4.35274839 C20.0065424,4.68672036 20.0065424,15.3131766 19.9807833,15.6405024 C19.7963148,17.9857831 18.4468695,19.3308095 16.7883149,19.7586592 C15.5460608,20.0801695 4.52448339,20.0801695 3.28056742,19.7603207 C-0.702955065,18.7309892 0.058185235,14.3586149 0.058185235,9.99704077 C0.058185235,4.74487468 -0.262557293,3.01602976 1.30459402,1.38853951 Z M10.3441115,2.6390034 L10.0277937,2.63968821 C7.01065345,2.63968821 4.14557512,2.37134755 3.0512282,5.17937055 C2.62578734,6.27091252 2.6589099,7.66932993 2.66427878,9.62812294 L2.66484148,10.0020254 C2.66484148,11.8945332 2.60418292,13.6732247 3.0512282,14.8238495 C4.11357273,17.5575966 6.87661246,17.3766635 9.78358431,17.3648864 L10.0261318,17.3643626 C12.9153073,17.3643626 15.8942243,17.6651036 17.0018663,14.8238495 C17.4280892,13.7213609 17.3942766,12.3421692 17.3888238,10.3773644 L17.388253,10.0020254 C17.388253,7.12587879 17.5469624,5.26909436 16.1518155,3.87505217 C14.7935495,2.51705289 12.9751018,2.62842726 10.3441115,2.6390034 Z M16.0205271,12.9745421 C15.8668937,16.3367469 13.3586609,16.0488865 10.2375851,16.0347819 L10.0286246,16.0342902 C4.25244668,16.0342902 4.000052,15.8715973 3.99365315,10.2654954 L3.99351325,9.99870232 C3.99351325,4.06280756 4.45883919,3.96976064 9.36802794,3.96477599 L9.36802794,3.96643754 C15.6615614,3.95646823 16.4625868,3.25695481 16.0205271,12.9745421 Z M10.0277937,6.22116369 C7.93964347,6.22116369 6.24702033,7.91428525 6.24702033,10.0020254 C6.24702033,12.0897656 7.93964347,13.7820564 10.0277937,13.7820564 C12.1159438,13.7820564 13.807736,12.0897656 13.807736,10.0020254 C13.807736,7.91428525 12.1159438,6.22116369 10.0277937,6.22116369 Z M10.0277937,7.54791302 C13.2726112,7.54791302 13.2767659,12.4561378 10.0277937,12.4561378 C6.78380705,12.4561378 6.77882142,7.54791302 10.0277937,7.54791302 Z M13.958136,5.18850908 C13.4703747,5.18850908 13.0748477,5.58395848 13.0748477,6.07162401 C13.0748477,6.55928954 13.4703747,6.95473893 13.958136,6.95473893 C14.4458973,6.95473893 14.8414244,6.55928954 14.8414244,6.07162401 C14.8414244,5.58395848 14.4458973,5.18850908 13.958136,5.18850908 Z"
                        ></path>
                      </g>
                    </g>
                  </g></svg
                ><svg viewBox="0 0 21 18">
                  <g transform="translate(-187.000000, -14.000000)">
                    <g transform="translate(127.500000, 13.000000)">
                      <g transform="translate(60.000000, 0.000000)">
                        <g transform="translate(0.000000, 1.049479)">
                          <g
                            transform="translate(0.000000, 0.117187)"
                            fill="#59C36A"
                          >
                            <path
                              d="M9.97636719,5.02527344 L5.82796875,12.2205859 L5.81625,12.2205859 L8.21859375,15.1502734 L2.82800781,17.4119922 C2.7225,17.3533984 2.64046875,17.2713672 2.59363281,17.1893359 L0.06234375,12.5018359 C-0.0665625,12.2439844 0.0389453125,12.0448047 0.0740625,11.9276172 L6.85925781,0.208867187 C6.90609375,0.138554687 6.97640625,0.0682421875 7.07019531,0.009609375 L7.08191406,0.009609375 L10.5623438,1.08777344 L9.97636719,5.02527344 Z"
                            ></path>
                          </g>
                          <path
                            d="M19.988125,12.3378125 L15.2889063,15.2675 L14.175625,12.3378125 L9.97640625,5.1425 L7.081875,0.126796875 C7.16382813,0.068203125 7.26933594,0.0330859375 7.363125,0.0330859375 L12.6287109,0.0330859375 C12.7459375,0.068203125 12.9803125,0.056484375 13.1326172,0.326054688 L19.9178125,12.0448047 C19.9646484,12.126875 19.988125,12.2323047 19.988125,12.3378125 Z"
                            fill="#FFDA2D"
                          ></path>
                          <path
                            d="M13.1325781,0.32609375 C12.9803125,0.0565234375 12.7458984,0.0682421875 12.6286719,0.033125 L9.97636719,0.033125 L9.97636719,5.1425 L14.1755859,12.3378125 L15.2888672,15.2675 L19.9880859,12.3378125 C19.9880859,12.2323047 19.9646094,12.126875 19.9177734,12.0448437 L13.1325781,0.32609375 Z"
                            fill="#FDBF00"
                          ></path>
                          <path
                            d="M19.988125,12.3378125 C19.988125,12.4432422 19.9646484,12.54875 19.9295313,12.6190625 L17.3982422,17.3065625 C17.3044531,17.4589062 17.081875,17.61125 16.8826172,17.61125 L3.10921875,17.61125 C3.01542969,17.61125 2.90996094,17.5760547 2.82796875,17.5292187 L5.81625,12.3378125 L19.988125,12.3378125 Z"
                            fill="#4086F4"
                          ></path>
                          <path
                            d="M9.97636719,17.61125 L16.8826172,17.61125 C17.081875,17.61125 17.3044922,17.4589062 17.3982422,17.3065625 L19.9295312,12.6190625 C19.9646484,12.54875 19.988125,12.4432422 19.988125,12.3378125 L9.97636719,12.3378125 L9.97636719,17.61125 L9.97636719,17.61125 Z"
                            fill="#4175DF"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <span class="text">Choose from Online Services</span>
            </div>
          </label>
        </li>
      </ul>
      <!-- 缓存文件选择列表 -->
      <avatar-list-cache @select="selectCacheFile" />
    </div>

    <div class="file-select__bottom">
      <base-button type="info" plain @click="closePlugin">Cancel</base-button>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";

import BaseHeader from "../../components/BaseHeader.vue";
import BaseButton from "../../components/BaseButton.vue";
import AvatarListCache from "./AvatarListCache.vue";

import localforage from "localforage";
import { blobToDataURL } from "../../utils/image";

export default {
  components: {
    BaseHeader,
    BaseButton,
    AvatarListCache,
  },

  emits: {
    change: null,
    close: null,
    selectCache: null,
  },

  setup(props, context) {

    const state = reactive({
      isMobile: false
    })

    onMounted(() => {
      state.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    })

    // 选择文件
    function handleSelectFile(e) {
      const input = e.target;
      const files = input.files;
      const file = files ? files[0] : null;
      context.emit("change", file);
    }

    // 选择缓存文件
    function selectCacheFile(item) {
      context.emit("selectCache", item);
    }

    // 打开filestack
    /**global filestack*/
    function handleOpenFilestack() {
      const client = filestack.init("AvKLw5hsbQm2sVOtawSNgz");
      const options = {
        fromSources: ["googledrive", "instagram", "facebook"],
        accept: ["image/*"],
        maxFiles: 1,
        transformations: {
          crop: true,
          circle: false,
          rotate: true,
        },
        onOpen: function (res) {
          setTimeout(() => {
            // document.querySelector('fsp-mobile-menu').click();
            // console.log(document.getElementById('__filestack-picker'))
            // TODO
          }, 1000);
        },
        onUploadDone: function (res) {
          const url = res.filesUploaded[0].url;
          fetch(url)
            .then((response) => response.blob())
            .then(async (blob) => {
              const newURL = await blobToDataURL(blob);
            });
        },
      };
      client.picker(options).open();
    }

    // 关闭插件
    function closePlugin() {
      context.emit("close");
    }

    return {
      ...toRefs(state),
      handleSelectFile,
      selectCacheFile,
      handleOpenFilestack,
      closePlugin,
    };
  },
};
</script>

<style lang="scss" scope>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.file-select {
  @include flex-col-sb;
  width: 100%;
  height: 100%;
  .file-select__top {
    width: 100%;
  }
  .file-select__medium {
    width: 100%;
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
    .third-card-wrapper {
      @include flex-col-center;
      width: 100%;
      .svg {
      }
      .text {
        font-size: 14px;
        color: $title-color;
        line-height: 1;
      }
    }
  }
  .file-select__bottom {
    width: 100%;
    padding: 10px;
    background-color: #f2f2f2;
  }
}
</style>
