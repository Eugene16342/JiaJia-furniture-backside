const fs = require("fs");
const path = require("path");

// 設定上傳資料夾
const base_upload_path = path.join(__dirname, "../../public/product");

// 確保基礎 product 目錄存在
if (!fs.existsSync(base_upload_path)) {
  fs.mkdirSync(base_upload_path, { recursive: true });
}

// 上傳圖片函式
exports.upload_image = async (base64_image, category_name, product_id) => {
  try {
    category_name = category_name.toLowerCase();
    const allowed_categories = ["bed", "chair", "desk", "light", "sofa"];

    if (!allowed_categories.includes(category_name)) {
      throw new Error("無效的商品分類");
    }

    // 設定商品的專屬資料夾（例：public/product/sofa/sofa30）
    const product_folder = `${category_name}${product_id}`;
    const upload_path = path.join(
      base_upload_path,
      category_name,
      product_folder
    );

    // 確保該商品專屬資料夾存在
    await fs.promises.mkdir(upload_path, { recursive: true });

    // 確保 base64 是字串
    if (typeof base64_image !== "string") {
      throw new Error("無效的圖片格式");
    }

    // 移除前綴 轉成二進制
    const base64Data = base64_image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // 取得該資料夾內現有的圖片數量 計算新圖片的索引
    const files = await fs.promises.readdir(upload_path);
    const existing_images = files.filter((file) =>
      file.startsWith(`${category_name}_${product_id}_`)
    );
    const image_index = existing_images.length + 1; // 確保圖片序號遞增

    // 產生圖片檔名（例如 sofa_30_1.jpg, sofa_30_2.jpg）
    const file_name = `${category_name}_${product_id}_${image_index}.jpg`;
    const file_path = path.join(upload_path, file_name);

    // 儲存圖片
    await fs.promises.writeFile(file_path, buffer);

    // 回傳路徑 存在資料庫內
    return file_name;
  } catch (error) {
    console.error("圖片上傳失敗:", error);
    throw new Error("圖片上傳失敗");
  }
};
