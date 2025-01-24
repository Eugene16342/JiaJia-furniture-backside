import { ref } from "vue";
import api from "../utils/api";
import { ElNotification } from "element-plus";
/**
 
 ElNotification({
      title: "成功",
      message: "更改成功！",
      type: "success",
    });

 */

export const all_permission = ref([]);
export const chose_permission = ref([]);
export const name = ref("");

// 獲取所有權限選項
export const get_all_permission_option = async () => {
  try {
    const res = await api.get("/admin/get_all_permission_option");

    if (res.data) {
      // 將回傳資料轉成 el-transfer 的格式
      all_permission.value = res.data.map((item) => ({
        key: item.permission_id, // permission_id 對應到 key
        label: item.permission_name, // permission_name 對應到 label
      }));
    }
  } catch (error) {
    console.error("獲取權限選項失敗!", error);
    ElNotification({
      title: "錯誤",
      message: "無法獲取權限選項，請稍後再試。",
      type: "error",
    });
  }
};

// 檢查參數
export const validate_inputs = (role_name, chose_permission_ids) => {
  if (!role_name) {
    ElNotification({
      title: "錯誤",
      message: "請填寫角色名稱。",
      type: "error",
    });
    return false;
  }
  if (chose_permission_ids.length === 0) {
    ElNotification({
      title: "錯誤",
      message: "請至少選擇一項權限。",
      type: "error",
    });
    return false;
  }
  return true;
};

// 建立新角色
export const create_new_role = async () => {
  try {
    const role_name = name.value;
    const chose_permission_ids = [...chose_permission.value];

    console.log("看我啦!", chose_permission_ids);

    // 執行檢查
    if (!validate_inputs(role_name, chose_permission_ids)) {
      return;
    }

    await api.post("/admin/create_new_role", {
      name: role_name,
      permissions: chose_permission_ids,
    });

    name.value = "";
    chose_permission.value = [];

    ElNotification({
      title: "成功",
      message: "成功建立新角色!。",
      type: "success",
    });
  } catch (error) {
    console.error("建立新角色失敗!", error);

    if (error.status === 403) {
      ElNotification({
        title: "錯誤",
        message: "名稱已被註冊!。",
        type: "error",
      });
      return;
    }

    ElNotification({
      title: "錯誤",
      message: "建立新角色失敗!。",
      type: "error",
    });
  }
};
