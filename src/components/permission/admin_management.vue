<template>
  <div class="component">
    <div v-if="current_view == 1" class="container">
      <div></div>
      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        label-width="auto"
        style="max-width: 600px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <!-- ID -->
        <el-form-item class="test" label="ID" prop="admin_id">
          <el-input
            clearable
            v-model="form.admin_id"
            :maxlength="15"
            @input="check_admin_id"
          />
        </el-form-item>

        <!-- 名稱 -->
        <el-form-item class="test" label="名稱" prop="name">
          <el-input
            clearable
            v-model="form.name"
            :maxlength="10"
            @input="check_name"
          />
        </el-form-item>

        <!-- 身分 -->
        <el-form-item class="test" label="身分" prop="role_id">
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

      <el-button type="primary" @click="submit">提交</el-button>
    </div>

    <div v-if="current_view == 2" class="container"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  get_role,
  getForm,
  getRules,
  no_blank,
  eng_num_only,
  submit_form,
} from "../../controllers/admin_management_controller";

const route = useRoute();
const current_view = ref(1);
const roles = ref([]);
const form = getForm();
const rules = getRules();
const ruleFormRef = ref(null);

const check_admin_id = (value) => {
  form.admin_id = eng_num_only(value);
};

const check_name = (value) => {
  form.name = no_blank(value);
};

const submit = () => {
  submit_form(ruleFormRef, form);
};

onMounted(async () => {
  roles.value = await get_role();
});

watch(
  () => route.query.view,
  (new_view) => {
    if (new_view) {
      current_view.value = new_view;
    }
  },
  { immediate: true } // 初始化時執行
);
</script>

<style lang="scss" scoped>
.component {
  margin-top: 20px;
  width: 100%;
  height: 100%;
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.el-form {
  display: flex;
  flex-direction: column;
}

.test {
  width: 300px;
}
</style>
