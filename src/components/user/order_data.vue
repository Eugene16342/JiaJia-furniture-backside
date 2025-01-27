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
              <el-option label="單號" value="order_id" />
              <el-option label="收件人" value="name" />
              <el-option label="連絡電話" value="phone" />
            </el-select>
          </template>
        </el-input>
      </div>

      <!-- 表格 -->
      <el-table :data="order_data" :border="true" style="margin-top: 50px">
        <!-- 展開 -->
        <el-table-column type="expand">
          <template #default="props">
            <div class="order_items" style="margin: 16px">
              <div>總金額: {{ props.row.total_price }}</div>
              <div>地址 : {{ props.row.address }}</div>
              <div
                class="order_item"
                v-for="item in props.row.orders_hasmany_order_items"
                :key="item.product_id"
              >
                <span>{{ item.product_name }}</span>
                <span>{{ item.color_name }}</span>
                <span>{{ item.quantity }}</span>
                <span>{{ item.price }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 一般欄位 -->
        <el-table-column label="單號" prop="order_id" />
        <el-table-column label="帳號" prop="user_name" />
        <el-table-column label="收件人" prop="name" />
        <el-table-column label="手機" prop="phone" />
        <el-table-column label="狀態" prop="status" />
        <el-table-column label="下單日期" prop="created_at" />
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
  order_data,
  total_data,
  current_page,
  page_size,
  change_page,
  get_order_data,
  search,
} from "../../controllers/user/order_controller";

import { useRoute } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();

onMounted(async () => {
  const search_name = route.query.user_name;
  const search_select = route.query.select;

  if (search_name && search_select) {
    select.value = search_select;
    keyword.value = search_name;

    await search();
  } else {
    select.value = "";
    keyword.value = "";
    await get_order_data();
  }
});
</script>

<style lang="scss" scoped>
@import "../../assets/colors.scss";

.order_items {
  font-weight: 600;
  .order_item {
    display: flex;
    justify-content: space-around;
    margin: 10px 0;
    font-weight: 300;
    span {
      width: 100px;
    }
  }
}
</style>
