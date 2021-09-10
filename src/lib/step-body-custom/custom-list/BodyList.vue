<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 16:32:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-12 14:43:01
-->
<template>
  <div class="body-wrapper" ref="bodyContainer">
    <div ref="bodyContent">
      <base-row :gutter="10">
        <base-col
          :span="12"
          v-for="item in pageList"
          :key="item.id"
          class="body-card-row"
        >
          <body-card
            :data="item"
            :skin="skin"
            :avatar="avatar"
            @click="handleClick(item)"
          ></body-card>
        </base-col>
      </base-row>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted, watch, nextTick } from "vue";

import BaseRow from "../../../base/BaseRow.vue";
import BaseCol from "../../../base/BaseCol.vue";
import BodyCard from "./BodyCard.vue";
import { clearRenderer } from "../../../utils/minimeRenderer";
import { debounce, throttle } from "lodash";

export default {
  components: {
    BaseRow,
    BaseCol,
    BodyCard,
  },

  props: {
    avatar: {
      type: Object,
      deafult: () => {},
    },
    list: {
      type: Array,
      default: () => [],
    },
    skin: {
      type: String,
      default: "",
    },
  },

  emits: {
    select: null,
  },

  setup(props, context) {
    const state = reactive({
      // 当前页数据
      pageList: [],
      pageSize: 10,
      pageNumber: 1,
    });

    // 实力化滚动插件
    const bodyContainer = ref(null);
    const bodyContent = ref(null);

    onMounted(() => {
      bodyContainer.value.addEventListener(
        "scroll",
        throttle(scrollContainer, 100)
      );
    });

    function scrollContainer() {
      const { height: containerHeight } = bodyContainer.value.getBoundingClientRect();
      const { height: contentHeight } = bodyContent.value.getBoundingClientRect();
      const isScrollToEnd = contentHeight < containerHeight + bodyContainer.value.scrollTop + 100;
      if (isScrollToEnd) {
        if (!isFinished()) {
          state.pageNumber += 1;
          addPageList();
        } else {
          // console.log('到底了')
        }
      }
    }

    function isFinished() {
      const totalPage = Math.ceil(props.list.length / state.pageSize);
      return state.pageNumber >= totalPage;
    }

    // 添加一页对应页码的数据
    function addPageList() {
      const startIndex = (state.pageNumber - 1) * state.pageSize;
      const endIndex = state.pageNumber * state.pageSize;
      const currentPageList = props.list.slice(startIndex, endIndex);
      state.pageList.push(...currentPageList);
    }

    // 当传入的列表发生变化的时候，重制列表数据
    watch(
      () => props.list,
      debounce(() => {
        initList();
      }, 300),
      {
        deep: true,
      }
    );

    // 初始化列表数据
    function initList() {
      // 容器初始化
      bodyContent && bodyContent.value.scrollIntoView({ block: "start", inline: "nearest" });

      // 渲染器初始化
      clearRenderer();
      
      // 列表初始化
      state.pageList = [];
      state.pageNumber = 1;
      addPageList();
    }

    // 点击卡片
    function handleClick(item) {
      context.emit("select", {
        ...item,
        skin: props.skin,
      });
    }

    return {
      ...toRefs(state),
      bodyContainer,
      bodyContent,
      handleClick,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.body-wrapper {
  @include pos-absolute(10px, 0, 10px, 0);
  padding: 0 10px;
  overflow-x: hidden;
  overflow-y: auto;
  /*解决ios上滑动不流畅*/
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    // 滚动条
    // display: none;
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 2px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #535353;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    background: #ededed;
  }

  .body-group__title {
    padding: 10px 0;
    font-size: 16px;
    color: $title-color;
  }

  .body-card-row {
    margin-bottom: 20px;
  }
}
</style>