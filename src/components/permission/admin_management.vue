<template>
  <div class="component">
    <div class="container">
      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        label-width="auto"
        style="max-width: 600px"
        class="demo-ruleForm"
        status-icon
      >
        <!-- ID -->
        <el-form-item class="input" label="ID" prop="admin_id">
          <el-input
            clearable
            v-model="form.admin_id"
            :maxlength="15"
            @input="check_admin_id"
          />
        </el-form-item>

        <!-- 名稱 -->
        <el-form-item class="input" label="名稱" prop="name">
          <el-input
            clearable
            v-model="form.name"
            :maxlength="10"
            @input="check_name"
          />
        </el-form-item>

        <!-- 身分 -->
        <el-form-item class="input" label="身分" prop="role_id">
          <el-select
            v-model="form.role_id"
            placeholder="選擇一個身分"
            clearable
          >
            <el-option
              v-for="role in roles"
              :key="role.role_id"
              :label="role.role_name"
              :value="role.role_id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <small>(預設密碼和 ID 相同)</small>
      <el-button type="primary" @click="submit">新增</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import {
  get_role,
  getForm,
  form_rules,
  no_blank,
  eng_num_only,
  submit_form,
} from "../../controllers/admin_management_controller";

const roles = ref([]);
const form = getForm();
const rules = form_rules();
const ruleFormRef = ref(null);

// admin_id 只能輸入英文和數字
const check_admin_id = (value) => {
  form.admin_id = eng_num_only(value);
};

// name 禁止空白
const check_name = (value) => {
  form.name = no_blank(value);
};

// 提交註冊資訊
const submit = () => {
  submit_form(ruleFormRef, form);
};

onMounted(async () => {
  // 獲取 role 選項
  roles.value = await get_role();
});
</script>

<style lang="scss" scoped>
@import "../../assets/colors.scss";

.el-form {
  display: flex;
  flex-direction: column;
}

.input {
  width: 400px;
}

small {
  color: $black5;
  margin-bottom: 20px;
  user-select: none;
}
</style>
