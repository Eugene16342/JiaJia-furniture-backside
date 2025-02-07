import { ref, reactive } from "vue";
import api from "../../utils/api";
import { ElNotification } from "element-plus";

export const keyword = ref("");

export const product_data = ref([]);

// 總筆數
export const total_data = ref(0);

// 總頁數
export const total_pages = ref(0);

// 當前頁
export const current_page = ref(1);

// 每頁顯示數量
export const page_size = ref(10);

// 排序相關
export const sort_column = ref("product_id"); // 預設以 product_id 排序
export const sort_order = ref("asc"); // 預設為升序

export const search = async () => {
  current_page.value = 1;
  await get_product_data();
};

// 獲取 / 查詢商品資訊
export const get_product_data = async () => {
  try {
    const res = await api.get("/data/get_sales_data", {
      params: {
        keyword: keyword.value,
        page: current_page.value,
        limit: page_size.value,
        sort: sort_column.value,
        order: sort_order.value,
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

// 監聽排序變化
export const handleSortChange = ({ prop, order }) => {
  if (!order) {
    // 當使用者點擊取消排序時，回到預設排序
    sort_column.value = "product_id";
    sort_order.value = "asc";
  } else {
    sort_column.value = prop;
    sort_order.value = order === "ascending" ? "asc" : "desc";
  }

  // 重新載入數據
  get_product_data();
};

// 換頁
export const change_page = async (page) => {
  current_page.value = page;
  await get_product_data();
};
