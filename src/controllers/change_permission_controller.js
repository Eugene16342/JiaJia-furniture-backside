import { ref } from "vue";
import api from "../utils/api";
import { ElNotification } from "element-plus";
/*
 ElNotification({
          title: "成功",
          message: "新增人員",
          type: "success",
        });

*/

// 已有的權限
export const owned_permissions = ref([]);
export const select_role = ref("");

// 獲取特定角色的權限
export const get_role_permission = async () => {
  try {
    const res = await api.get("/admin/get_role_permissions", {
      params: { role_id: select_role.value },
    });

    owned_permissions.value = res.data.permission_ids;
  } catch (error) {
    console.error("獲取該角色權限失敗!", error);

    ElNotification({
      title: "錯誤",
      message: "獲取該角色權限失敗!",
      type: "error",
    });
  }
};

// 換角色就觸發請求
export const role_change = async () => {
  if (!select_role.value) {
    owned_permissions.value = [];
    return;
  }

  try {
    await get_role_permission();
  } catch (error) {
    console.error("更新權限分布失敗!", error);
  }
};

// 保存請求
export const save_change = async () => {
  try {
    console.log("看我", select_role.value, owned_permissions.value);
    if (!select_role.value || owned_permissions.value.length === 0) {
      ElNotification({
        title: "通知",
        message: "請選擇角色和權限!",
        type: "info",
      });
      return;
    }

    const res = await api.post("/admin/save_role_permission_change", {
      role_id: select_role.value,
      permission_ids: owned_permissions.value,
    });

    if (res.status === 200) {
      ElNotification({
        title: "成功",
        message: "權限更動以保存!",
        type: "success",
      });
    }
  } catch (error) {
    console.error("保存更動失敗!");

    if (error.status === 403) {
      ElNotification({
        title: "錯誤",
        message: "不能更動自己的權限!",
        type: "error",
      });

      return;
    }

    ElNotification({
      title: "錯誤",
      message: "保存權限修改失敗!",
      type: "error",
    });
  }
};
