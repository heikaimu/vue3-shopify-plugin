<template>
  <ul class="images-list" :class="[`wrap-${count}`]">
    <li v-for="(item, index) in list" :key="index" class="item">
      <div class="card">
        <img class="image" :src="item.src.original" alt="" />
      </div>
    </li>
  </ul>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const count = computed(() => {
  return props.list.length;
});
</script>

<style lang="scss" scoped>
.images-list {
  width: 500px;
  display: flex;
  flex-wrap: wrap;
}
.item {
  flex: 0 0 33.33%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-sizing: border-box;
  .card {
    width: 100%;
    height: 100%;
    background: #eee;
    border-radius: 8px;
    .image {
      display: block;
      border-radius: 8px;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
.wrap-1 {
  .item {
    flex: 0 0 100%;
    margin: 0;
    height: 360px;
  }
}
.wrap-2 {
  .item {
    flex: 0 0 50%;
    margin-right: 0;
    height: 220px;
  }
  .item:nth-child(2) {
    margin-right: 0;
  }
}
.wrap-3 {
  .item:nth-child(1) {
    flex: 0 0 100%;
    margin: 0;
    height: 200px;
  }
  .item:nth-child(2),
  .item:nth-child(3) {
    flex: 0 0 50%;
  }
  .item:nth-child(3) {
    margin-right: 0;
  }
}
.wrap-4 {
  .item {
    flex: 0 0 50%;
    height: 200px;
  }
}
.wrap-5 {
  .item:nth-child(1),
  .item:nth-child(2) {
    flex: 0 0 50%;
  }
  .item:nth-child(3),
  .item:nth-child(4),
  .item:nth-child(5) {
    flex: 0 0 33.33%;
  }
}
.wrap-6,
.wrap-9 {
  .item {
    flex: 0 0 33.33%;
  }
}
.wrap-7 {
  .item:nth-child(2),
  .item:nth-child(4),
  .item:nth-child(5),
  .item:nth-child(6),
  .item:nth-child(7) {
    flex: 0 0 33.33%;
  }
  .item:nth-child(1),
  .item:nth-child(3) {
    flex: 0 0 66.66%;
  }
}
.wrap-8 {
  .item:nth-child(3),
  .item:nth-child(4),
  .item:nth-child(5),
  .item:nth-child(6),
  .item:nth-child(7),
  .item:nth-child(8) {
    flex: 0 0 33.33%;
  }
  .item:nth-child(1),
  .item:nth-child(2) {
    flex: 0 0 50%;
  }
}
</style>