<template>
  <div class="page">
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="商品一覽" name="first">人員管理</el-tab-pane>
      <el-tab-pane label="新增商品" name="second">權限控制</el-tab-pane>
      <el-tab-pane label="操作紀錄" name="third">操作紀錄</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.page {
}
</style>
