<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-23 15:22:48
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-26 10:41:09
-->
<template>
  <div class="files-uploader-wrapper">
    <div class="upload-progress-wrapper">
      <div class="progress">
        <span class="line green" :style="{ width: `${percent}%` }">
          <span class="percent">{{ percent }}%</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";

import { uploadFile } from "../../api/upload";
import { dataURLtoBlob, getRandomID } from "../../utils/image";
import Progress from "../../utils/progress";

export default {
  props: {
    files: {
      type: Array,
      deafult: () => [],
    },
    website: {
      type: String,
      deafult: ''
    }
  },

  emits: {
    complete: null,
  },

  setup(props, context) {
    const state = reactive({
      progress: null,
      percent: 0,
      uploadRes: {},
      time: "",
    });

    onMounted(() => {
      getNowTime();
      startUpload();
      state.progress = new Progress({
        parts: props.files.length,
        speed: 500,
        onProgress: (val) => {
          state.percent = val;
        },
        onComplete: () => {
          context.emit("complete", state.uploadRes);
        },
      });
      state.progress.start();
    });

    // 获取当前时间
    function getNowTime() {
      const time = new Date();
      const year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;
      state.time = `${year}${month}${day}`;
    }

    // 文件上传
    function startUpload() {
      for (const item of props.files) {
        upload(item);
      }
    }

    function upload(item) {
      const { name, url } = item;
      uploadFile({
        name: `${state.time}_${props.website}_${name}_${getRandomID()}.jpg`,
        file: url ? dataURLtoBlob(url) : null,
        onSuccess: (res) => {
          state.uploadRes[item.name] = res;
          state.progress.next();
        },
        onError: () => {
          state.progress.next();
        },
      });
    }

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.files-uploader-wrapper {
  @include flex-row-center;
  @include pos-absolute(0, 0, 0, 0, 1992);
  background-color: #ffffff;
}
.upload-progress-wrapper {
  width: 200px;

  .progress {
    height: 20px;
    background: #ebebeb;
    border-radius: 10px;
    overflow: hidden;
    display: flex;

    .line {
      position: relative;
      margin: 0 -1px;
      min-width: 0;
      height: 100%;
      transition: 0.3s;
      background-image: linear-gradient(180deg, #f0f0f0 0, #dbdbdb 70%, #ccc);
      box-shadow: inset 0 1px hsla(0, 0%, 100%, 0.3),
        0 1px 2px rgba(0, 0, 0, 0.2);
      text-align: right;

      &.green {
        background: #85c440;
        border-color: #78b337 #6ba031 #568128;
        background-image: linear-gradient(
          180deg,
          #b7dc8e 0,
          #99ce5f 70%,
          #85c440
        );
      }

      &::before {
        @include pos-absolute;
        content: "";
        height: 100%;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAASUlEQVQ4je3RMQ7AIBADwTnK+/9bqVMmoUBAqCJcWZa1zQYS1Z189OE9vLMEaUHLENSYOff22AGBsgOCLDPn3n6sHWtfIf5t7QLBYTNAaHlxVQAAAABJRU5ErkJggg==")
          0 0 repeat-x;
        border-radius: 10px;
        animation: animate 0.5s linear infinite;
      }
      @keyframes animate {
        0% {
          background-position: 0px;
        }

        100% {
          background-position: 12px;
        }
      }

      .percent {
        display: block;
        height: 20px;
        padding: 0 8px;
        font-size: 12px;
        font-weight: 700;
        color: $context-color;
        color: rgba(0, 0, 0, 0.7);
        text-shadow: 0 1px hsla(0, 0%, 100%, 0.4);
        line-height: 20px;
      }
    }
  }
}
</style>