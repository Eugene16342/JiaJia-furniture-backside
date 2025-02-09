<template>
  <div class="component">
    <div class="container">
      <!-- 搜索框 -->
      <div>
        <el-input
          v-model="keyword"
          style="width: 500px; margin-bottom: 20px"
          placeholder="請輸入關鍵字"
          class="input-with-select"
          clearable
          @keyup.enter="search"
        >
          <template #prepend>
            <el-button icon="Search" @click="search" />
          </template>
        </el-input>
      </div>

      <!-- 表格 -->
      <el-table
        :data="product_data"
        style="width: 100%"
        :row-class-name="row_color"
        @sort-change="sort_change"
      >
        <el-table-column prop="product_id" label="序號" />
        <el-table-column prop="name" label="名稱" />
        <el-table-column prop="product_stock.sales" sortable label="銷量" />
        <el-table-column prop="product_stock.stock" sortable label="庫存" />
        <el-table-column prop="product_stock.safety_stock" label="安全庫存" />
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
import { onMounted } from "vue";
import {
  search,
  keyword,
  product_data,
  total_data,
  current_page,
  page_size,
  change_page,
  get_product_data,
  sort_change,
} from "../../controllers/data/product_sales_controller";

const row_color = ({ row }) => {
  return row.product_stock.stock < row.product_stock.safety_stock
    ? "lower_stock"
    : "";
};

onMounted(async () => {
  await get_product_data();
});
</script>

<style lang="scss" scoped>
@import "../../assets/colors.scss";

el-input {
  margin-bottom: 20px;
}

:deep(.lower_stock) {
  --el-table-tr-bg-color: var(--el-color-warning-light-8);
}
</style>
