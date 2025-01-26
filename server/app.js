const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const { isAuthenticated } = require("./middleware/authenticate");
const auth_routes = require("./routes/auth");
const admin_routes = require("./routes/admin");
const permission_routes = require("./routes/permission");
const user_routes = require("./routes/user");
const cors = require("cors");

dotenv.config();

const app = express();

// 全域中間件
app.use(
  cors({
    origin: "http://localhost:5173", // 允許的前端來源
    methods: ["GET", "POST", "PUT", "DELETE"], // 允許的 HTTP 方法
    credentials: true, // 允許攜帶憑證（如 Cookie）
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// 設置 Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 小時
      secure: false, // 開發環境設置為 false，生產環境應設為 true 並使用 HTTPS
      httpOnly: true, // 防止客戶端 JavaScript 訪問 Cookie
      sameSite: "lax", // 配置 Cookie 的跨域策略
    },
  })
);

// 註冊路由
app.use("/api/auth", auth_routes);
app.use("/api/permission", isAuthenticated(1), permission_routes);
app.use("/api/admin", isAuthenticated(1), admin_routes);
app.use("/api/user", user_routes);

module.exports = app; // 將 app 導出供 server.js 使用
