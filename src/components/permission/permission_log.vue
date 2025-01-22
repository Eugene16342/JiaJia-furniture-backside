<template>
  <div class="component">
    <div v-if="current_view == 1" class="one"></div>

    <div v-if="current_view == 2" class="two"></div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const current_view = ref(1);

watch(
  () => route.query.view,
  (new_view) => {
    if (new_view) {
      current_view.value = new_view;
    }
  },
  { immediate: true } // 初始化時執行
);
</script>

<style lang="scss" scoped>
.component {
  margin-top: 20px;
  .content {
    margin-top: 20px;
  }
}
</style>
