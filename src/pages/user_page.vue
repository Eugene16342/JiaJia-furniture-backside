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
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const active = ref(null);

const to = (path, view) => {
  active.value = view;
  router.push({ name: path });
};
</script>

<style lang="scss" scoped></style>
