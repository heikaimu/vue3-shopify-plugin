<template>
  <ul class="button-list">
    <li class="item" v-for="item in buttonList" :key="item.command">
      <div class="card" @click="handle(item.command)">
        <base-icon :icon="item.icon" color="#ffffff"></base-icon>
      </div>
    </li>
  </ul>
</template>

<script>
import { reactive, toRefs } from "vue";
import BaseIcon from "../../../base/BaseIcon.vue";
export default {
  components: {
    BaseIcon,
  },

  emits: {
    handle: null,
  },

  setup(props, context) {
    const state = reactive({
      buttonList: [
        {
          icon: "arrowLeft",
          command: "moveLeft",
        },
        {
          icon: "arrowRight",
          command: "moveRight",
        },
        {
          icon: "arrowUp",
          command: "moveUp",
        },
        {
          icon: "arrowDown",
          command: "moveDown",
        },
        {
          icon: "zoomUp2",
          command: "zoomUp",
        },
        {
          icon: "zoomDown2",
          command: "zoomDown",
        },
      ],
    });

    function handle(command) {
      context.emit("handle", command);
    }

    return {
      ...toRefs(state),
      handle,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";
.button-list {
  @include flex-row-center;
  padding-top: 15px;
  .item {
    padding: 0 3px;
    .card {
      @include flex-row-center;
      width: 34px;
      height: 34px;
      box-shadow: 0 0 3px $theme-color;
      border-radius: 50%;
      background-color: $theme-color;
      color: #ffffff;
      cursor: pointer;
      &:active {
        box-shadow: 0 0 10px $theme-color;
      }
    }
  }
}
</style>