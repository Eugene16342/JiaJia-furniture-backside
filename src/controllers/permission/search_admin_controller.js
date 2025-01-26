import { ref, computed } from "vue";
import api from "../../utils/api";
import { ElNotification } from "element-plus";

// 存放管理員資料
export const table_data = ref([]);

// 獲取所有管理員
export const get_all_admin = async () => {
  try {
    const res = await api.get("/admin/get_all_admin");

    table_data.value = res.data;
  } catch (error) {
    console.error("獲取管理員失敗!", error);
  }
};

// 用關鍵字過濾所有管理員
export const filter_admin_table = (table_data, roles, search) => {
  return computed(() => {
    // 獲取 roles 中的 roled_id 找到對應的 role_name
    const get_role_name = (role_id) => {
      const role = roles.value.find((r) => r.role_id === role_id);
      return role.role_name;
    };

    return table_data.value.filter((data) => {
      return (
        // 無關鍵字
        !search.value ||
        // 搜索 ID
        data.admin_id.includes(search.value) ||
        // 搜索名稱
        data.name.includes(search.value) ||
        // 搜索角色
        get_role_name(data.role_id).includes(search.value)
      );
    });
  });
};

// 保存更改
export const save_admin_change = async (row) => {
  try {
    console.log(row);
    const res = await api.post("/admin/save_admin_change", row);

    ElNotification({
      title: "成功",
      message: "更改成功！",
      type: "success",
    });
    return true;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      ElNotification({
        title: "通知",
        message: "無法更改自己的角色！",
        type: "info",
      });
      return false;
    }

    ElNotification({
      title: "錯誤",
      message: "更改失敗，請稍後再試！",
      type: "error",
    });
    console.error("更改失敗!", error);
  }
  return false;
};

// 刪除管理員
export const delete_admin = async (row) => {
  try {
    await api.delete("/admin/delete_admin", {
      data: row,
    });

    ElNotification({
      title: "成功",
      message: "更改成功！",
      type: "success",
    });

    // 移除畫面中被刪除的元素
    const index = table_data.value.findIndex(
      (item) => item.admin_id === row.admin_id
    );
    table_data.value.splice(index, 1);
    return;
  } catch (error) {
    console.error("刪除管理員失敗!", error);

    if (error.response && error.response.status === 403) {
      ElNotification({
        title: "通知",
        message: "無法刪除自己！",
        type: "info",
      });
      return;
    }

    ElNotification({
      title: "錯誤",
      message: "更改失敗，請稍後再試！",
      type: "error",
    });
  }
};
