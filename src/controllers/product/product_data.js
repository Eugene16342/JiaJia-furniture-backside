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
export const keyword = ref("");
// 載入的資訊
export const product_data = ref([]);
// 總筆數
export const total_data = ref(0);
// 總頁數
export const total_pages = ref(0);
// 當前頁
export const current_page = ref(1);
// 每頁顯示數量
export const page_size = ref(10);

// 獲取 / 查詢使用者資訊
export const get_product_data = async () => {
  try {
    const res = await api.get("/product/get_product_data", {
      params: {
        keyword: keyword.value,
        page: current_page.value,
        limit: page_size.value,
      },
    });

    const { rows, count } = res.data;

    product_data.value = rows;
    total_data.value = count;
  } catch (error) {
    console.error("獲取訂單資訊失敗!", error);

    ElNotification({
      title: "錯誤",
      message: "獲取訂單資訊失敗!",
      type: "error",
    });
  }
};

// 換頁
export const change_page = async (page) => {
  current_page.value = page;
  await get_product_data();
};

// 搜索
export const search = async () => {
  current_page.value = 1;
  await get_product_data();
};
