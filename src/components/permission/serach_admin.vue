<template>
  <div class="component">
    <div class="container">
      <!-- 表格 -->
      <el-table :data="filter_table_data" stripe style="width: 100%">
        <!-- index -->
        <el-table-column width="60" label="序號" prop="index">
          <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>

        <!-- ID -->
        <el-table-column label="ID" prop="admin_id" />

        <!-- 名稱 -->
        <el-table-column label="名稱" prop="name" />

        <!-- 角色選單 -->
        <el-table-column label="角色">
          <template #default="scope">
            <el-select
              v-model="scope.row.role_id"
              placeholder="選擇角色"
              size="small"
              :disabled="isEditable !== scope.$index"
              style="width: 100px"
            >
              <el-option
                v-for="role in roles"
                :key="role.role_id"
                :label="role.role_name"
                :value="role.role_id"
              />
            </el-select>
          </template>
        </el-table-column>

        <!-- 搜索 -->
        <el-table-column align="default">
          <template #header>
            <el-input
              v-model="search"
              size="default"
              placeholder="ID 、名稱或角色"
            />
          </template>

          <!-- 動作 -->
          <template #default="scope">
            <el-button
              size="small"
              @click="handle_edit(scope.$index, scope.row)"
              v-if="isEditable !== scope.$index"
            >
              編輯
            </el-button>
            <el-button
              size="small"
              type="success"
              @click="handle_save(scope.row)"
              v-if="isEditable === scope.$index"
            >
              保存
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handle_delete(scope.row)"
              v-if="isEditable !== scope.$index"
            >
              刪除
            </el-button>
            <el-button
              size="small"
              @click="handle_cancel(scope.row)"
              v-if="isEditable === scope.$index"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  table_data,
  get_all_admin,
  filter_admin_table,
  save_admin_change,
  delete_admin,
} from "../../controllers/search_admin_controller";
import { get_role } from "../../controllers/admin_management_controller";

// 儲存角色選項
const roles = ref([]);

// 搜索框的輸入值
const search = ref("");

// 誰能編輯
const isEditable = ref([]);

// 暫存行數據
const temp = ref("");

// 開啟編輯
const handle_edit = (index, row) => {
  isEditable.value = index;
  temp.value = row.role_id;
};

// 取消編輯
const handle_cancel = (row) => {
  row.role_id = temp.value;
  isEditable.value = "";
  temp.value = "";
};

// 保存編輯
const handle_save = async (row) => {
  const isSuccess = await save_admin_change(row);
  if (!isSuccess) {
    handle_cancel(row);
  }
  isEditable.value = "";
};

// 刪除管理員
const handle_delete = async (row) => {
  await delete_admin(row);
};

// 獲取過濾後的表格數據
const filter_table_data = filter_admin_table(table_data, roles, search);

onMounted(async () => {
  roles.value = await get_role();
  await get_all_admin();
});
</script>

<style lang="scss" scoped>
@import "../../assets/colors.scss";

.el-table {
  color: $black;
}
</style>
