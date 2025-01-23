<template>
  <div class="page">
    <el-tabs class="demo-tabs" type="border-card">
      <el-tab-pane label="人員">
        <el-button
          type="primary"
          :class="{ active: active === 1 }"
          @click="to('serach_admin', 1)"
          plain
          >人員一覽</el-button
        >
        <el-button
          type="primary"
          :class="{ active: active === 2 }"
          @click="to('admin_management', 2)"
          plain
          >新增人員</el-button
        >
      </el-tab-pane>
      <el-tab-pane label="權限">
        <el-button
          type="primary"
          :class="{ active: active === 3 }"
          @click="to('permission_control', 3)"
          plain
          >更改權限</el-button
        >
        <el-button
          type="primary"
          :class="{ active: active === 4 }"
          @click="to('permission_control', 4)"
          plain
          >新增角色</el-button
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
