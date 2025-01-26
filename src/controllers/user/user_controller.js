import { ref, reactive } from "vue";
import api from "../../utils/api";
import { ElNotification } from "element-plus";

/*
 ElNotification({
      title: "錯誤",
      message: "新增人員失敗，請稍後再試！",
      type: "error",
    });
*/

// 搜索欄位和關鍵字
export const select = ref("");
export const keyword = ref("");
// 載入的資訊
export const user_data = ref([]);
// 總筆數
export const total_data = ref(0);
// 總頁數
export const total_pages = ref(0);
// 當前頁
export const current_page = ref(1);
// 每頁顯示數量
export const page_size = ref(10);

// 獲取 / 查詢使用者資訊
export const get_user_data = async () => {
  try {
    const res = await api.get("user/get_user_data", {
      params: {
        select: select.value,
        keyword: keyword.value,
        page: current_page.value,
        limit: page_size.value,
      },
    });

    const {
      data,
      total,
      current_page: api_current_page,
      total_pages: api_total_pages,
    } = res.data;

    user_data.value = data;
    total_data.value = total;
    total_pages.value = api_total_pages;
    current_page.value = api_current_page;
  } catch (error) {
    console.error("獲取使用者資訊失敗!", error);

    ElNotification({
      title: "錯誤",
      message: "獲取使用者資訊失敗!",
      type: "error",
    });
  }
};

export const change_page = async (page) => {
  current_page.value = page;
  await get_user_data();
};

export const search = async () => {
  if (!select.value) {
    ElNotification({
      title: "通知",
      message: "請選擇搜索欄位！",
      type: "info",
    });
    return;
  }

  current_page.value = 1;
  await get_user_data();
};
