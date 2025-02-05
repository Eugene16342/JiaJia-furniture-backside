<template>
  <div class="component">
    <div class="container">
      <el-form
        ref="product_form"
        :model="form"
        :rules="rules"
        label-position="top"
        style="width: 100%"
      >
        <el-row class="row" justify="space-between">
          <!-- 左側 -->
          <el-col :span="11">
            <el-form-item prop="name" label="商品名稱">
              <el-input
                v-model="form.name"
                style="width: 240px"
                placeholder="請輸入商品名稱"
                clearable
              />
            </el-form-item>

            <el-form-item prop="category" label="種類">
              <el-select
                v-model="form.category"
                placeholder="選擇種類"
                style="width: 240px"
              >
                <el-option
                  v-for="item in category_option"
                  :key="item.category_id"
                  :label="item.name_zh"
                  :value="item.category_id"
                />
              </el-select>
            </el-form-item>

            <el-form-item prop="material" label='材質 (使用 " / " 作為分隔)'>
              <el-input
                v-model="form.material"
                style="width: 240px"
                placeholder="ex:面料: 牛皮 / 框架: 柳安木"
                clearable
              />
            </el-form-item>

            <!-- 尺寸 -->
            <el-form-item label="尺寸(公分)">
              <el-row :gutter="10" style="display: flex; flex-wrap: nowrap">
                <el-form-item prop="length">
                  <el-input
                    class="no_arrow"
                    type="number"
                    style="max-width: 80px"
                    v-model="form.length"
                    placeholder="長"
                    clearable
                  />
                </el-form-item>

                <el-form-item prop="width">
                  <el-input
                    class="no_arrow"
                    type="number"
                    style="max-width: 80px"
                    v-model="form.width"
                    placeholder="寬"
                    clearable
                  />
                </el-form-item>

                <el-form-item prop="height">
                  <el-input
                    class="no_arrow"
                    type="number"
                    style="max-width: 80px"
                    v-model="form.height"
                    placeholder="高"
                    clearable
                  />
                </el-form-item>
              </el-row>
            </el-form-item>

            <el-form-item label="顏色 " prop="colors">
              <el-select
                v-model="form.colors"
                multiple
                collapse-tags
                collapse-tags-tooltip
                placeholder="無顏色"
                style="width: 240px"
              >
                <el-option
                  v-for="item in colors_opnition"
                  :key="item.color_id"
                  :label="item.color_name"
                  :value="item.color_id"
                >
                  <div class="flex items-center">
                    <el-tag :color="item.hex_code" style="margin-right: 8px" />
                    <span>{{ item.color_name }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="描述" prop="description">
              <el-input
                v-model="form.description"
                maxlength="200"
                style="width: 240px"
                placeholder="請輸入內容"
                show-word-limit
                type="textarea"
                :rows="10"
                resize="none"
              />
            </el-form-item>
          </el-col>

          <!-- 右側 -->
          <el-col :span="11">
            <el-form-item prop="price" label="商品價格">
              <el-input
                class="no_arrow"
                type="number"
                v-model="form.price"
                style="width: 240px"
                placeholder="請輸入商品價格"
                clearable
              />
            </el-form-item>

            <el-form-item prop="quantity" label="當前庫存量">
              <el-input
                class="no_arrow"
                type="number"
                v-model="form.quantity"
                style="width: 240px"
                placeholder="請輸入當前庫存量"
                clearable
              />
            </el-form-item>

            <el-form-item
              prop="img_list"
              :label="`上傳圖片 (${form.img_list.length}/10)`"
            >
              <el-upload
                v-model:file-list="form.img_list"
                list-type="picture-card"
                :on-preview="watch_img"
                :on-remove="remove_img"
                :auto-upload="false"
                :on-change="check_file"
                multiple
                :limit="10"
                accept="image/jpeg, image/png"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>

              <!-- 點擊預覽大圖 -->
              <el-dialog v-model="show_img" title="圖片預覽" width="60%">
                <el-image
                  :src="img_url"
                  style="
                    max-width: 100%;
                    max-height: 80vh;
                    margin: auto;
                    display: block;
                  "
                />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 新增商品按鈕 -->
      <el-button type="primary" @click="create_product">新增商品</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import {
  form,
  product_form,
  rules,
  category_option,
  colors_opnition,
  show_img,
  img_url,
  get_product_category_option,
  get_colors_option,
  watch_img,
  remove_img,
  check_file,
  create_product,
} from "../../controllers/product/create_product";

onMounted(async () => {
  await get_product_category_option();
  await get_colors_option();
});
</script>

<style lang="scss" scoped>
@import "../../assets/colors.scss";

.row {
  width: 100%;
  padding: 0 10%;
}

:deep(.no_arrow) input::-webkit-inner-spin-button,
:deep(.no_arrow) input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

:deep(.no_arrow) input[type="number"] {
  -moz-appearance: textfield;
}
</style>
