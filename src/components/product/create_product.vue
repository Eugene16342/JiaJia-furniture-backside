<template>
  <div class="component">
    <div class="container">
      <el-row class="row" :gutter="20" justify="space-between">
        <!--左側 -->
        <el-col :span="11">
          <!-- 名稱  -->
          <el-form label-position="top">
            <el-form-item label="商品名稱">
              <el-input
                v-model="input"
                style="width: 240px"
                placeholder="請輸入商品名稱"
                clearable
              />
            </el-form-item>
          </el-form>

          <!--種類 -->
          <el-form label-position="top">
            <el-form-item label="種類">
              <el-input
                v-model="input"
                style="width: 240px"
                placeholder="請輸入商品名稱"
                clearable
              />
            </el-form-item>
          </el-form>

          <!-- 材質 -->
          <el-form label-position="top">
            <el-form-item label="材質">
              <el-input
                v-model="input"
                style="width: 240px"
                placeholder="請輸入商品名稱"
                clearable
              />
              <el-button type="primary">新增材質</el-button>
            </el-form-item>
          </el-form>

          <!-- 尺寸 -->
          <el-form label-position="top">
            <el-form-item label="尺寸">
              <el-input
                v-model="input"
                style="width: 80px"
                placeholder="長"
                clearable
              />
              <el-input
                v-model="input"
                style="width: 80px"
                placeholder="寬"
                clearable
              />
              <el-input
                v-model="input"
                style="width: 80px"
                placeholder="高"
                clearable
              />
            </el-form-item>
            <span>增加材質</span>
          </el-form>

          <!-- 顏色 -->
          <el-form label-position="top">
            <el-form-item label="顏色">
              <el-input
                v-model="input"
                style="width: 240px"
                placeholder="請輸入商品名稱"
                clearable
              />
            </el-form-item>
          </el-form>

          <!-- 描述 -->
          <el-form label-position="top">
            <el-form-item label="描述">
              <el-input
                v-model="input"
                style="width: 240px"
                placeholder="請輸入商品名稱"
                clearable
              />
            </el-form-item>
          </el-form>
        </el-col>
        <!--右側 -->
        <el-col :span="11">
          <!-- 上傳圖片 -->
          <el-form label-position="top">
            <el-form-item label="上傳圖片">
              <el-upload
                v-model:file-list="fileList"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :before-upload="handleBeforeUpload"
                :auto-upload="false"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>

              <!-- 點擊預覽大圖 -->
              <el-dialog v-model="dialogVisible" title="圖片預覽" width="60%">
                <el-image
                  :src="dialogImageUrl"
                  style="
                    max-width: 100%;
                    max-height: 80vh;
                    margin: auto;
                    display: block;
                  "
                />
              </el-dialog>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const fileList = ref([]);
const dialogVisible = ref(false);
const dialogImageUrl = ref("");

/* 點擊縮略圖時，開啟對話框顯示大圖 */
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url; // 設定預覽圖片的 URL
  dialogVisible.value = true; // 開啟對話框
};

/* 刪除圖片 */
const handleRemove = (file) => {
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid);
};

/* 在上傳前處理圖片：轉為 Base64，實現即時預覽 */
const handleBeforeUpload = (file) => {
  return new Promise((resolve, reject) => {
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("請上傳 JPG 或 PNG 格式的圖片");
      reject();
    } else if (file.size / 1024 > 500) {
      alert("圖片大小不能超過 500KB");
      reject();
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        file.url = reader.result; // 設定圖片的 URL，讓它可以即時預覽
        fileList.value.push(file);
        resolve();
      };
    }
  });
};
</script>
<style lang="scss" scoped>
@import "../../assets/colors.scss";

.row {
  width: 100%;
  padding: 0 10%;
}
</style>
