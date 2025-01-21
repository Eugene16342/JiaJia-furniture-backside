const sequelize = require("./config/database"); // 引入資料庫連接
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("資料庫連接成功");
    app.listen(PORT, () => {
      console.log(`伺服器運行中：http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("無法連接資料庫:", err);
  });
