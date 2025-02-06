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
        </el-input>
      </div>

      <!-- 表格 -->
      <el-table :data="product_data" :border="true" style="margin-top: 50px">
        <!-- 展開 -->
        <el-table-column type="expand">
          <template #default="props">
            <div class="order_items" style="margin: 16px">
              <div>{{ props.row.materials }}</div>
              <div>尺寸:{{ props.row.size }}</div>
              <div>
                <el-tag
                  v-for="(color, index) in props.row.colors"
                  :key="index"
                  type="error"
                  style="margin-right: 5px"
                >
                  {{ color }}
                </el-tag>
              </div>
              <div>{{ props.row.description }}</div>

              <!-- 新增商品按鈕 -->
              <el-button
                style="display: flex; margin: auto"
                type="primary"
                @click="edit_product(props.row.product_id)"
                >編輯商品</el-button
              >
            </div>
          </template>
        </el-table-column>

        <!-- 一般欄位 -->
        <el-table-column label="編號" prop="product_id" />
        <el-table-column label="名稱" prop="name" />
        <el-table-column label="價格" prop="price" />
        <el-table-column label="種類" prop="category_name" />
        <el-table-column label="狀態" prop="status" />
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
import { useRouter } from "vue-router";
import {
  keyword,
  product_data,
  total_data,
  current_page,
  page_size,
  change_page,
  get_product_data,
  search,
} from "../../controllers/product/product_data";

const router = useRouter();

const edit_product = (product_id) => {
  router.push({ path: `/products/edit_product/${product_id}` });
};

onMounted(async () => {
  await get_product_data();
});
</script>

<style lang="scss" scoped>
@import "../../assets/colors.scss";

.order_items {
  font-weight: 600;
  padding-bottom: 5px;
  div {
    margin: 10px 0;
  }
}
</style>
