const fs = require("fs");
const path = require("path");

// 設定上傳資料夾
const base_upload_path = path.join(__dirname, "../../public/product");

// 確保基礎 product 目錄存在
if (!fs.existsSync(base_upload_path)) {
  fs.mkdirSync(base_upload_path, { recursive: true });
}

// 上傳圖片函式
exports.upload_image = async (base64Image, category_name, productId) => {
  try {
    category_name = category_name.toLowerCase();
    // 確保類別合法
    const allowed_categories = ["bed", "chair", "desk", "light", "sofa"];
    if (!allowed_categories.includes(category_name)) {
      throw new Error("無效的商品分類");
    }

    // 設定商品的專屬資料夾（例：public/product/sofa/sofa30）
    const product_folder = `${category_name}${productId}`;
    const upload_path = path.join(
      base_upload_path,
      category_name,
      product_folder
    );

    // 確保該商品專屬資料夾存在
    if (!fs.existsSync(upload_path)) {
      fs.mkdirSync(upload_path, { recursive: true });
    }

    // 解析 Base64 格式圖片
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // 取得該資料夾內現有的圖片數量，計算新圖片的索引
    const files = fs.readdirSync(upload_path);
    const existing_images = files.filter((file) =>
      file.startsWith(`${category_name}_${productId}_`)
    );
    const imageIndex = existing_images.length + 1; // 確保圖片序號遞增

    // 產生圖片檔名（例如 sofa_30_1.jpg, sofa_30_2.jpg）
    const fileName = `${category_name}_${productId}_${imageIndex}.jpg`;
    const filePath = path.join(upload_path, fileName);

    // 儲存圖片
    await fs.promises.writeFile(filePath, buffer);

    // 回傳圖片的存取 URL，前端可以用來顯示圖片
    return `/product/${category_name}/${product_folder}/${fileName}`;
  } catch (error) {
    console.error("圖片上傳失敗:", error);
    throw new Error("圖片上傳失敗");
  }
};
