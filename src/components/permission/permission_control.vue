<template>
  <div class="component">
    <div class="container">
      <!-- 名稱 -->
      <el-input
        v-model="name"
        style="width: 300px"
        placeholder="請輸入角色名稱"
        maxlength="10"
      />

      <!-- 轉換容器 -->
      <el-transfer
        v-model="chose_permission"
        :data="all_permission"
        :titles="['所有權限', '已選權限']"
        class="transfer_container"
      >
        <template #left-empty>
          <!-- 左側 -->
          <el-empty
            class="empty"
            :image-size="100"
            description="角色已獲得所有權限"
          />
        </template>
        <template #right-empty>
          <!-- 右側 -->
          <el-empty
            class="empty"
            :image-size="100"
            description="角色沒有任何權限"
          />
        </template>
      </el-transfer>

      <!-- 建立按鈕 -->
      <el-button type="primary" @click="create_new_role">建立</el-button>
    </div>
  </div>
</template>

<script setup>
import {
  name,
  all_permission,
  chose_permission,
  get_all_permission_option,
  create_new_role,
} from "../../controllers/permission/permission_controller";
import { onMounted } from "vue";

onMounted(async () => {
  await get_all_permission_option();
});
</script>

<style lang="scss" scoped>
.transfer_container {
  margin: 40px 0;
}

@media (min-width: 1215px) {
  .transfer_container {
    --el-transfer-panel-width: 400px;
  }
}
</style>
