<template>
  <div class="page">
    <el-tabs class="demo-tabs" type="border-card">
      <el-tab-pane label="商品">
        <el-button
          type="primary"
          :class="{ active: active === 1 }"
          @click="to('product_data', 1)"
          plain
          >商品一覽</el-button
        >

        <el-button
          type="primary"
          :class="{ active: active === 2 }"
          @click="to('create_product', 2)"
          plain
          >新增商品</el-button
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
