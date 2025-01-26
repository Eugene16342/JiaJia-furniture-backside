<template>
  <div class="component">
    <div class="container">
      <el-select
        class="select"
        v-model="select_role"
        placeholder="選擇一個身分"
        clearable
        @change="role_change"
      >
        <el-option
          v-for="role in roles"
          :key="role.role_id"
          :label="role.role_name"
          :value="role.role_id"
        />
      </el-select>

      <!-- 轉換容器 -->
      <el-transfer
        v-model="owned_permissions"
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
      <el-button type="primary" @click="save_change()">修改</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import {
  roles,
  get_role,
} from "../../controllers/permission/admin_management_controller";
import {
  all_permission,
  get_all_permission_option,
} from "../../controllers/permission/permission_controller";
import {
  select_role,
  owned_permissions,
  role_change,
  save_change,
} from "../../controllers/permission/change_permission_controller";

onMounted(async () => {
  await get_role();
  await get_all_permission_option();
});
</script>

<style lang="scss" scoped>
@import "../../assets/colors.scss";
.transfer_container {
  margin: 40px 0;
}
.select {
  width: 300px;
}

@media (min-width: 1215px) {
  .transfer_container {
    --el-transfer-panel-width: 400px;
  }
}
</style>
