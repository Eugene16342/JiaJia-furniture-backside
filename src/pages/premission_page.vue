<template>
  <div class="page">
    <el-tabs
      v-model="active_name"
      class="demo-tabs"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="人員">
        <el-button
          type="primary"
          :class="{ active: active === 1 }"
          @click="to('admin_management', { view: 1 }, 1)"
          plain
          >人員一覽</el-button
        >
        <el-button
          type="primary"
          :class="{ active: active === 2 }"
          @click="to('admin_management', { view: 2 }, 2)"
          plain
          >新增人員</el-button
        >
      </el-tab-pane>
      <el-tab-pane label="權限">
        <el-button
          type="primary"
          :class="{ active: active === 3 }"
          @click="to('permission_control', { view: 1 }, 3)"
          plain
          >新增角色</el-button
        >
        <el-button
          type="primary"
          :class="{ active: active === 4 }"
          @click="to('permission_control', { view: 2 }, 4)"
          plain
          >更改權限</el-button
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

const to = (path, query, view) => {
  active.value = view;
  router.push({ name: path, query });
};
</script>

<style lang="scss" scoped>
.page {
}
</style>
