<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 16:32:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-21 15:06:52
-->
<template>
  <div class="body-wrapper" ref="bodyWrapper">
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
</template>

<script>
import { reactive, toRefs, ref, onMounted, watch, nextTick } from "vue";

import BaseRow from "../../../components/BaseRow.vue";
import BaseCol from "../../../components/BaseCol.vue";
import BodyCard from "./BodyCard.vue";
import BScroll from "better-scroll";

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
      // scroll
      scroll: null,
      // 当前页数据
      pageList: [],
      pageSize: 10,
      pageNumber: 1,
    });

    onMounted(() => {
      if (!state.scroll) {
        initScroll();
      }
    });

    // 实力化滚动插件
    const bodyWrapper = ref(null);
    function initScroll() {
      state.scroll = new BScroll(bodyWrapper.value, {
        probeType: 1,
        mouseWheel: true,
        click: true,
      });

      // 监听滚动到底部事件
      state.scroll.on("scrollEnd", () => {
        if (state.scroll.y <= state.scroll.maxScrollY + 150) {
          state.pageNumber += 1;
          addPageList();
        }
      });
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
      () => {
        state.pageList = [];
        state.pageNumber = 1;
        state.scroll.scrollTo(0, 0);
        addPageList();
      },
      {
        deep: true,
      }
    );

    // 当前卡片数量发生变化的时候，更新scroll插件
    watch(
      () => state.pageList,
      () => {
        nextTick().then(() => {
          if (state.scroll) state.scroll.refresh();
        });
      },
      {
        deep: true,
      }
    );

    // 点击卡片
    function handleClick(item) {
      context.emit("select", {
        ...item,
        skin: props.skin
      });
    }

    return {
      ...toRefs(state),
      bodyWrapper,
      handleClick,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.body-wrapper {
  height: 100%;
  padding: 10px;
  overflow: hidden;

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