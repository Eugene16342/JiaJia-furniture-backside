<template>
  <div class="page">
    <el-tabs class="demo-tabs" type="border-card">
      <el-tab-pane label="會員">
        <el-button
          type="primary"
          :class="{ active: active === 1 }"
          @click="to('user_data', 1)"
          plain
          >會員資料</el-button
        >
        <el-button
          type="primary"
          :class="{ active: active === 2 }"
          @click="to('order_data', 2)"
          plain
          >訂單一覽</el-button
        >
      </el-tab-pane>
    </el-tabs>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const active = ref(null);

const to = (path, view) => {
  active.value = view;
  router.push({ name: path });
};

const update_active = () => {
  if (route.name === "user_data") {
    active.value = 1;
  } else if (route.name === "order_data") {
    active.value = 2;
  }
};

watch(
  () => route.name,
  () => {
    update_active();
  }
);

onMounted(() => {
  update_active();
});
</script>

<style lang="scss" scoped></style>
