import { ref } from "vue";
import api from "../../utils/api";
import { ElNotification } from "element-plus";

export const form = ref({
  product_id: "",
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

// 獲取產品資訊
export const get_product_info = async (product_id) => {
  try {
    const res = await api.get(`/product/get_product_info/${product_id}`);

    form.value = {
      product_id: res.data.product_id,
      name: res.data.name,
      category: res.data.category_id,
      material: res.data.materials,
      length: res.data.length,
      width: res.data.width,
      height: res.data.height,
      colors: res.data.colors,
      description: res.data.description,
      price: res.data.price,
      quantity: res.data.quantity,
      img_list: res.data.img_list.map((img) => ({
        name: img.split("/").pop(),
        url: img,
      })),
    };
  } catch (error) {
    console.error("獲取商品資訊失敗!", error);
    ElNotification({
      title: "錯誤",
      message: "獲取產品資訊失敗",
      type: "error",
    });
  }
};

// 種類選項
export const category_option = ref([]);
// 顏色選項
export const colors_opnition = ref([]);

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

// 轉換圖片為 base64 如果已經是 就不必轉換
const convert_img = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof Blob)) {
      reject(new Error("無效的文件類型"));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// 發出請求
export const edit_product = async () => {
  try {
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

    // 確保只有新上傳的檔案轉成 Base64
    const base64_images = await Promise.all(
      form.value.img_list.map((file) => {
        if (file.raw) {
          return convert_img(file.raw);
        } else {
          return file.url; // 如果是已存在的圖片，直接傳 URL
        }
      })
    );

    // 送出商品資訊
    const res = await api.put("/product/edit_product_info", {
      ...form.value,
      img_list: base64_images,
    });

    ElNotification({
      title: "成功",
      message: "商品編輯成功!",
      type: "success",
    });
  } catch (error) {
    console.error("新增商品失敗!", error);
    ElNotification({
      title: "錯誤",
      message: "編輯商品失敗，請稍後再試!",
      type: "error",
    });
  }
};
