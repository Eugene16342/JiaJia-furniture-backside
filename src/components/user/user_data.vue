<template>
  <div class="component">
    <div class="container">
      <!-- 搜索框 -->
      <div>
        <el-input
          v-model="keyword"
          style="width: 500px"
          placeholder="請輸入關鍵字"
          class="input-with-select"
          clearable
          @keyup.enter="search"
        >
          <template #prepend>
            <el-button icon="Search" @click="search" />
          </template>
          <template #append>
            <el-select
              v-model="select"
              placeholder="搜索欄位"
              style="width: 115px"
              clearable
            >
              <el-option label="帳號" value="user_name" />
              <el-option label="信箱" value="email" />
            </el-select>
          </template>
        </el-input>
      </div>

      <!-- 表格 -->
      <el-table :data="user_data" :border="true" style="margin-top: 50px">
        <!-- 展開 -->
        <el-table-column type="expand">
          <template #default="props">
            <div class="details" style="margin: 16px">
              <p>
                姓名 : {{ props.row.user_detail.last_name
                }}{{ props.row.user_detail.first_name }}
              </p>
              <p>連絡電話 : {{ props.row.user_detail.phone }}</p>
              <p>地址 : {{ props.row.user_detail.address }}</p>
              <el-button
                type="primary"
                round
                @click="view_user_order(props.row.user_name)"
                >查看訂單詳情</el-button
              >
            </div>
          </template>
        </el-table-column>

        <!-- 一般欄位 -->
        <el-table-column label="帳號" prop="user_name" />
        <el-table-column label="信箱" prop="email" />
        <el-table-column label="狀態" prop="status" />
        <el-table-column label="創建日期" prop="created_at" />
        <el-table-column label="最後更新" prop="update_at" />
      </el-table>

      <!-- 分頁 -->
      <el-pagination
        style="margin: 50px 0"
        layout="prev, pager, next"
        :total="total_data"
        :current-page="current_page"
        :page-size="page_size"
        @current-change="change_page"
      />
    </div>
  </div>
</template>

<script setup>
import {
  select,
  keyword,
  user_data,
  total_data,
  current_page,
  page_size,
  change_page,
  get_user_data,
  search,
} from "../../controllers/user/user_controller";

import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 導向選定使用者的訂單
function view_user_order(user_account) {
  router.push({
    path: "order_data",
    query: {
      user_name: user_account,
      select: "user_name",
    },
  });
}

onMounted(async () => {
  await get_user_data();
});
</script>

<style lang="scss" scoped>
@import "../../assets/colors.scss";

.details {
  display: flex;
  flex-direction: column;
  padding: 10px 5px;

  p {
    padding: 10px 5px;
    font-weight: 600;
  }
  .el-button {
    margin: auto;
  }
}
</style>
