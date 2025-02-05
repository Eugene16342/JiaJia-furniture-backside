import { ref, nextTick } from "vue";
import api from "../../utils/api";
import { ElNotification } from "element-plus";

export const form = ref({
  name: "",
  category: "",
  material: "",
  length: "",
  width: "",
  height: "",
  colors: [],
  description: "",
  price: "",
  quantity: "",
  img_list: [],
});

// 種類選項
export const category_option = ref([]);
// 顏色選項
export const colors_opnition = ref([]);

// 預覽圖片
export const show_img = ref(false);
// 預覽圖片位置
export const img_url = ref("");

// 獲取種類選項
export const get_product_category_option = async () => {
  try {
    const res = await api.get("/product/get_product_category");

    category_option.value = res.data;
  } catch (error) {
    console.error("獲取種類選項失敗!", error);
  }
};

// 獲取顏色選項
export const get_colors_option = async () => {
  try {
    const res = await api.get("/product/get_colors");

    colors_opnition.value = res.data;
  } catch (error) {
    console.error("獲取顏色選項失敗!", error);
  }
};

// 放大預覽圖
export const watch_img = (file) => {
  img_url.value = file.url;
  show_img.value = true;
};

// 刪除圖片
export const remove_img = (file) => {
  form.value.img_list = form.value.img_list.filter(
    (item) => item.uid !== file.uid
  );
};

// 檢查檔案
export const check_file = (file, file_list) => {
  const allowed_types = ["image/jpeg", "image/png"];
  const allowed_extensions = ["jpg", "jpeg", "png"];
  const max_size = 2 * 1024 * 1024; // 限制 2MB

  // 檢查副檔名
  const file_extension = file.name.split(".").pop().toLowerCase();
  const file_type = file.raw ? file.raw.type : file.type;

  // 檢查格式
  if (
    !allowed_types.includes(file_type) &&
    !allowed_extensions.includes(file_extension)
  ) {
    ElNotification({
      title: "錯誤",
      message: "只接受 JPG 和 PNG 格式!",
      type: "error",
    });

    // 從 img_list 移除不符合的檔案
    nextTick(() => {
      form.value.img_list = form.value.img_list.filter(
        (f) => f.uid !== file.uid
      );
    });

    return;
  }

  // 檢查大小
  if (file.size > max_size) {
    ElNotification({
      title: "錯誤",
      message: `圖片大小不能超過 2MB !`,
      type: "error",
    });

    nextTick(() => {
      form.value.img_list = form.value.img_list.filter(
        (f) => f.uid !== file.uid
      );
    });

    return;
  }
  form.value.img_list = [...file_list];
};

export const product_form = ref(null);

// 驗證規則
export const rules = ref({
  name: [{ required: true, message: "請輸入商品名稱", trigger: "blur" }],
  category: [{ required: true, message: "請選擇商品種類", trigger: "change" }],
  material: [{ required: true, message: "請輸入材質", trigger: "blur" }],
  length: [{ required: true, message: "請輸入長度", trigger: "blur" }],
  width: [{ required: true, message: "請輸入寬度", trigger: "blur" }],
  height: [{ required: true, message: "請輸入高度", trigger: "blur" }],
  description: [{ required: true, message: "請輸入描述", trigger: "blur" }],
  price: [{ required: true, message: "請輸入價格", trigger: "blur" }],
  quantity: [{ required: true, message: "請輸入當前庫存量", trigger: "blur" }],
  img_list: [
    { required: true, message: "請至少上傳兩張圖片", trigger: "change" },
  ],
});

// 新增商品
export const create_product = async () => {
  console.log("跨襪", form.value, form);
  const valid = await product_form.value.validate();
  if (!valid) {
    ElNotification({
      title: "通知",
      message: "請填寫必填欄位!",
      type: "info",
    });
    return;
  }

  if (form.value.img_list.length < 2) {
    ElNotification({
      title: "通知",
      message: "請至少上傳兩張圖片!",
      type: "info",
    });
    return;
  }

  // 驗證通過 發出請求
  try {
    const res = await api.post("/product/create_product", form.value);

    ElNotification({
      title: "成功",
      message: "商品新增成功!",
      type: "success",
    });

    reset_form();
  } catch (error) {
    console.error("新增商品失敗!", error);
    ElNotification({
      title: "錯誤",
      message: "新增商品失敗，請稍後再試!",
      type: "error",
    });
  }
};

// 清空表單
const reset_form = () => {
  form.value = {
    name: "",
    category: "",
    material: "",
    length: "",
    width: "",
    height: "",
    colors: [],
    description: "",
    price: "",
    quantity: "",
    img_list: [],
  };
};
