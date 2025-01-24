<template>
  <div class="component">
    <div class="container">
      <!-- 選擇 -->
      <el-select
        v-model="name"
        style="width: 300px"
        placeholder="請選擇角色名稱"
        clearable
      >
        <el-option
          v-for="role in roles"
          :key="role.id"
          :label="role.name"
          :value="role.name"
        />
      </el-select>

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
      <el-button type="primary" @click="create_new_role">修改</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const name = ref("");

const roles = ref([
  { id: 1, name: "管理員" },
  { id: 2, name: "編輯者" },
  { id: 3, name: "訪客" },
]);
</script>

<style lang="scss" scoped>
@import "../../assets/colors.scss";
.transfer_container {
  margin: 40px 0;
}

@media (min-width: 1215px) {
  .transfer_container {
    --el-transfer-panel-width: 400px;
  }
}
</style>
