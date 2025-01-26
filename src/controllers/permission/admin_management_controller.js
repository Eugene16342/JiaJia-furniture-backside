import { ref, reactive } from "vue";
import api from "../../utils/api";
import { ElNotification } from "element-plus";

export const roles = ref([]);

// 獲取 role 選項
export const get_role = async () => {
  try {
    const res = await api.get("/permission/get_role");
    roles.value = res.data;
  } catch (error) {
    console.error("獲取 role 選項失敗!", error);
  }
};

// 表單數據模型
export const getForm = () => {
  return reactive({
    admin_id: "",
    name: "",
    role_id: "",
  });
};

// 只能輸入英文和數字
export const eng_num_only = (value) => {
  return value.replace(/[^a-zA-Z0-9]/g, "");
};

// 禁止空白字符
export const no_blank = (value) => {
  return value.replace(/\s/g, "");
};

// 驗證規則
export const form_rules = () => {
  return reactive({
    admin_id: [
      { required: true, message: "請輸入 ID", trigger: "blur" },
      { min: 5, message: "ID 長度至少為 5 個字元", trigger: "blur" },
    ],
    name: [
      { required: true, message: "請輸入名稱", trigger: "blur" },
      { min: 2, message: "名稱長度至少為 2 個字元", trigger: "blur" },
    ],
    role_id: [{ required: true, message: "請選擇一個身分", trigger: "change" }],
  });
};

// 提交表單
export const submit_form = async (formRef, form) => {
  if (!formRef.value) {
    console.error("表單不存在！");
    ElNotification({
      title: "錯誤",
      message: "新增人員失敗，請稍後再試！",
      type: "error",
    });
    return;
  }

  // 驗證表單數據
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await api.post("auth/register", form);
        ElNotification({
          title: "成功",
          message: "新增人員",
          type: "success",
        });

        // 重置表單
        formRef.value.resetFields();
      } catch (error) {
        console.error("新增人員失敗！", error);

        // ID 重複
        if (error.response && error.response.status === 409) {
          ElNotification({
            title: "錯誤",
            message: "此 ID 已被註冊!",
            type: "error",
          });
        } else {
          // 其他問題
          ElNotification({
            title: "錯誤",
            message: "新增人員失敗，請稍後再試！",
            type: "error",
          });
        }
      }
    } else {
      ElNotification({
        title: "錯誤",
        message: "請檢查所有必填項！",
        type: "warning",
      });
    }
  });
};
