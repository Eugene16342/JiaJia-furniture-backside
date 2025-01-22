import { reactive } from "vue";
import api from "../utils/api";
import { ElNotification } from "element-plus";
/*
  ElNotification({
          title: "伺服器錯誤",
          message: "無法檢查登入狀態，請稍後再試",
          type: "error",
        });

*/

// 獲取 role 選項
export const get_role = async () => {
  try {
    const res = await api.get("auth/get_role");
    return res.data;
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
export const getRules = () => {
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
    console.error("表單引用未定義！");
    return;
  }

  // 驗證表單數據
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 發送表單數據到後端
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
        ElNotification({
          title: "錯誤",
          message: "新增人員失敗!",
          type: "error",
        });
      }
    } else {
      ElNotification({
        title: "表單驗證失敗",
        message: "請檢查所有必填項！",
        type: "warning",
      });
    }
  });
};
